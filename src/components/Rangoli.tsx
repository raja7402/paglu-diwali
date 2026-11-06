import { useMemo, useState } from "react";
import { Marigold } from "./Svgs";
import { SectionTitle, Reveal } from "./ui";
import { fx } from "../fx";
import * as sound from "../audio";

const PALETTE = ["#ff3d71", "#ff9100", "#ffd600", "#00e676", "#00b8d4", "#7c4dff", "#f50057", "#ffffff"];

interface Shape {
  id: string;
  type: "petal" | "dot" | "circle";
  ring: number;
  angle: number;
  def: number;
}

export function Rangoli() {
  const shapes = useMemo(() => {
    const out: Shape[] = [];
    for (let i = 0; i < 8; i++) out.push({ id: `a${i}`, type: "petal", ring: 0, angle: i * 45, def: 0 });
    for (let i = 0; i < 16; i++) out.push({ id: `b${i}`, type: "petal", ring: 1, angle: i * 22.5, def: i % 2 ? 2 : 5 });
    for (let i = 0; i < 16; i++) out.push({ id: `c${i}`, type: "dot", ring: 2, angle: i * 22.5 + 11.25, def: 1 });
    for (let i = 0; i < 24; i++) out.push({ id: `d${i}`, type: "petal", ring: 3, angle: i * 15, def: i % 3 === 0 ? 3 : 6 });
    for (let i = 0; i < 24; i++) out.push({ id: `e${i}`, type: "dot", ring: 4, angle: i * 15 + 7.5, def: 7 });
    out.push({ id: "mid", type: "circle", ring: -1, angle: 0, def: 1 });
    return out;
  }, []);

  const initial = () => Object.fromEntries(shapes.map((s) => [s.id, s.def]));
  const [col, setCol] = useState<Record<string, number>>(initial);
  const [moves, setMoves] = useState(0);

  const paint = (id: string, e: React.MouseEvent) => {
    sound.unlock();
    setCol((c) => ({ ...c, [id]: (c[id] + 1) % PALETTE.length }));
    setMoves((m) => m + 1);
    sound.chime(Math.floor(Math.random() * 10), 0.12);
    for (let i = 0; i < 6; i++) fx.trail(e.clientX, e.clientY);
  };

  const random = () => {
    sound.chime(6, 0.15);
    setCol(Object.fromEntries(shapes.map((s) => [s.id, Math.floor(Math.random() * PALETTE.length)])));
  };

  const reset = () => {
    sound.pop(0.2);
    setCol(initial());
    setMoves(0);
  };

  const render = (s: Shape) => {
    const fill = PALETTE[col[s.id]];
    const click = (e: React.MouseEvent) => paint(s.id, e);
    if (s.type === "circle") return <circle key={s.id} className="petal-shape" cx="0" cy="0" r="22" fill={fill} stroke="#fff" strokeOpacity=".7" strokeWidth="2" onClick={click} />;
    const rot = `rotate(${s.angle})`;
    if (s.type === "dot") {
      const r = s.ring === 2 ? 118 : 196;
      return <circle key={s.id} className="petal-shape" cx="0" cy={-r} r={s.ring === 2 ? 7 : 5} fill={fill} transform={rot} onClick={click} />;
    }
    const d =
      s.ring === 0
        ? "M0 -26 C28 -48 28 -80 0 -102 C-28 -80 -28 -48 0 -26Z"
        : s.ring === 1
          ? "M0 -104 C15 -114 15 -132 0 -148 C-15 -132 -15 -114 0 -104Z"
          : "M0 -152 C12 -162 12 -174 0 -186 C-12 -174 -12 -162 0 -152Z";
    return <path key={s.id} className="petal-shape" d={d} transform={rot} fill={fill} stroke="#fff" strokeOpacity=".55" strokeWidth="1.5" onClick={click} />;
  };

  return (
    <section id="rangoli" className="relative overflow-hidden py-24">
      <SectionTitle
        kicker="रंगोली"
        title="Rangoli & Phool"
        sub="Tap the petals to colour your very own rangoli. Design a masterpiece for Paglu's doorstep — then shower it with marigolds."
      />

      <Reveal className="relative mx-auto w-[min(94vw,540px)]">
        {/* floor glow */}
        <div className="absolute inset-0 -z-0 rounded-full bg-[radial-gradient(circle,rgba(255,120,60,.25),transparent_70%)] blur-2xl" />
        <div className="relative rounded-full bg-gradient-to-br from-[#3b1a12] to-[#1d0b0a] p-[3%] shadow-[0_0_60px_rgba(255,100,40,.25),inset_0_0_40px_rgba(0,0,0,.6)]">
          <svg viewBox="-210 -210 420 420" className="relative block w-full">
            <circle r="207" fill="none" stroke="#ffd36b" strokeOpacity=".4" strokeDasharray="2 7" strokeWidth="2" strokeLinecap="round" />
            {shapes.map(render)}
          </svg>
        </div>
        {/* decorative marigolds at corners */}
        <Marigold className="float absolute -left-3 top-4 h-14 w-14 drop-shadow-lg sm:-left-8 sm:h-20 sm:w-20" />
        <Marigold className="float absolute -right-3 bottom-8 h-16 w-16 drop-shadow-lg sm:-right-8 sm:h-24 sm:w-24" style={{ animationDelay: "1s" }} />
        <Marigold className="float absolute -right-1 top-2 h-10 w-10 drop-shadow-lg sm:h-12 sm:w-12" style={{ animationDelay: "2s" }} />
        <Marigold className="float absolute -left-2 bottom-6 h-10 w-10 drop-shadow-lg sm:h-14 sm:w-14" style={{ animationDelay: "1.5s" }} />
      </Reveal>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 px-4">
        <button onClick={random} className="btn-gold rounded-full px-6 py-3">
          🎨 Surprise me
        </button>
        <button
          onClick={() => {
            sound.chime(3, 0.15);
            fx.petals(120);
          }}
          className="btn-ghost rounded-full px-6 py-3"
        >
          🌼 Shower marigolds
        </button>
        <button onClick={reset} className="btn-ghost rounded-full px-6 py-3">
          ↺ Reset
        </button>
      </div>
      <p className="mt-4 text-center font-hand text-lg text-amber-100/70">{moves === 0 ? "Tap any petal or dot to change its colour" : `${moves} colour change${moves > 1 ? "s" : ""} — beautiful, Paglu!`}</p>
    </section>
  );
}
