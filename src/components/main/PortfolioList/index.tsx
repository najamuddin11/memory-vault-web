import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  memo,
} from "react";
import styles from "./portfolioList.module.css";
import type PortfolioDataType from "../../../models/state-types/PortfolioDataType";
import useWindowSize from "../../../hooks/useWindowSize";

import PortfolioListCard from "./PortfolioListCard";

interface PortfolioPropType {
  porfolios?: PortfolioDataType[];
}

/**
 * Fixed bento pattern (not randomized) - cycles over the list in order.
 * Each card's rest-state size lives here as a { col, row } span. `col`
 * gets clamped to the current column count so nothing overflows a row.
 */
const SPAN_PATTERN: Array<{ col: number; row: number }> = [
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
  { col: 1, row: 1 },
  { col: 2, row: 2 },
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 2, row: 1 },
  { col: 1, row: 2 },
  { col: 1, row: 1 },
];

// How much a card grows (in track units) while hovered.
const HOVER_COL_GROWTH = 1;
const HOVER_ROW_GROWTH = 1;

// How long the mouse has to stay on a card, un-interrupted, before it
// actually grows. Tune to taste.
const HOVER_DELAY_SECONDS = 0.3;

// How long the reflow transition itself takes.
const FLIP_DURATION_SECONDS = 0.5;

// z-index given to whichever card is currently grown, so it isn't briefly
// covered by a neighbor while both are mid-transition.
const HOVERED_Z_INDEX = 1111;

interface CardBox {
  colStart: number;
  rowStart: number;
  colSpan: number;
  rowSpan: number;
}

/**
 * Places every card into explicit grid-column-start / grid-row-start
 * coordinates ourselves, instead of leaning on the browser's implicit
 * `grid-auto-flow: dense` placement. We need this control because when a
 * card near the right edge grows, dense auto-placement is free to
 * relocate it to ANY row it fits in - which reads as the hovered card
 * randomly jumping to a totally different spot.
 *
 * `pinned`, when given, is the hovered card: it gets placed FIRST at a
 * position we've already chosen (see `growCard` below), and every other
 * card is packed around it in original order (row-major, first gap that
 * fits - conceptually the same as `dense`, just computed here so the
 * pinned card can never be the one that moves).
 */
function packCards(
  count: number,
  columns: number,
  spanOf: (index: number) => { col: number; row: number },
  pinned?: { index: number; box: CardBox },
): CardBox[] {
  const boxes: CardBox[] = new Array(count);
  const occupied = new Set<string>();

  const markOccupied = (box: CardBox) => {
    for (let r = box.rowStart; r < box.rowStart + box.rowSpan; r++) {
      for (let c = box.colStart; c < box.colStart + box.colSpan; c++) {
        occupied.add(`${r}:${c}`);
      }
    }
  };

  const fits = (
    colStart: number,
    rowStart: number,
    colSpan: number,
    rowSpan: number,
  ) => {
    if (colStart + colSpan - 1 > columns) return false;
    for (let r = rowStart; r < rowStart + rowSpan; r++) {
      for (let c = colStart; c < colStart + colSpan; c++) {
        if (occupied.has(`${r}:${c}`)) return false;
      }
    }
    return true;
  };

  if (pinned) {
    boxes[pinned.index] = pinned.box;
    markOccupied(pinned.box);
  }

  // Generous upper bound just so the scan loop always terminates - grid
  // rows are unbounded in practice, this is only a safety rail.
  const MAX_ROWS = count + 20;

  for (let i = 0; i < count; i++) {
    if (pinned && i === pinned.index) continue;

    const span = spanOf(i);
    const colSpan = Math.min(span.col, columns);
    const rowSpan = span.row;

    let placed = false;
    for (let r = 1; r <= MAX_ROWS && !placed; r++) {
      for (let c = 1; c <= columns - colSpan + 1; c++) {
        if (fits(c, r, colSpan, rowSpan)) {
          const box = { colStart: c, rowStart: r, colSpan, rowSpan };
          boxes[i] = box;
          markOccupied(box);
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      // Should not happen (rows are unbounded), but keeps the array
      // fully populated defensively.
      boxes[i] = { colStart: 1, rowStart: MAX_ROWS + i, colSpan, rowSpan };
    }
  }

  return boxes;
}

const PortfolioList: React.FC<PortfolioPropType> = ({
  porfolios: portolfios,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  // Every card's rect, captured right before a hover-driven layout change
  // - the "First" in FLIP (First-Last-Invert-Play).
  const rectsBeforeRef = useRef<Map<number, DOMRect>>(new Map());
  // Pending "grow" timer - only fires if the pointer stays put for
  // HOVER_DELAY_SECONDS. Any new hover cancels it.
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cardRefCallbacks = useRef<
    Map<number, (el: HTMLAnchorElement | null) => void>
  >(new Map());

  const getCardRef = useCallback((index: number) => {
    let cb = cardRefCallbacks.current.get(index);
    if (!cb) {
      cb = (el: HTMLAnchorElement | null) => {
        cardRefs.current[index] = el;
      };
      cardRefCallbacks.current.set(index, cb);
    }
    return cb;
  }, []);

  const windowWidth = useWindowSize();
  const columns = windowWidth >= 1024 ? 4 : windowWidth >= 640 ? 3 : 2;
  const itemCount = portolfios?.length ?? 0;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getBaseSpan = useCallback(
    (index: number) => {
      const pattern = SPAN_PATTERN[index % SPAN_PATTERN.length];
      return { col: Math.min(pattern.col, columns), row: pattern.row };
    },
    [columns],
  );

  // The grid's current layout - both size AND position for every card -
  // lives in state. It only ever changes through setLayout, so this array
  // is the single source of truth for "where is everything right now".
  const [layout, setLayout] = useState<CardBox[]>(() =>
    packCards(itemCount, columns, getBaseSpan),
  );

  // The grid's shape (column count, item count) can change independently
  // of hovering - a window resize across a breakpoint, or data loading in.
  // When that happens, start clean from a fresh base layout.
  useEffect(() => {
    setLayout(packCards(itemCount, columns, getBaseSpan));
    setHoveredIndex(null);
  }, [itemCount, columns, getBaseSpan]);

  const captureRects = useCallback(() => {
    const map = new Map<number, DOMRect>();
    cardRefs.current.forEach((el, i) => {
      if (el) map.set(i, el.getBoundingClientRect());
    });
    rectsBeforeRef.current = map;
  }, []);

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // Grows `index` in place, anchored to wherever it's CURRENTLY sitting
  // (read straight from the previous layout state) rather than its
  // pristine base slot - hover is sticky, so those can differ. Everyone
  // else, including whichever card was previously grown, gets packed
  // around it using clean base spans, so the previous one shrinks back
  // automatically as part of the same update.
  const growCard = useCallback(
    (index: number) => {
      setLayout((prevLayout) => {
        const anchor = prevLayout[index];
        if (!anchor) return prevLayout;

        const base = getBaseSpan(index);
        const colSpan = Math.min(base.col + HOVER_COL_GROWTH, columns);
        const rowSpan = base.row + HOVER_ROW_GROWTH;

        // Keep the card anchored where it already is - only shift its
        // start leftward, and only as much as needed to avoid overflowing
        // the grid's right edge. It never relocates to a different
        // row/section just because it grows.
        let colStart = anchor.colStart;
        if (colStart + colSpan - 1 > columns) {
          colStart = Math.max(1, columns - colSpan + 1);
        }

        return packCards(itemCount, columns, getBaseSpan, {
          index,
          box: { colStart, rowStart: anchor.rowStart, colSpan, rowSpan },
        });
      });
    },
    [getBaseSpan, columns, itemCount],
  );

  // Don't grow the card the instant the pointer enters it - queue it, and
  // only actually apply it once the pointer has stayed for the delay.
  // Capture rects right when the timer fires, then mutate layout state -
  // the layout effect below picks up from there.
  const handleHoverStart = useCallback(
    (index: number) => {
      clearHoverTimeout();
      hoverTimeoutRef.current = setTimeout(() => {
        captureRects();
        growCard(index);
        setHoveredIndex(index);
        hoverTimeoutRef.current = null;
      }, HOVER_DELAY_SECONDS * 1000);
    },
    [captureRects, clearHoverTimeout, growCard],
  );

  useEffect(() => clearHoverTimeout, [clearHoverTimeout]);

  // "Last, Invert, Play": runs after the DOM already has the new
  // grid-column/grid-row placement applied (every card is at its real,
  // final position/size - the "Last" rect). For each card that actually
  // moved or resized, jump it back to where it used to be with a
  // transform (no transition - instant, invisible), then on the next
  // frame remove that transform WITH a transition enabled, so the
  // browser animates it from the old spot to the real one.
  //
  // Pointer events are frozen on the grid for the animation's duration:
  // while cards are visually sliding, browsers re-run hit-testing every
  // frame (not just on real mouse movement), so a card sliding under a
  // stationary cursor would otherwise fire a real mouseenter and restart
  // the whole thing mid-transition.
  useLayoutEffect(() => {
    const before = rectsBeforeRef.current;
    if (before.size === 0) return;

    const grid = gridRef.current;
    if (grid) grid.style.pointerEvents = "none";

    const animatedEls: HTMLAnchorElement[] = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const oldRect = before.get(i);
      if (!oldRect) return;

      const newRect = el.getBoundingClientRect();
      const dx = oldRect.left - newRect.left;
      const dy = oldRect.top - newRect.top;
      const scaleX = oldRect.width / newRect.width;
      const scaleY = oldRect.height / newRect.height;

      if (
        Math.abs(dx) < 0.5 &&
        Math.abs(dy) < 0.5 &&
        Math.abs(scaleX - 1) < 0.01 &&
        Math.abs(scaleY - 1) < 0.01
      ) {
        return;
      }

      el.style.transition = "none";
      el.style.transformOrigin = "top left";
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
      animatedEls.push(el);
    });

    rectsBeforeRef.current = new Map();

    if (animatedEls.length === 0) {
      if (grid) grid.style.pointerEvents = "";
      return;
    }

    // Force the browser to register the instant jump above before we
    // start transitioning away from it.
    void animatedEls[0].offsetHeight;

    const rafId = requestAnimationFrame(() => {
      animatedEls.forEach((el) => {
        el.style.transition = `transform ${FLIP_DURATION_SECONDS}s cubic-bezier(0.4, 0, 0.2, 1)`;
        el.style.transform = "";
      });
    });

    const cleanupTimeout = setTimeout(
      () => {
        animatedEls.forEach((el) => {
          el.style.transition = "";
        });
        if (grid) grid.style.pointerEvents = "";
      },
      FLIP_DURATION_SECONDS * 1000 + 50,
    );

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(cleanupTimeout);
    };
  }, [layout]);

  return (
    <section id="portfolio_list_section">
      <div className={`container ${styles.portfolio_list_section_container}`}>
        <div
          ref={gridRef}
          className={styles.porfolios_card_container}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {portolfios?.map((p, index) => {
            const box = layout[index];
            if (!box) return null;
            return (
              <PortfolioListCard
                key={p.id}
                data={p}
                setRef={getCardRef(index)}
                style={{
                  gridColumn: `${box.colStart} / span ${box.colSpan}`,
                  gridRow: `${box.rowStart} / span ${box.rowSpan}`,
                  zIndex: index === hoveredIndex ? HOVERED_Z_INDEX : undefined,
                }}
                onHoverStart={() => handleHoverStart(index)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(PortfolioList);
