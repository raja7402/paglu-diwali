import { Diya, Mandala } from "./Svgs";
import { Lanterns, StringLights, Toran } from "./Decor";
import { fx } from "../fx";
import * as sound from "../audio";

export function Hero() {
  const launch = () => {
    for (let i = 0; i < 5; i++) window.setTimeout(() => fx.skyBurst(), i * 260);
  };
  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-40 pt-44 text-center">
      <Toran />
      <StringLights top={150} swags={5} />
      <Lanterns />

      {/* rotating mandala behind */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 -translate-x-1/2 -translate-y-1/2 text-amber-300/20">
        <Mandala className="spin-slow h-[130vmin] w-[130vmin] max-w-none" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,140,0,.28),transparent_65%)]" />

      <div className="relative z-20 max-w-4xl">
        <div className="letter-in font-display text-xl text-amber-200 sm:text-3xl" style={{ animationDelay: "0.2s" }}>
          ✦ शुभ दीपावली ✦
        </div>
        <p className="letter-in mt-2 font-hand text-2xl text-amber-50/90 sm:text-3xl" style={{ animationDelay: "0.5s" }}>
          Happy Diwali to the most special
        </p>
        <div className="letter-in" style={{ animationDelay: "0.8s" }}>
          <h1 className="gold-text my-1 py-2 font-display text-[22vw] leading-none sm:text-[11rem]">Paglu!</h1>
        </div>
        <p className="letter-in mx-auto max-w-xl text-base leading-relaxed text-amber-50/80 sm:text-xl" style={{ animationDelay: "1.1s" }}>
          May your life shine brighter than a thousand diyas, sparkle louder than every cracker, and taste sweeter than the last kaju katli. 🪔✨
        </p>

        <div className="letter-in mt-8 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "1.4s" }}>
          <button onClick={launch} className="btn-gold rounded-full px-7 py-3.5 text-base sm:text-lg">
            🎆 Light up the sky
          </button>
          <button
            onClick={() => {
              sound.chime(4, 0.12);
              document.getElementById("diyas")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-ghost rounded-full px-7 py-3.5 text-base sm:text-lg"
          >
            Begin the celebration ↓
          </button>
        </div>
        <p className="mt-6 text-sm text-amber-200/60">Tip: tap anywhere on the sky to launch a rocket 🚀</p>
      </div>

      {/* row of diyas at the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-10 flex items-end justify-around px-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative" style={{ transform: `translateY(${Math.abs(4 - i) * -4}px)` }}>
            <div
              className="glow-pulse absolute left-1/2 top-[25%] h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(255,170,40,.65),transparent_70%)] sm:h-28 sm:w-28"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
            <Diya lit className="relative h-9 w-12 sm:h-14 sm:w-[4.5rem]" />
          </div>
        ))}
      </div>
    </section>
  );
}
