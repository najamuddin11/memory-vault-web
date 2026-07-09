import { Outlet } from "react-router";
import "./App.css";
import React, { useEffect, useRef, Suspense } from "react";
import useScrollToTop from "./hooks/useScrollToTop";
import { ReactLenis, type LenisRef } from "lenis/react";

// ✅ Import and register GSAP plugin globally (only once)
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// Lazy-loaded layout components
const MainLayout = React.lazy(() => import("./components/layout/MainLayout"));
const Footer = React.lazy(() => import("./components/layout/Footer"));
const Navbar = React.lazy(() => import("./components/layout/Navbar"));

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
      {/* Optional Suspense for lazy-loaded components */}
      <Suspense fallback={<div>Loading...</div>}>
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
