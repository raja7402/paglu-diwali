import { useState } from "react";
import { Diya } from "./Svgs";
import { Reveal, SectionTitle } from "./ui";
import { fx } from "../fx";
import * as sound from "../audio";

const LETTERS = ["P", "A", "G", "L", "U"];

export function Diyas() {
  const [lit, setLit] = useState<boolean[]>(LETTERS.map(() => false));
  const count = lit.filter(Boolean).length;
  const all = count === LETTERS.length;

  const toggle = (i: number, e?: React.MouseEvent) => {
    const next = [...lit];
    next[i] = !next[i];
    setLit(next);
    if (next[i]) {
      sound.chime(i * 2, 0.2);
      if (e) {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        for (let k = 0; k < 10; k++) fx.trail(r.left + r.width / 2 + (Math.random() - 0.5) * 30, r.top + 10);
      }
      if (next.every(Boolean)) {
        window.setTimeout(() => {
          fx.petals(60);
          for (let k = 0; k < 4; k++) window.setTimeout(() => fx.skyBurst(), k * 300);
          sound.chime(7, 0.2);
          window.setTimeout(() => sound.chime(11, 0.2), 200);
        }, 350);
      }
    } else {
      sound.pop(0.2);
    }
  };

  const lightAll = () => {
    LETTERS.forEach((_, i) => {
      window.setTimeout(() => {
        setLit((prev) => {
          const n = [...prev];
          n[i] = true;
          return n;
        });
        sound.chime(i * 2, 0.2);
      }, i * 280);
    });
    window.setTimeout(() => {
      fx.petals(60);
      for (let k = 0; k < 4; k++) window.setTimeout(() => fx.skyBurst(), k * 300);
    }, LETTERS.length * 280 + 200);
  };

  return (
    <section id="diyas" className="relative overflow-hidden py-24">
      {/* warm light that grows as diyas are lit */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: count / LETTERS.length, background: "radial-gradient(ellipse at 50% 75%, rgba(255,140,20,.38), transparent 65%)" }}
      />
      <SectionTitle
        kicker="दीप जलाओ"
        title={
          <>
            Light the <span className="whitespace-nowrap">Diyas</span>
          </>
        }
        sub="Tap each diya to light it — one for every letter of your name. Let's chase the darkness away."
      />

      <div className="relative mx-auto flex max-w-4xl flex-wrap items-end justify-center gap-x-1 gap-y-8 px-2 sm:gap-x-6">
        {LETTERS.map((l, i) => (
          <button key={i} onClick={(e) => toggle(i, e)} className="group relative flex w-[19%] min-w-[64px] max-w-[150px] flex-col items-center outline-none" aria-label={`Light diya ${l}`}>
            <div
              className={`pointer-events-none absolute left-1/2 top-[6%] h-[180%] w-[220%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,170,40,.55),transparent_62%)] transition-opacity duration-700 ${lit[i] ? "glow-pulse opacity-100" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
            <Diya lit={lit[i]} className="relative w-full transition-transform duration-300 group-hover:-translate-y-1 group-active:scale-95" style={{ filter: lit[i] ? "drop-shadow(0 0 14px rgba(255,160,40,.8))" : "none" }} />
            <span className={`relative mt-2 font-display text-4xl transition-all duration-500 sm:text-6xl ${lit[i] ? "gold-text scale-110" : "text-amber-100/30"}`}>{l}</span>
          </button>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-5 px-4 text-center">
        <p className="font-hand text-xl text-amber-200/90 sm:text-2xl">
          {count} of {LETTERS.length} diyas glowing
        </p>
        {!all && (
          <button onClick={lightAll} className="btn-ghost rounded-full px-6 py-3">
            ✨ Light them all for me
          </button>
        )}
        {all && (
          <Reveal>
            <div className="pop-in mx-auto max-w-2xl rounded-3xl border border-amber-300/40 bg-gradient-to-br from-amber-400/15 to-fuchsia-500/10 p-6 shadow-[0_0_60px_rgba(255,150,0,.3)] backdrop-blur sm:p-8">
              <p className="font-display text-3xl text-amber-200 sm:text-4xl">Paglu, you light up my world!</p>
              <p className="mt-3 font-hand text-xl leading-relaxed text-amber-50/90 sm:text-2xl">
                Just like these tiny flames, your friendship makes the darkest of days glow warm. Thank you for being my light. 🪔💛
              </p>
              <button onClick={() => setLit(LETTERS.map(() => false))} className="btn-ghost mt-5 rounded-full px-5 py-2 text-sm">
                Blow them out & do it again 💨
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
