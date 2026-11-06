import { useState } from "react";
import { Sweet, type SweetId, Marigold } from "./Svgs";
import { Reveal, SectionTitle } from "./ui";
import { fx } from "../fx";
import * as sound from "../audio";

const ITEMS: { id: SweetId; name: string; line: string }[] = [
  { id: "laddu", name: "Motichoor Laddu", line: "Round, golden and impossible to eat just one — just like your laughter." },
  { id: "jamun", name: "Gulab Jamun", line: "Soft, warm and dripping with sweetness. Basically you, Paglu." },
  { id: "katli", name: "Kaju Katli", line: "The most precious one on the plate. Guard it with your life! 💎" },
  { id: "jalebi", name: "Jalebi", line: "Twisty, crispy and full of fun — a perfect match for your craziness." },
  { id: "barfi", name: "Pista Barfi", line: "A little nutty, a lot sweet. Sounds familiar? 😜" },
  { id: "peda", name: "Kesar Peda", line: "Saffron-kissed happiness, hand-made for the best friend ever." },
];

// positions (percent) around the thali
const POS = [0, 1, 2, 3, 4, 5].map((i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
  return { x: 50 + Math.cos(a) * 31, y: 50 + Math.sin(a) * 31 };
});

interface Yum {
  id: number;
  x: number;
  y: number;
  t: string;
}

export function Sweets() {
  const [bites, setBites] = useState<number[]>(ITEMS.map(() => 0));
  const [eaten, setEaten] = useState(0);
  const [caption, setCaption] = useState<number | null>(null);
  const [wob, setWob] = useState<number | null>(null);
  const [yums, setYums] = useState<Yum[]>([]);

  const bite = (i: number) => {
    if (bites[i] >= 3) return;
    sound.unlock();
    sound.munch();
    const nb = [...bites];
    nb[i]++;
    setBites(nb);
    setEaten((e) => e + 1);
    setCaption(i);
    setWob(i);
    window.setTimeout(() => setWob(null), 500);
    const words = ["Yum! 😋", "Mmm! 🤤", "So good! 😍", "Shabash! 👏", "More! 🍬"];
    const y: Yum = { id: Date.now() + Math.random(), x: POS[i].x, y: POS[i].y, t: words[Math.floor(Math.random() * words.length)] };
    setYums((arr) => [...arr, y]);
    window.setTimeout(() => setYums((arr) => arr.filter((a) => a.id !== y.id)), 1400);
    fx.petals(4);
    if (nb[i] === 3) {
      sound.chime(9, 0.15);
    }
  };

  const refill = () => {
    sound.chime(5, 0.15);
    fx.petals(14);
    setBites(ITEMS.map(() => 0));
  };

  const empty = bites.every((b) => b >= 3);
  const msg =
    eaten === 0
      ? "Tap any mithai to take a bite!"
      : eaten < 6
        ? "Nice! Keep going…"
        : eaten < 12
          ? "Sugar level: rising 📈"
          : "Paglu, leave some for the rest of us! 😂";

  return (
    <section id="sweets" className="relative overflow-hidden bg-gradient-to-b from-[#07010f] via-[#2a0a3a]/60 to-transparent py-24">
      <SectionTitle kicker="मिठाई" title="Mithai Thali" sub="No Diwali is complete without sweets. Dig into this thali — it's all yours, Paglu!" />

      <Reveal className="relative mx-auto aspect-square w-[min(92vw,560px)]">
        {/* thali */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#b8860b,#ffe08a,#b8860b,#ffe08a,#b8860b)] p-[3%] shadow-[0_0_80px_rgba(255,170,40,.35),0_30px_60px_rgba(0,0,0,.6)]">
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff1b8,#e8b13a_45%,#9a6a10_100%)] p-[4%]">
            <div className="relative h-full w-full rounded-full border-[3px] border-dashed border-amber-900/40 bg-[radial-gradient(circle,#d99a22,#a8700f)]">
              <div className="absolute inset-[5%] rounded-full border border-amber-100/40" />
              {/* centre marigold */}
              <Marigold className="spin-slow absolute left-1/2 top-1/2 h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" />
            </div>
          </div>
        </div>

        {ITEMS.map((s, i) => {
          const b = bites[i];
          return (
            <button
              key={s.id}
              onClick={() => bite(i)}
              className="absolute w-[27%] outline-none transition-all duration-300 hover:brightness-110"
              style={{
                left: `${POS[i].x}%`,
                top: `${POS[i].y}%`,
                transform: `translate(-50%,-50%) scale(${b >= 3 ? 0 : 1 - b * 0.22}) rotate(${b * 14}deg)`,
                opacity: b >= 3 ? 0 : 1,
                filter: "drop-shadow(0 8px 8px rgba(0,0,0,.4))",
              }}
              aria-label={`Eat ${s.name}`}
            >
              <div className={wob === i ? "wobble" : ""}>
                <Sweet id={s.id} />
              </div>
            </button>
          );
        })}

        {yums.map((y) => (
          <div key={y.id} className="rise pointer-events-none absolute z-20 whitespace-nowrap font-hand text-2xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,.8)]" style={{ left: `${y.x}%`, top: `${y.y}%` }}>
            {y.t}
          </div>
        ))}
      </Reveal>

      <div className="mx-auto mt-10 max-w-xl px-5 text-center">
        <div className="min-h-[88px] rounded-2xl border border-amber-300/30 bg-black/25 p-4 backdrop-blur">
          {caption !== null ? (
            <>
              <div className="font-display text-2xl text-amber-300">{ITEMS[caption].name}</div>
              <div className="font-hand text-lg text-amber-50/90 sm:text-xl">{ITEMS[caption].line}</div>
            </>
          ) : (
            <div className="pt-4 font-hand text-xl text-amber-50/80">{msg}</div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <div className="rounded-full border border-amber-300/40 px-5 py-2 text-amber-200">
            🍬 Bites taken: <b className="text-amber-300">{eaten}</b>
          </div>
          <button onClick={refill} className={`rounded-full px-6 py-2.5 ${empty ? "btn-gold animate-bounce" : "btn-ghost"}`}>
            🔄 Refill the thali
          </button>
        </div>
        <p className="mt-3 text-sm text-amber-100/60">{eaten > 0 ? msg : ""}</p>
      </div>
    </section>
  );
}
