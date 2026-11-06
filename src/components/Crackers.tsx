import { useRef, useState, type ReactNode } from "react";
import { SectionTitle } from "./ui";
import { Skyline } from "./Decor";
import { fx, rand } from "../fx";
import * as sound from "../audio";

type Phase = "idle" | "fuse" | "burn";

function Spark({ x, y, show }: { x: number; y: number; show: boolean }) {
  if (!show) return null;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="fuse-spark">
        <circle r="7" fill="#ffb300" opacity=".5" />
        <path d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2Z" fill="#fff6c0" />
      </g>
    </g>
  );
}

const Anar = (p: Phase) => (
  <svg viewBox="0 0 100 120" className="h-full w-full overflow-visible">
    <defs>
      <linearGradient id="anarg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b3122b" />
        <stop offset="0.45" stopColor="#ef3a4c" />
        <stop offset="1" stopColor="#8a0c20" />
      </linearGradient>
    </defs>
    <path d="M28 40 L72 40 L84 108 L16 108Z" fill="url(#anarg)" />
    <rect x="24" y="32" width="52" height="11" rx="3" fill="#6d0a1a" />
    <rect x="16" y="98" width="68" height="12" rx="3" fill="#6d0a1a" />
    <path d="M26 56 L74 56 M24 76 L76 76" stroke="#ffcf5a" strokeWidth="3" />
    <polygon points="50,58 54,68 64,68 56,74 59,84 50,78 41,84 44,74 36,68 46,68" fill="#ffd54f" />
    <path d="M50 32 C50 22 58 20 60 12" stroke="#d7b46a" strokeWidth="2.5" fill="none" />
    <Spark x={60} y={12} show={p === "fuse"} />
  </svg>
);

const spiralPath = (() => {
  let d = "M50 50";
  for (let t = 0; t < 22; t += 0.2) {
    const r = 3 + t * 2;
    d += ` L${(50 + Math.cos(t) * r).toFixed(1)} ${(50 + Math.sin(t) * r).toFixed(1)}`;
  }
  return d;
})();
const Chakri = (p: Phase) => (
  <svg viewBox="0 0 100 100" className={`h-full w-full overflow-visible ${p === "burn" ? "spin-fast" : ""}`}>
    <path d={spiralPath} stroke="#1b5e20" strokeWidth="8" fill="none" strokeLinecap="round" />
    <path d={spiralPath} stroke="#43a047" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d={spiralPath} stroke="#ffd54f" strokeWidth="1.2" fill="none" strokeDasharray="2 5" strokeLinecap="round" />
    <circle cx="50" cy="50" r="4" fill="#ffd54f" />
    <Spark x={50} y={50} show={p === "fuse"} />
  </svg>
);

const Rocket = (p: Phase) => (
  <svg viewBox="0 0 100 130" className={`h-full w-full overflow-visible ${p === "burn" ? "launch" : ""}`}>
    <rect x="49" y="88" width="3" height="42" fill="#c8a165" />
    <path d="M36 88 L28 104 L40 96Z M64 88 L72 104 L60 96Z" fill="#0d47a1" />
    <rect x="36" y="38" width="28" height="54" rx="3" fill="#1565c0" />
    <rect x="36" y="52" width="28" height="9" fill="#ffd54f" />
    <rect x="36" y="70" width="28" height="4" fill="#ffd54f" />
    <path d="M36 38 L50 6 L64 38Z" fill="#e53935" />
    <path d="M44 38 L50 14 L50 38Z" fill="#ff8a80" opacity=".6" />
    <path d="M50 92 C50 100 44 100 44 108" stroke="#d7b46a" strokeWidth="2.2" fill="none" />
    <Spark x={44} y={108} show={p === "fuse"} />
  </svg>
);

const Phool = (p: Phase) => (
  <svg viewBox="0 0 100 130" className="h-full w-full overflow-visible">
    <rect x="48.5" y="40" width="3" height="90" fill="#8d6e63" />
    <rect x="47" y="42" width="6" height="52" rx="2" fill="#9e9e9e" />
    <rect x="47" y="42" width="2" height="52" fill="#e0e0e0" />
    <rect x="47" y="94" width="6" height="3" fill="#ff7043" />
    <Spark x={50} y={38} show={p === "fuse"} />
    {p === "burn" && <circle cx="50" cy="40" r="5" fill="#fff6c0" className="fuse-spark" />}
  </svg>
);

const Bomb = (p: Phase) => (
  <svg viewBox="0 0 100 120" className="h-full w-full overflow-visible">
    <defs>
      <radialGradient id="bombg" cx="35%" cy="30%" r="75%">
        <stop offset="0" stopColor="#5c6bc0" />
        <stop offset="0.5" stopColor="#1a237e" />
        <stop offset="1" stopColor="#0a0e3d" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="72" r="34" fill="url(#bombg)" />
    <rect x="38" y="36" width="24" height="9" rx="2" fill="#37474f" />
    <path d="M16 70 Q50 86 84 70 L84 80 Q50 96 16 80Z" fill="#e53935" />
    <polygon points="50,52 53,60 62,60 55,65 58,73 50,68 42,73 45,65 38,60 47,60" fill="#ffd54f" opacity=".95" transform="translate(0 -4) scale(1)" />
    <ellipse cx="38" cy="56" rx="8" ry="4" fill="#fff" opacity=".25" transform="rotate(-30 38 56)" />
    <path d="M50 36 C50 24 62 26 64 14" stroke="#d7b46a" strokeWidth="2.5" fill="none" />
    <Spark x={64} y={14} show={p === "fuse"} />
  </svg>
);

const Ladi = (p: Phase) => (
  <svg viewBox="0 0 100 130" className="h-full w-full overflow-visible">
    <path d="M50 4 L50 126" stroke="#d7b46a" strokeWidth="2.5" />
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={i} transform={`translate(50 ${18 + i * 14}) rotate(${i % 2 ? 22 : -22})`}>
        <rect x="-12" y="-4.5" width="24" height="9" rx="2.5" fill="#d32f2f" />
        <rect x="-3" y="-4.5" width="6" height="9" fill="#ffd54f" />
      </g>
    ))}
    <Spark x={50} y={4} show={p === "fuse"} />
  </svg>
);

interface Def {
  id: string;
  name: string;
  hint: string;
  art: (p: Phase) => ReactNode;
  burn: number;
  fire: (r: DOMRect) => void;
  anim: string;
  vanish?: boolean;
}

const CRACKERS: Def[] = [
  {
    id: "anar",
    name: "Anar",
    hint: "Fountain of sparks",
    art: Anar,
    burn: 4600,
    anim: "",
    fire: (r) => fx.anar(r.left + r.width / 2, r.top + r.height * 0.22),
  },
  {
    id: "chakri",
    name: "Chakri",
    hint: "Spinning wheel",
    art: Chakri,
    burn: 4200,
    anim: "",
    fire: (r) => fx.chakri(r.left + r.width / 2, r.top + r.height / 2),
  },
  {
    id: "rocket",
    name: "Rocket",
    hint: "Sky-high burst",
    art: Rocket,
    burn: 1800,
    anim: "",
    vanish: true,
    fire: (r) => {
      const x = r.left + r.width / 2;
      const ty = Math.max(70, Math.min(r.top - 160, rand(window.innerHeight * 0.1, window.innerHeight * 0.4)));
      fx.rocket(x, r.top + r.height * 0.2, x + rand(-60, 60), ty, true);
    },
  },
  {
    id: "phool",
    name: "Phooljhadi",
    hint: "Sparkler magic",
    art: Phool,
    burn: 5200,
    anim: "",
    fire: (r) => fx.sparkler(r.left + r.width / 2, r.top + r.height * 0.3),
  },
  {
    id: "bomb",
    name: "Bomb",
    hint: "BOOM! Hold your ears",
    art: Bomb,
    burn: 1800,
    anim: "",
    vanish: true,
    fire: (r) => fx.bomb(r.left + r.width / 2, r.top + r.height * 0.55),
  },
  {
    id: "ladi",
    name: "Ladi",
    hint: "Crackling string",
    art: Ladi,
    burn: 2800,
    anim: "shake",
    fire: (r) => fx.ladi(r.left + r.width / 2, r.bottom - 10, r.top),
  },
];

function Cracker({ def }: { def: Def }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [gone, setGone] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const light = () => {
    if (phase !== "idle") return;
    sound.unlock();
    setPhase("fuse");
    sound.hiss(0.9, 0.05, 5000);
    window.setTimeout(() => {
      const el = ref.current;
      if (el) {
        const box = el.querySelector("[data-art]")!.getBoundingClientRect();
        def.fire(box);
      }
      setPhase("burn");
      if (def.vanish) window.setTimeout(() => setGone(true), 700);
      window.setTimeout(() => {
        setPhase("idle");
        setGone(false);
      }, def.burn + 600);
    }, 900);
  };

  return (
    <button
      ref={ref}
      onClick={light}
      className="group relative flex flex-col items-center outline-none"
      aria-label={`Light ${def.name}`}
    >
      <div
        data-art
        className={`relative h-28 w-24 transition-transform duration-300 group-hover:-translate-y-2 sm:h-36 sm:w-28 ${phase === "fuse" ? "shake" : ""} ${phase === "burn" ? def.anim : ""}`}
        style={{ opacity: gone ? 0 : 1, transition: "opacity .4s" }}
      >
        {def.art(phase)}
      </div>
      {/* ground glow when burning */}
      <div className={`absolute bottom-6 h-6 w-28 rounded-full bg-orange-400/40 blur-xl transition-opacity duration-300 ${phase === "burn" ? "opacity-100" : "opacity-0"}`} />
      <div className="mt-3 rounded-full border border-amber-300/30 bg-black/30 px-3 py-1 text-center backdrop-blur">
        <div className="font-display text-base text-amber-200 sm:text-lg">{def.name}</div>
        <div className="text-[11px] text-amber-50/60">{phase === "idle" ? def.hint : phase === "fuse" ? "Fuse lit… 🔥" : "Enjoy! ✨"}</div>
      </div>
    </button>
  );
}

export function Crackers() {
  return (
    <section id="crackers" className="relative overflow-hidden pb-44 pt-24">
      <SectionTitle
        kicker="पटाखे"
        title="Patakhe Time!"
        sub="Pick a cracker, light the fuse and watch the night sky erupt. Safe, smoke-free, and zero chance of singed eyebrows. 😄"
      />
      <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-2 gap-x-4 gap-y-10 px-4 sm:grid-cols-3 lg:grid-cols-6">
        {CRACKERS.map((c) => (
          <div key={c.id} className="flex justify-center">
            <Cracker def={c} />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-95">
        <Skyline className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07010f] to-transparent" />
    </section>
  );
}
