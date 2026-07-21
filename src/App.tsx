import { Outlet } from "react-router";
import "./App.css";
import { useEffect, useRef, Suspense } from "react";
import useScrollToTop from "./hooks/useScrollToTop";
import { ReactLenis, type LenisRef } from "lenis/react";
import PageLoader from "./components/general/PageLoader";

// ✅ Import and register GSAP plugin globally (only once)
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MainLayout from "./components/layout/MainLayout";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const lenisRef = useRef<LenisRef>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time);
      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useScrollToTop();

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {/* App-shell chunks (Navbar/MainLayout/Footer) loading - uses the
          same shimmer language as each page's own Suspense fallback. */}
      <Suspense fallback={<PageLoader />}>
        <MainLayout>
          <Navbar />
          <Outlet />
          <Footer />
        </MainLayout>
      </Suspense>
    </ReactLenis>
  );
};

export default App;
