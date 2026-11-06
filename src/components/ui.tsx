import { useEffect, useRef, useState, type ReactNode } from "react";
import * as sound from "../audio";

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function SectionTitle({ kicker, title, sub }: { kicker: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl px-5 text-center">
      <div className="font-display text-lg tracking-wide text-amber-300/90 sm:text-xl">{kicker}</div>
      <h2 className="gold-text mt-1 font-display text-4xl leading-tight sm:text-6xl">{title}</h2>
      <div className="mx-auto my-4 flex items-center justify-center gap-3 text-amber-300">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300" />
        <span className="twinkle">✦</span>
        <span className="text-xl">🪔</span>
        <span className="twinkle" style={{ animationDelay: "0.8s" }}>✦</span>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300" />
      </div>
      {sub && <p className="text-base leading-relaxed text-amber-50/80 sm:text-lg">{sub}</p>}
    </Reveal>
  );
}

const LINKS = [
  { id: "home", icon: "🏮", label: "Home" },
  { id: "diyas", icon: "🪔", label: "Diyas" },
  { id: "crackers", icon: "🎆", label: "Patakhe" },
  { id: "sweets", icon: "🍬", label: "Mithai" },
  { id: "rangoli", icon: "🌸", label: "Rangoli" },
  { id: "wishes", icon: "💌", label: "Wishes" },
];

export function Nav() {
  const [active, setActive] = useState("home");
  const [sfx, setSfx] = useState(true);
  const [music, setMusic] = useState(sound.isMusicOn());

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    sound.chime(LINKS.findIndex((l) => l.id === id) + 2, 0.1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav className="fixed bottom-3 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-amber-300/40 bg-[#1a0630]/80 px-2 py-1.5 shadow-[0_0_30px_rgba(255,140,0,.25)] backdrop-blur-xl sm:gap-1 sm:px-3">
        {LINKS.map((l) => (
          <button
            key={l.id}
            onClick={() => go(l.id)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition sm:px-3.5 ${active === l.id ? "bg-gradient-to-r from-amber-400 to-orange-500 text-[#3a1200] shadow-lg" : "text-amber-100/80 hover:bg-white/10"}`}
            aria-label={l.label}
          >
            <span className="text-lg leading-none">{l.icon}</span>
            <span className={`hidden font-medium md:inline ${active === l.id ? "" : ""}`}>{l.label}</span>
          </button>
        ))}
      </nav>
      <div className="fixed right-3 top-3 z-[70] flex gap-2">
        <button
          title="Music"
          onClick={() => {
            if (sound.isMusicOn()) {
              sound.stopMusic();
              setMusic(false);
            } else {
              sound.unlock();
              sound.startMusic();
              setMusic(true);
            }
          }}
          className={`grid h-11 w-11 place-items-center rounded-full border border-amber-300/40 text-xl backdrop-blur-md transition ${music ? "bg-amber-400/90" : "bg-[#1a0630]/70"}`}
        >
          {music ? "🎶" : "🎵"}
        </button>
        <button
          title="Crackers sound"
          onClick={() => {
            sound.setSfx(!sfx);
            setSfx(!sfx);
          }}
          className={`grid h-11 w-11 place-items-center rounded-full border border-amber-300/40 text-xl backdrop-blur-md transition ${sfx ? "bg-amber-400/90" : "bg-[#1a0630]/70"}`}
        >
          {sfx ? "🔊" : "🔇"}
        </button>
      </div>
    </>
  );
}
