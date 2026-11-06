import { useMemo } from "react";
import { Leaf, Lantern, Marigold } from "./Svgs";

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/* fixed starry night */
export function Stars() {
  const stars = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: 110 }).map((_, i) => ({
      id: i,
      x: r() * 100,
      y: r() * 100,
      s: r() * 2 + 0.8,
      d: r() * 4,
      dur: 2 + r() * 3,
    }));
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#5a1260_0%,#25073f_38%,#0d0220_70%,#05010c_100%)]" />
      <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-fuchsia-700/10 blur-3xl" />
      <div className="absolute -right-40 top-2/3 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-3xl" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-amber-100"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animation: `twinkle ${s.dur}s ease-in-out ${s.d}s infinite`,
            boxShadow: "0 0 6px 1px rgba(255,230,180,.6)",
          }}
        />
      ))}
    </div>
  );
}

/* marigold toran with hanging strands */
export function Toran() {
  const strands = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 select-none">
      {/* top flower bar */}
      <div className="relative flex h-10 items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#7a1f00] to-transparent" />
        <div className="flex flex-none">
          {Array.from({ length: 44 }).map((_, i) => (
            <Marigold key={i} className="-mx-[2px] h-10 w-10 flex-none" style={{ transform: `rotate(${i * 37}deg)` }} />
          ))}
        </div>
      </div>
      {/* pendants */}
      <div className="flex justify-between px-1 sm:px-6">
        {strands.map((i) => {
          const len = 2 + (i % 3);
          const hide = i % 2 === 1 ? "hidden sm:flex" : "flex";
          return (
            <div key={i} className={`swing-sm -mt-2 flex-col items-center ${hide}`} style={{ animationDelay: `${i * 0.25}s`, animationDuration: `${3 + (i % 3) * 0.6}s` }}>
              <div className="h-4 w-px bg-amber-300/60" />
              {Array.from({ length: len }).map((_, k) => (
                <Marigold key={k} className="-mb-1 h-7 w-7 sm:h-9 sm:w-9" style={{ transform: `rotate(${(i + k) * 50}deg)` }} />
              ))}
              <Leaf className="-mt-1 h-9 w-5 sm:h-12 sm:w-6" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* twinkling string of fairy lights */
export function StringLights({ top = 0, swags = 5 }: { top?: number; swags?: number }) {
  const H = 60;
  const bulbs = useMemo(() => {
    const out: { x: number; y: number; c: string; d: number }[] = [];
    const cols = ["#ffd54a", "#ff7043", "#ff4081", "#69f0ae", "#ffb300", "#ffe082"];
    const per = 6;
    for (let s = 0; s < swags; s++) {
      for (let k = 0; k <= per; k++) {
        const t = k / per;
        const x = ((s + t) / swags) * 100;
        const y = 6 + Math.sin(Math.PI * t) * (H - 22);
        out.push({ x, y, c: cols[(s * per + k) % cols.length], d: (s * per + k) * 0.23 });
      }
    }
    return out;
  }, [swags]);
  let d = "";
  for (let s = 0; s < swags; s++) {
    const x0 = (s / swags) * 100;
    const x1 = ((s + 1) / swags) * 100;
    if (s === 0) d += `M${x0} 6 `;
    d += `Q${(x0 + x1) / 2} ${H + 10} ${x1} 6 `;
  }
  return (
    <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top, height: H + 14 }}>
      <svg viewBox={`0 0 100 ${H + 14}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={d} fill="none" stroke="#2a1a05" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className="bulb absolute -ml-[4px] h-3 w-2 rounded-full"
          style={{ left: `${b.x}%`, top: b.y + 2, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${b.d}s` }}
        />
      ))}
    </div>
  );
}

export function Lanterns() {
  return (
    <>
      <div className="swing pointer-events-none absolute left-[3%] top-24 z-10" style={{ animationDuration: "5s" }}>
        <Lantern className="h-40 drop-shadow-[0_0_30px_rgba(255,140,0,.7)] sm:h-56" />
      </div>
      <div className="swing pointer-events-none absolute left-[13%] top-28 z-10 hidden sm:block" style={{ animationDuration: "4.2s", animationDelay: "-1s" }}>
        <Lantern c1="#e91e63" c2="#ff8a65" className="h-32 drop-shadow-[0_0_26px_rgba(255,64,129,.7)]" />
      </div>
      <div className="swing pointer-events-none absolute right-[3%] top-24 z-10" style={{ animationDuration: "4.6s", animationDelay: "-2s" }}>
        <Lantern c1="#7b1fa2" c2="#ffb300" className="h-40 drop-shadow-[0_0_30px_rgba(255,170,0,.7)] sm:h-56" />
      </div>
      <div className="swing pointer-events-none absolute right-[13%] top-28 z-10 hidden sm:block" style={{ animationDuration: "3.8s", animationDelay: "-0.5s" }}>
        <Lantern c1="#00897b" c2="#ffe082" className="h-32 drop-shadow-[0_0_26px_rgba(255,214,0,.6)]" />
      </div>
    </>
  );
}

/* temple / palace skyline silhouette */
export function Skyline({ className = "" }: { className?: string }) {
  const bld = useMemo(() => {
    const r = seeded(21);
    const out: { x: number; w: number; h: number; dome: boolean; spire: boolean; wins: { x: number; y: number; d: number }[] }[] = [];
    let x = 0;
    while (x < 1200) {
      const w = 40 + r() * 70;
      const h = 50 + r() * 110;
      const wins = Array.from({ length: Math.floor(w / 14) * Math.floor(h / 28) }).map((_, i) => {
        const cols = Math.floor(w / 14);
        return { x: 7 + (i % cols) * 14, y: 14 + Math.floor(i / cols) * 24, d: r() * 4 };
      });
      out.push({ x, w, h, dome: r() > 0.55, spire: r() > 0.6, wins: wins.filter(() => r() > 0.35) });
      x += w + r() * 6;
    }
    return out;
  }, []);
  return (
    <svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" className={className}>
      <defs>
        <linearGradient id="skyfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0630" />
          <stop offset="1" stopColor="#07010f" />
        </linearGradient>
      </defs>
      {bld.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${260 - b.h})`}>
          <rect width={b.w} height={b.h + 2} fill="url(#skyfade)" />
          {b.dome && (
            <>
              <path d={`M${b.w * 0.15} 0 C${b.w * 0.15} -${b.w * 0.5} ${b.w * 0.85} -${b.w * 0.5} ${b.w * 0.85} 0Z`} fill="#1a0630" />
              <line x1={b.w / 2} y1={-b.w * 0.37} x2={b.w / 2} y2={-b.w * 0.37 - 14} stroke="#1a0630" strokeWidth="2" />
              <circle cx={b.w / 2} cy={-b.w * 0.37 - 15} r="2.5" fill="#ffc53d" className="twinkle" />
            </>
          )}
          {b.spire && !b.dome && <path d={`M${b.w * 0.35} 0 L${b.w / 2} -34 L${b.w * 0.65} 0Z`} fill="#1a0630" />}
          {b.wins.map((w, k) => (
            <rect key={k} x={w.x} y={w.y} width="5" height="8" rx="1" fill="#ffb347" className="bulb" style={{ animationDelay: `${w.d}s`, animationDuration: `${3 + (k % 3)}s` }} />
          ))}
        </g>
      ))}
    </svg>
  );
}
