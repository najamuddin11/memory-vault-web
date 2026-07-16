import { Outlet } from "react-router";
import "./App.css";
import React, { useEffect, useRef, Suspense } from "react";
import useScrollToTop from "./hooks/useScrollToTop";
import { ReactLenis, type LenisRef } from "lenis/react";
import Loader from "./components/general/Loader";

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
      {/* App-shell chunks (Navbar/MainLayout/Footer) loading - brief, so a
          spinner is right here; each page's own Suspense (see PageLoader)
          handles the shimmer for its actual content. */}
      <Suspense fallback={<Loader center />}>
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
