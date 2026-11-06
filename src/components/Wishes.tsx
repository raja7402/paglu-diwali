import { useState } from "react";
import { Reveal, SectionTitle } from "./ui";
import { Diya, Marigold } from "./Svgs";
import { fx } from "../fx";
import * as sound from "../audio";

const WISHES = [
  { icon: "🌿", title: "Health", text: "May you stay strong, fit and full of energy — No more sickness okay paglu!" },
  { icon: "🪙", title: "Prosperity", text: "May Maa Lakshmi shower your home with wealth, abundance and endless good fortune." },
  { icon: "😄", title: "Happiness", text: "May your days be packed with laughter, silly jokes and the kind of joy that has no reason." },
  { icon: "💖", title: "Love", text: "May you always be surrounded by people who adore you — starting with me, obviously." },
  { icon: "🚀", title: "Success", text: "May Ganesh ji clear every obstacle and every dream of yours come true this year." },
  { icon: "🕊️", title: "Peace", text: "May your heart stay calm, your mind stay clear and your soul stay as bright as a diya." },
];

function WishCard({ w, i }: { w: (typeof WISHES)[number]; i: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <Reveal delay={i * 90}>
      <button
        className="flip-scene block h-60 w-full text-left outline-none"
        onClick={(e) => {
          setFlipped((f) => !f);
          sound.chime(i + 3, 0.15);
          if (!flipped) {
            const r = e.currentTarget.getBoundingClientRect();
            fx.burst(r.left + r.width / 2, r.top + r.height / 2, "star", 0.7);
          }
        }}
      >
        <div className={`flip-card relative h-full w-full ${flipped ? "flipped" : ""}`}>
          <div className="flip-face absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-amber-300/60 bg-gradient-to-br from-[#7b1fa2] via-[#b3124f] to-[#ff6a00] shadow-[0_10px_40px_rgba(255,100,0,.3)]">
            <div className="absolute inset-2 rounded-2xl border border-dashed border-amber-200/50" />
            <Marigold className="absolute -left-6 -top-6 h-20 w-20 opacity-90" />
            <Marigold className="absolute -bottom-6 -right-6 h-20 w-20 opacity-90" />
            <div className="float text-6xl drop-shadow-lg">{w.icon}</div>
            <div className="mt-3 font-display text-3xl text-amber-100">{w.title}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-amber-100/70">tap to open</div>
          </div>
          <div className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-amber-300/70 bg-gradient-to-br from-[#fff2c4] to-[#ffd36b] p-6 text-center text-[#4a1500] shadow-[0_10px_50px_rgba(255,190,60,.5)]">
            <div className="font-display text-2xl text-[#b3124f]">{w.title} {w.icon}</div>
            <p className="mt-3 font-hand text-xl leading-snug">{w.text}</p>
          </div>
        </div>
      </button>
    </Reveal>
  );
}

export function Wishes() {
  const [finale, setFinale] = useState(0);

  const grand = () => {
    sound.unlock();
    sound.chime(0, 0.2);
    fx.finale(9);
    setFinale((n) => n + 1);
  };

  return (
    <section id="wishes" className="relative overflow-hidden pb-40 pt-24">
      <SectionTitle kicker="शुभकामनाएँ" title="Wishes For You" sub="Six little gifts wrapped in light. Paglu tap each card to open it." />

      <div className="mx-auto grid max-w-5xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3">
        {WISHES.map((w, i) => (
          <WishCard key={w.title} w={w} i={i} />
        ))}
      </div>

      {/* letter */}
      <Reveal className="relative mx-auto mt-20 max-w-3xl px-5">
        <div className="relative rounded-[2rem] border-2 border-amber-300/60 bg-gradient-to-br from-[#fff3cf] via-[#ffe9ae] to-[#ffd47a] p-7 text-[#3c1200] shadow-[0_0_80px_rgba(255,170,40,.35)] sm:p-12">
          <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-dashed border-[#b3124f]/40" />
          <Marigold className="absolute -left-5 -top-5 h-16 w-16 drop-shadow-lg sm:-left-8 sm:-top-8 sm:h-24 sm:w-24" />
          <Marigold className="absolute -right-5 -top-5 h-16 w-16 drop-shadow-lg sm:-right-8 sm:-top-8 sm:h-24 sm:w-24" style={{ transform: "rotate(40deg)" }} />
          <div className="absolute -bottom-8 left-1/2 w-20 -translate-x-1/2 sm:w-24">
            <Diya lit className="w-full drop-shadow-[0_0_20px_rgba(255,160,0,.9)]" />
          </div>
          <div className="relative text-center font-display text-3xl text-[#b3124f] sm:text-4xl">Dear Paglu,</div>
          <div className="relative mt-5 space-y-4 text-center font-hand text-xl leading-relaxed sm:text-2xl">
            <p>
              May this Diwali light up every corner of your life — with laughter, good health, endless sweets and happiness that doesn't need a reason.
            </p>
            <p>
              May Maa Lakshmi fill your home with prosperity, Ganesh ji clear every hurdle on your path, and may your year be brighter than the biggest anar you ever lit.
            </p>
            <p>
              Thank you for being the best part of so many of my memories. Eat too much mithai, burst only the <i>good</i> crackers, and don't forget to share the last kaju katli with me! 😄
            </p>
            <p className="pt-2 font-display text-2xl text-[#b3124f] sm:text-3xl">Happy Diwali, Shaitaan Paglu! 🪔</p>
            <p className="text-lg opacity-80">— Your Suorr, with lots of love 💛</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-24 flex flex-col items-center px-4 text-center">
        <p className="font-hand text-2xl text-amber-100">One last surprise…</p>
        <button onClick={grand} className="btn-gold mt-4 rounded-full px-10 py-5 text-xl sm:text-2xl">
          🎆 Grand Finale 🎆
        </button>
        <p className="mt-10 font-display text-xl text-amber-300/90">Shubh Deepavali, Paglu ✨</p>
        <p className="mt-1 text-sm text-amber-100/50">Made with 🪔 and a whole lot of love. Please celebrate responsibly.</p>
      </Reveal>

      {finale > 0 && (
        <div key={finale} className="pointer-events-none fixed inset-0 z-[65] flex items-center justify-center px-4">
          <div className="finale-text text-center">
            <div className="gold-text font-display text-6xl leading-tight sm:text-9xl">Happy Diwali</div>
            <div className="gold-text font-display text-7xl leading-tight sm:text-[10rem]">Paglu!</div>
          </div>
        </div>
      )}
    </section>
  );
}
