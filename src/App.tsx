import { useEffect, useRef, useState } from "react";
import { fx } from "./fx";
import { GlobalDefs } from "./components/Svgs";
import { Stars } from "./components/Decor";
import { Intro } from "./components/Intro";
import { Hero } from "./components/Hero";
import { Diyas } from "./components/Diyas";
import { Crackers } from "./components/Crackers";
import { Sweets } from "./components/Sweets";
import { Rangoli } from "./components/Rangoli";
import { Wishes } from "./components/Wishes";
import { Nav } from "./components/ui";

export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [introGone, setIntroGone] = useState(false);

  useEffect(() => {
    if (!canvas.current) return;
    fx.init(canvas.current);
    let lastTap = 0;
    let lastMove = 0;

    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (t.closest("button, a, input, [data-nofx], svg .petal-shape")) return;
      const now = performance.now();
      if (now - lastTap < 140) return;
      lastTap = now;
      fx.rocketTo(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMove < 32) return;
      lastMove = now;
      fx.trail(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      fx.destroy();
    };
  }, []);

  // opening salute once the intro finishes
  useEffect(() => {
    if (!started) return;
    const timers = [0, 450, 900, 1500].map((d) => window.setTimeout(() => fx.skyBurst(), 300 + d));
    const t = window.setTimeout(() => fx.petals(70), 600);
    const t2 = window.setTimeout(() => setIntroGone(true), 1600);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [started]);

  return (
    <div className="relative min-h-screen font-body">
      <GlobalDefs />
      <Stars />
      <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-[60]" />

      {!introGone && <Intro onDone={() => setStarted(true)} />}

      {started && <Nav />}

      <main id="shake-target" className="relative z-10">
        <Hero />
        <Diyas />
        <Crackers />
        <Sweets />
        <Rangoli />
        <Wishes />
      </main>
    </div>
  );
}
