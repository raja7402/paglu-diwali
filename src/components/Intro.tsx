import { useState } from "react";
import { Diya } from "./Svgs";
import * as sound from "../audio";

export function Intro({ onDone }: { onDone: () => void }) {
  const [lit, setLit] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const light = () => {
    if (lit) return;
    sound.unlock();
    sound.chime(0, 0.2);
    window.setTimeout(() => sound.chime(4, 0.15), 250);
    window.setTimeout(() => sound.chime(7, 0.15), 500);
    setLit(true);
    window.setTimeout(() => {
      setLeaving(true);
      sound.startMusic();
      onDone();
    }, 1900);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07010f] transition-all duration-[1400ms] ${leaving ? "pointer-events-none scale-125 opacity-0" : "opacity-100"}`}
    >
      {/* expanding light */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[1800ms] ease-out"
        style={{
          width: lit ? "220vmax" : "0px",
          height: lit ? "220vmax" : "0px",
          background: "radial-gradient(circle, rgba(255,160,40,.55) 0%, rgba(160,40,80,.35) 25%, rgba(30,6,60,0) 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className={`font-display text-2xl text-amber-200 transition-opacity duration-700 sm:text-4xl ${lit ? "opacity-0" : "opacity-100"}`}>Paglu, ek minute…</p>
        <button onClick={light} className="group relative mt-8 outline-none" aria-label="Light the diya">
          <div
            className={`absolute left-1/2 top-[30%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,170,40,.75),transparent_65%)] transition-opacity duration-700 ${lit ? "glow-pulse opacity-100" : "opacity-0"}`}
          />
          <Diya lit={lit} className="relative h-40 w-52 transition-transform duration-300 group-hover:scale-110 sm:h-52 sm:w-64" />
          {!lit && <span className="absolute -inset-4 animate-ping rounded-full border border-amber-300/20" />}
        </button>
        <div className="relative mt-8 h-20 w-[90vw] max-w-xl">
          <p className={`absolute inset-x-0 top-0 font-hand text-2xl text-amber-50 transition-all duration-700 sm:text-3xl ${lit ? "translate-y-4 opacity-0" : "opacity-90"}`}>
            Tap the diya to light your Diwali 🪔
          </p>
          <p className={`absolute inset-x-0 top-0 font-display text-4xl text-amber-100 transition-all duration-1000 sm:text-6xl ${lit ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            Shubh Deepavali ✨
          </p>
        </div>
      </div>
    </div>
  );
}
