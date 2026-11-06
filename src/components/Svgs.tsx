import type { CSSProperties } from "react";

/* Global symbol definitions (rendered once in App) */
export function GlobalDefs() {
  const ring = (n: number, cy: number, rx: number, ry: number, fill: string) =>
    Array.from({ length: n }).map((_, i) => (
      <ellipse key={`${fill}${i}`} cx="50" cy={cy} rx={rx} ry={ry} fill={fill} transform={`rotate(${(360 / n) * i + (n % 2 ? 0 : 360 / n / 2)} 50 50)`} />
    ));
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <radialGradient id="mg1" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffb300" />
          <stop offset="1" stopColor="#e65100" />
        </radialGradient>
        <radialGradient id="mg2" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#ffd54f" />
          <stop offset="1" stopColor="#ff9800" />
        </radialGradient>
        <radialGradient id="mg3" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff176" />
          <stop offset="1" stopColor="#ffb300" />
        </radialGradient>
        <linearGradient id="leafg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2e9e4f" />
          <stop offset="1" stopColor="#0b5d2a" />
        </linearGradient>
        <symbol id="marigold" viewBox="0 0 100 100">
          {ring(18, 20, 8.5, 20, "url(#mg1)")}
          {ring(14, 27, 8, 16, "url(#mg2)")}
          {ring(10, 34, 7, 12, "url(#mg3)")}
          <circle cx="50" cy="50" r="9" fill="#bf360c" />
          <circle cx="50" cy="50" r="5" fill="#ff6f00" />
        </symbol>
        <symbol id="leaf" viewBox="0 0 40 100">
          <path d="M20 2 C42 28 40 70 20 98 C0 70 -2 28 20 2Z" fill="url(#leafg)" />
          <path d="M20 8 L20 92" stroke="#7bd88f" strokeWidth="1.5" opacity=".7" />
        </symbol>
      </defs>
    </svg>
  );
}

export function Marigold({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style}>
      <use href="#marigold" width="100" height="100" />
    </svg>
  );
}

export function Leaf({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 100" className={className} style={style}>
      <use href="#leaf" width="40" height="100" />
    </svg>
  );
}

/* ----------------------------- DIYA ----------------------------- */
export function Diya({ lit, className = "", style }: { lit: boolean; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 130 110" className={className} style={style} overflow="visible">
      <defs>
        <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2652b" />
          <stop offset="0.6" stopColor="#b8400f" />
          <stop offset="1" stopColor="#6e2306" />
        </linearGradient>
        <radialGradient id="flameg" cx="50%" cy="85%" r="75%">
          <stop offset="0" stopColor="#fff7c2" />
          <stop offset="0.35" stopColor="#ffc82e" />
          <stop offset="0.8" stopColor="#ff6a00" />
          <stop offset="1" stopColor="#ff3d00" stopOpacity="0.6" />
        </radialGradient>
        <radialGradient id="oilg" cx="50%" cy="50%" r="60%">
          <stop offset="0" stopColor="#ffcf5a" />
          <stop offset="1" stopColor="#4a1a05" />
        </radialGradient>
      </defs>
      {/* foot */}
      <ellipse cx="62" cy="96" rx="26" ry="6" fill="#5a1c05" />
      {/* body */}
      <path d="M6 54 C16 84 38 98 64 98 C92 98 108 82 122 50 C106 60 84 64 64 64 C40 64 20 62 6 54Z" fill="url(#clay)" />
      {/* rim */}
      <ellipse cx="64" cy="55" rx="58" ry="10" fill="#c24a14" />
      <ellipse cx="64" cy="55" rx="52" ry="7.5" fill={lit ? "url(#oilg)" : "#2c0e03"} />
      {/* tip */}
      <path d="M108 50 C118 46 124 44 128 40 C126 48 122 54 112 58Z" fill="#c24a14" />
      {/* gold decoration */}
      {[22, 34, 46, 58, 70, 82, 94].map((x, i) => (
        <circle key={x} cx={x + 2} cy={72 + Math.sin(i / 1.1) * 3 + (i > 4 ? -3 : 0)} r="2.4" fill="#ffd36b" opacity=".9" />
      ))}
      <path d="M16 66 C40 78 80 78 108 62" stroke="#ffd36b" strokeWidth="1.8" fill="none" opacity=".8" strokeDasharray="1 5" strokeLinecap="round" />
      <path d="M30 86 C50 92 76 92 94 84" stroke="#ffd36b" strokeWidth="1.6" fill="none" opacity=".7" />
      {/* wick */}
      <path d="M62 56 Q63 48 64 44" stroke="#2a1405" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      {lit && <circle cx="64" cy="44" r="2" fill="#ff5a1f" />}
      {/* flame */}
      <g className={lit ? "flame-on" : "flame-off"} style={{ transformOrigin: "64px 46px" }}>
        <g className="flame-flicker" style={{ transformOrigin: "64px 46px" }}>
          <path d="M64 -2 C78 16 86 30 64 46 C42 30 50 16 64 -2Z" fill="url(#flameg)" />
          <path d="M64 20 C71 30 72 38 64 45 C56 38 57 30 64 20Z" fill="#fffbe0" opacity=".95" />
          <path d="M64 33 C67 38 67 42 64 45 C61 42 61 38 64 33Z" fill="#6aa8ff" opacity=".55" />
        </g>
      </g>
    </svg>
  );
}

/* ----------------------------- LANTERN ----------------------------- */
export function Lantern({ c1 = "#ff6a00", c2 = "#ffc400", className = "", style }: { c1?: string; c2?: string; className?: string; style?: CSSProperties }) {
  const id = `lg${c1.replace("#", "")}${c2.replace("#", "")}`;
  return (
    <svg viewBox="0 0 80 190" className={className} style={style} overflow="visible">
      <defs>
        <radialGradient id={id} cx="50%" cy="55%" r="60%">
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="0.35" stopColor={c2} />
          <stop offset="1" stopColor={c1} />
        </radialGradient>
      </defs>
      <line x1="40" y1="0" x2="40" y2="30" stroke="#ffd36b" strokeWidth="1.5" />
      <path d="M26 44 L40 28 L54 44Z" fill="#b8860b" />
      <rect x="22" y="42" width="36" height="7" rx="2" fill="#ffd36b" />
      {/* body */}
      <path d="M22 49 C-4 80 -2 120 22 144 L58 144 C82 120 84 80 58 49Z" fill={`url(#${id})`} />
      <path d="M40 49 C26 80 26 112 40 144" stroke={c1} strokeWidth="1.5" fill="none" opacity=".6" />
      <path d="M40 49 C54 80 54 112 40 144" stroke={c1} strokeWidth="1.5" fill="none" opacity=".6" />
      <path d="M30 49 C8 84 10 116 30 144" stroke={c1} strokeWidth="1" fill="none" opacity=".4" />
      <path d="M50 49 C72 84 70 116 50 144" stroke={c1} strokeWidth="1" fill="none" opacity=".4" />
      <rect x="22" y="142" width="36" height="7" rx="2" fill="#ffd36b" />
      {/* tassel */}
      <path d="M40 149 L40 160" stroke="#ffd36b" strokeWidth="2" />
      <path d="M40 158 L32 186 M40 158 L36 188 M40 158 L40 190 M40 158 L44 188 M40 158 L48 186" stroke="#ffd36b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="40" cy="158" r="4" fill="#ffd36b" />
    </svg>
  );
}

/* ----------------------------- SWEETS ----------------------------- */
export type SweetId = "laddu" | "jamun" | "katli" | "jalebi" | "barfi" | "peda";

export function Sweet({ id }: { id: SweetId }) {
  switch (id) {
    case "laddu":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="ladg" cx="35%" cy="30%" r="75%">
              <stop offset="0" stopColor="#ffd054" />
              <stop offset="0.6" stopColor="#f08a00" />
              <stop offset="1" stopColor="#a84a00" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="88" rx="30" ry="6" fill="#000" opacity=".25" />
          <circle cx="50" cy="52" r="38" fill="url(#ladg)" />
          {Array.from({ length: 46 }).map((_, i) => {
            const a = i * 2.4;
            const r = 6 + ((i * 17) % 31);
            return <circle key={i} cx={50 + Math.cos(a) * r} cy={52 + Math.sin(a) * r} r={1.6 + (i % 3) * 0.5} fill={i % 4 === 0 ? "#fff2b8" : "#c76400"} opacity=".8" />;
          })}
          <path d="M44 44 l3 -6 3 6 -3 6z M60 58 l3 -5 3 5 -3 5z" fill="#76c442" opacity=".95" />
          <ellipse cx="36" cy="34" rx="10" ry="6" fill="#fff" opacity=".25" transform="rotate(-35 36 34)" />
        </svg>
      );
    case "jamun":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="jamg" cx="35%" cy="30%" r="75%">
              <stop offset="0" stopColor="#b5651d" />
              <stop offset="0.6" stopColor="#6b2a0c" />
              <stop offset="1" stopColor="#2d0f03" />
            </radialGradient>
            <linearGradient id="bowlg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe08a" />
              <stop offset="1" stopColor="#b8860b" />
            </linearGradient>
          </defs>
          <path d="M10 56 C12 86 30 94 50 94 C70 94 88 86 90 56Z" fill="url(#bowlg)" />
          <ellipse cx="50" cy="56" rx="40" ry="9" fill="#d98a1a" />
          <ellipse cx="50" cy="56" rx="36" ry="7" fill="#8a3f0a" />
          <ellipse cx="34" cy="46" rx="18" ry="16" fill="url(#jamg)" />
          <ellipse cx="64" cy="44" rx="18" ry="16" fill="url(#jamg)" />
          <ellipse cx="50" cy="36" rx="17" ry="15" fill="url(#jamg)" />
          <ellipse cx="44" cy="30" rx="6" ry="3.5" fill="#fff" opacity=".35" />
          <ellipse cx="28" cy="40" rx="5" ry="3" fill="#fff" opacity=".3" />
          <ellipse cx="58" cy="38" rx="5" ry="3" fill="#fff" opacity=".3" />
          <path d="M44 22 l2 -5 2 5 -2 4z" fill="#76c442" />
        </svg>
      );
    case "katli":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="katg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff4d6" />
              <stop offset="0.5" stopColor="#f2d9a0" />
              <stop offset="1" stopColor="#d8b46a" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="86" rx="34" ry="6" fill="#000" opacity=".25" />
          <path d="M50 8 L92 50 L50 92 L8 50Z" fill="#c9a152" />
          <path d="M50 8 L92 50 L50 86 L8 50Z" fill="url(#katg)" />
          <path d="M50 18 L82 50 L50 78 L18 50Z" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1.2" />
          <path d="M50 26 L73 50 L50 72 L27 50Z" fill="#cfd4d8" opacity=".55" />
          <path d="M50 26 L73 50 L50 50Z" fill="#fff" opacity=".55" />
          <path d="M40 40 l3 2 M58 55 l4 2 M50 62 l3 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
        </svg>
      );
    case "jalebi": {
      let d = "M50 50";
      for (let t = 0; t < 30; t += 0.25) {
        const r = 3 + t * 1.55;
        d += ` L${(50 + Math.cos(t) * r).toFixed(1)} ${(50 + Math.sin(t) * r).toFixed(1)}`;
      }
      return (
        <svg viewBox="0 0 100 100">
          <ellipse cx="50" cy="90" rx="32" ry="5" fill="#000" opacity=".25" />
          <path d={d} fill="none" stroke="#a84300" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#ff8a00" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="#ffc940" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity=".85" transform="translate(-1.2 -1.2)" />
        </svg>
      );
    }
    case "barfi":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="barg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffc2d6" />
              <stop offset="1" stopColor="#ef7aa0" />
            </linearGradient>
          </defs>
          <ellipse cx="50" cy="88" rx="36" ry="6" fill="#000" opacity=".25" />
          <path d="M14 38 L50 24 L86 38 L86 72 L50 88 L14 72Z" fill="#c4527a" />
          <path d="M14 38 L50 24 L86 38 L50 52Z" fill="url(#barg)" />
          <path d="M14 38 L50 52 L50 88 L14 72Z" fill="#e0688f" />
          <path d="M50 52 L86 38 L86 72 L50 88Z" fill="#c4527a" />
          {[
            [40, 38, -20],
            [52, 34, 10],
            [62, 40, 35],
            [50, 44, -40],
            [34, 42, 60],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="5" ry="1.8" fill="#8fd14f" transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <ellipse cx="50" cy="38" rx="2" ry="1.5" fill="#fff" opacity=".6" />
        </svg>
      );
    case "peda":
      return (
        <svg viewBox="0 0 100 100">
          <defs>
            <radialGradient id="pedg" cx="40%" cy="30%" r="80%">
              <stop offset="0" stopColor="#fff2d0" />
              <stop offset="0.7" stopColor="#e9c27c" />
              <stop offset="1" stopColor="#b98a3c" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="86" rx="34" ry="6" fill="#000" opacity=".25" />
          <ellipse cx="50" cy="66" rx="38" ry="20" fill="#a97a2f" />
          <ellipse cx="50" cy="58" rx="38" ry="22" fill="url(#pedg)" />
          <g stroke="#b98a3c" strokeWidth="1.4" opacity=".7">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <line key={i} x1={50 + Math.cos(a) * 30} y1={58 + Math.sin(a) * 15} x2={50 + Math.cos(a) * 36} y2={58 + Math.sin(a) * 18} />;
            })}
          </g>
          <ellipse cx="50" cy="56" rx="18" ry="9" fill="none" stroke="#c98f2c" strokeWidth="1.2" opacity=".6" />
          <path d="M44 54 q6 -5 12 0 q-6 5 -12 0z" fill="#ff9d1c" />
          <path d="M47 55 q3 -2 6 0" stroke="#d9480f" strokeWidth="1.3" fill="none" />
          <circle cx="38" cy="52" r="1.6" fill="#76c442" />
          <circle cx="62" cy="62" r="1.6" fill="#76c442" />
        </svg>
      );
  }
}

/* ----------------------------- MANDALA (decor) ----------------------------- */
export function Mandala({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} style={style}>
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 15})`}>
            <path d="M0 -96 C6 -86 6 -76 0 -66 C-6 -76 -6 -86 0 -96Z" />
            <circle cy="-60" r="2.2" />
          </g>
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 30 + 15})`}>
            <path d="M0 -54 C12 -44 12 -28 0 -16 C-12 -28 -12 -44 0 -54Z" />
          </g>
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <path d="M0 -34 C8 -26 8 -16 0 -8 C-8 -16 -8 -26 0 -34Z" />
          </g>
        ))}
        <circle r="98" />
        <circle r="64" />
        <circle r="6" />
      </g>
    </svg>
  );
}
