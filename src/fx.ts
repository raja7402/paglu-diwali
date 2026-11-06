import * as sound from "./audio";

type Kind = "spark" | "glow" | "petal" | "ring" | "smoke";
interface P {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  h: number;
  s: number;
  l: number;
  g: number;
  drag: number;
  kind: Kind;
  rot?: number;
  vr?: number;
  phase?: number;
  twinkle?: boolean;
  grow?: number;
}
interface Emitter {
  t: number;
  dur: number;
  tick: (dt: number, t: number) => void;
}
interface Rocket {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  t: number;
  dur: number;
  h: number;
  big: boolean;
  type?: BurstType;
}

type BurstType = "peony" | "ring" | "willow" | "heart" | "star" | "double";

const PALETTES: number[][] = [
  [45, 20], // gold
  [18, 350], // orange / pink
  [330, 280], // magenta / violet
  [160, 190], // teal / cyan
  [50, 8], // yellow / red
  [120, 60], // green / yellow
  [210, 300], // blue / purple
  [0, 40], // red / gold
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

class FX {
  canvas!: HTMLCanvasElement;
  c!: CanvasRenderingContext2D;
  w = 0;
  h = 0;
  dpr = 1;
  parts: P[] = [];
  emitters: Emitter[] = [];
  rockets: Rocket[] = [];
  last = 0;
  raf = 0;
  flash = 0;
  shakeAmt = 0;
  ambientT = 0;
  running = false;
  shakeEl: HTMLElement | null = null;

  init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.c = canvas.getContext("2d")!;
    this.resize();
    window.addEventListener("resize", this.resize);
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
  }

  resize = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
  };

  /* ------------------------------------------------------------ spawning */
  private add(p: Partial<P> & { x: number; y: number }) {
    if (this.parts.length > 3200) return;
    this.parts.push({
      px: p.x,
      py: p.y,
      vx: 0,
      vy: 0,
      life: 0,
      max: 1,
      size: 2,
      h: 45,
      s: 100,
      l: 60,
      g: 0,
      drag: 0.98,
      kind: "spark",
      ...p,
    } as P);
  }

  burst(x: number, y: number, type: BurstType = pick(["peony", "peony", "ring", "willow", "heart", "star", "double"]), scale = 1) {
    const pal = pick(PALETTES);
    const hA = pal[0];
    const hB = pal[1];
    const S = scale;
    this.flash = Math.max(this.flash, 0.12 * S);
    const speedMul = Math.min(this.w, 900) / 900 + 0.35;

    const spark = (angle: number, speed: number, o: Partial<P> = {}) => {
      const useB = Math.random() < 0.35;
      this.add({
        x,
        y,
        vx: Math.cos(angle) * speed * speedMul,
        vy: Math.sin(angle) * speed * speedMul,
        max: rand(1.2, 2.1),
        size: rand(1.6, 2.8),
        h: useB ? hB : hA,
        s: 100,
        l: rand(58, 72),
        g: 120,
        drag: 0.965,
        twinkle: Math.random() < 0.4,
        ...o,
      });
    };

    if (type === "peony") {
      const n = Math.floor(110 * S);
      for (let i = 0; i < n; i++) spark(rand(0, Math.PI * 2), rand(40, 300) * S);
    } else if (type === "double") {
      for (let i = 0; i < 70 * S; i++) spark(rand(0, Math.PI * 2), rand(240, 300) * S);
      for (let i = 0; i < 50 * S; i++) spark(rand(0, Math.PI * 2), rand(80, 130) * S, { h: 50, l: 85, s: 80 });
    } else if (type === "ring") {
      const n = Math.floor(70 * S);
      const tilt = rand(0.35, 1);
      const rot = rand(0, Math.PI);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const sp = 250 * S;
        this.add({
          x,
          y,
          vx: (Math.cos(a) * Math.cos(rot) - Math.sin(a) * tilt * Math.sin(rot)) * sp * speedMul,
          vy: (Math.cos(a) * Math.sin(rot) + Math.sin(a) * tilt * Math.cos(rot)) * sp * speedMul,
          max: 1.7,
          size: 2.4,
          h: i % 2 ? hA : hB,
          l: 65,
          g: 70,
          drag: 0.968,
        });
      }
    } else if (type === "willow") {
      for (let i = 0; i < 90 * S; i++) {
        const a = rand(0, Math.PI * 2);
        this.add({
          x,
          y,
          vx: Math.cos(a) * rand(30, 200) * S * speedMul,
          vy: Math.sin(a) * rand(30, 200) * S * speedMul,
          max: rand(2.6, 4),
          size: rand(1.2, 2),
          h: 42,
          s: 100,
          l: rand(60, 75),
          g: 80,
          drag: 0.955,
          twinkle: true,
        });
      }
    } else if (type === "heart") {
      const n = Math.floor(80 * S);
      for (let i = 0; i < n; i++) {
        const t = (i / n) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const k = 11 * S * speedMul;
        this.add({
          x,
          y,
          vx: hx * k,
          vy: hy * k,
          max: 1.9,
          size: 2.6,
          h: 345,
          s: 100,
          l: 62,
          g: 50,
          drag: 0.968,
        });
      }
    } else if (type === "star") {
      const arms = 5;
      for (let a = 0; a < arms; a++) {
        const ang = (a / arms) * Math.PI * 2 - Math.PI / 2;
        for (let k = 1; k <= 14; k++) {
          this.add({
            x,
            y,
            vx: Math.cos(ang) * k * 20 * S * speedMul,
            vy: Math.sin(ang) * k * 20 * S * speedMul,
            max: 1.6,
            size: 2.4,
            h: hA,
            l: 70,
            g: 60,
            drag: 0.97,
          });
        }
      }
    }
    // crackle glitter core
    for (let i = 0; i < 14 * S; i++) {
      this.add({
        x,
        y,
        vx: rand(-60, 60),
        vy: rand(-60, 60),
        max: rand(0.4, 0.9),
        size: rand(2, 4),
        h: 50,
        s: 60,
        l: 90,
        kind: "glow",
        drag: 0.93,
      });
    }
    sound.boom(0.55 * Math.min(S, 1.3), 1);
    sound.crackle(8, 1.3, 0.12);
  }

  rocket(x0: number, y0: number, x1: number, y1: number, big = false, type?: BurstType) {
    const dur = rand(0.8, 1.2) * (0.5 + Math.abs(y0 - y1) / this.h / 1.2 + 0.3);
    this.rockets.push({ x0, y0, x1, y1, t: 0, dur, h: pick(PALETTES)[0], big, type });
    sound.whistle(dur);
  }

  /** launch a rocket from bottom of the screen toward a point */
  rocketTo(x: number, y: number) {
    this.rocket(clamp(x + rand(-80, 80), 20, this.w - 20), this.h + 10, x, y);
  }

  skyBurst() {
    const x = rand(this.w * 0.1, this.w * 0.9);
    const y = rand(this.h * 0.12, this.h * 0.5);
    this.rocket(clamp(x + rand(-120, 120), 20, this.w - 20), this.h + 10, x, y, Math.random() < 0.3);
  }

  anar(x: number, y: number, dur = 4.5) {
    sound.hiss(dur, 0.1, 4200);
    this.emitters.push({
      t: 0,
      dur,
      tick: (dt, t) => {
        const power = Math.sin(Math.min(1, t / dur) * Math.PI) * 0.6 + 0.5;
        const n = Math.floor(rand(5, 9) * (dt * 60) * power);
        for (let i = 0; i < n; i++) {
          const a = -Math.PI / 2 + rand(-0.38, 0.38);
          const sp = rand(280, 560) * power;
          this.add({
            x: x + rand(-4, 4),
            y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp,
            max: rand(0.9, 1.6),
            size: rand(1.4, 2.6),
            h: Math.random() < 0.6 ? rand(30, 50) : rand(0, 20),
            s: 100,
            l: rand(60, 85),
            g: 700,
            drag: 0.985,
            twinkle: Math.random() < 0.3,
          });
        }
        // base glow
        this.add({ x, y, vx: rand(-20, 20), vy: rand(-60, -20), max: 0.35, size: rand(8, 16), h: 35, s: 100, l: 55, kind: "glow", drag: 0.9 });
      },
    });
  }

  chakri(x: number, y: number, dur = 4) {
    sound.hiss(dur, 0.1, 2600);
    let ang = 0;
    this.emitters.push({
      t: 0,
      dur,
      tick: (dt, t) => {
        const speed = 16 + Math.min(1, t / 0.6) * 6;
        ang += speed * dt;
        const arms = 3;
        for (let a = 0; a < arms; a++) {
          const base = ang + (a / arms) * Math.PI * 2;
          for (let k = 0; k < 3; k++) {
            const tangent = base + Math.PI / 2 + rand(0.3, 0.9);
            const sp = rand(140, 300);
            this.add({
              x: x + Math.cos(base) * 20,
              y: y + Math.sin(base) * 20,
              vx: Math.cos(tangent) * sp,
              vy: Math.sin(tangent) * sp,
              max: rand(0.5, 1.0),
              size: rand(1.4, 2.4),
              h: Math.random() < 0.5 ? rand(100, 140) : rand(38, 52),
              s: 100,
              l: rand(60, 80),
              g: 160,
              drag: 0.96,
            });
          }
        }
        this.add({ x, y, vx: 0, vy: 0, max: 0.2, size: 24, h: 40, s: 100, l: 55, kind: "glow" });
      },
    });
  }

  sparkler(x: number, y: number, dur = 5) {
    sound.hiss(dur, 0.07, 6000);
    this.emitters.push({
      t: 0,
      dur,
      tick: (dt) => {
        const n = Math.floor(rand(5, 9) * dt * 60);
        for (let i = 0; i < n; i++) {
          const a = rand(0, Math.PI * 2);
          const sp = rand(60, 260);
          this.add({
            x,
            y,
            vx: Math.cos(a) * sp,
            vy: Math.sin(a) * sp - 40,
            max: rand(0.25, 0.7),
            size: rand(1, 2.2),
            h: Math.random() < 0.5 ? 48 : 40,
            s: Math.random() < 0.5 ? 40 : 100,
            l: rand(75, 95),
            g: 300,
            drag: 0.95,
          });
        }
        this.add({ x, y, vx: 0, vy: 0, max: 0.12, size: rand(10, 18), h: 45, s: 100, l: 80, kind: "glow" });
      },
    });
  }

  bomb(x: number, y: number) {
    sound.boom(1.6, 1.4);
    this.flash = 0.7;
    this.shakeAmt = 18;
    this.add({ x, y, vx: 0, vy: 0, max: 0.7, size: 10, kind: "ring", h: 30, s: 100, l: 70, grow: 520, drag: 1 });
    this.add({ x, y, vx: 0, vy: 0, max: 0.5, size: 10, kind: "ring", h: 50, s: 100, l: 90, grow: 300, drag: 1 });
    for (let i = 0; i < 160; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(80, 620);
      this.add({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        max: rand(0.6, 1.5),
        size: rand(1.5, 3.4),
        h: rand(5, 48),
        s: 100,
        l: rand(55, 85),
        g: 500,
        drag: 0.95,
      });
    }
    for (let i = 0; i < 18; i++) {
      this.add({
        x: x + rand(-20, 20),
        y: y + rand(-20, 20),
        vx: rand(-90, 90),
        vy: rand(-140, -20),
        max: rand(1.4, 2.4),
        size: rand(18, 34),
        h: 20,
        s: 8,
        l: 40,
        kind: "smoke",
        drag: 0.97,
        grow: 30,
      });
    }
  }

  ladi(x: number, yBottom: number, yTop: number) {
    const dur = 2.6;
    let acc = 0;
    this.emitters.push({
      t: 0,
      dur,
      tick: (dt, t) => {
        acc += dt;
        while (acc > 0.07) {
          acc -= 0.07;
          const y = yBottom + (yTop - yBottom) * Math.min(1, t / (dur - 0.3)) + rand(-6, 6);
          const px = x + rand(-18, 18);
          sound.pop(0.45);
          this.add({ x: px, y, vx: 0, vy: 0, max: 0.14, size: rand(18, 30), h: 45, s: 100, l: 75, kind: "glow" });
          for (let i = 0; i < 12; i++) {
            const a = rand(0, Math.PI * 2);
            const sp = rand(60, 280);
            this.add({
              x: px,
              y,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              max: rand(0.3, 0.8),
              size: rand(1.4, 2.6),
              h: rand(10, 50),
              s: 100,
              l: rand(60, 85),
              g: 400,
              drag: 0.94,
            });
          }
          this.flash = Math.max(this.flash, 0.05);
          this.shakeAmt = Math.max(this.shakeAmt, 4);
        }
      },
    });
  }

  petals(n = 70) {
    const cols = [
      [32, 100, 52],
      [40, 100, 55],
      [24, 100, 50],
      [350, 80, 55],
      [45, 100, 60],
    ];
    for (let i = 0; i < n; i++) {
      const c = pick(cols);
      window.setTimeout(() => {
        this.add({
          x: rand(-20, this.w + 20),
          y: -20,
          vx: rand(-15, 15),
          vy: rand(55, 130),
          max: rand(9, 14),
          size: rand(6, 12),
          h: c[0],
          s: c[1],
          l: c[2],
          kind: "petal",
          rot: rand(0, 6.28),
          vr: rand(-2.5, 2.5),
          phase: rand(0, 6.28),
          drag: 1,
        });
      }, Math.random() * 2500);
    }
  }

  trail(x: number, y: number) {
    this.add({
      x,
      y,
      vx: rand(-25, 25),
      vy: rand(-10, 40),
      max: rand(0.5, 0.9),
      size: rand(1.4, 3),
      h: rand(35, 50),
      s: 100,
      l: rand(65, 85),
      kind: "glow",
      g: 60,
      drag: 0.94,
    });
  }

  finale(seconds = 9) {
    this.petals(60);
    let acc = 0;
    this.emitters.push({
      t: 0,
      dur: seconds,
      tick: (dt, t) => {
        acc += dt;
        const gap = 0.28 - Math.min(0.14, t * 0.02);
        while (acc > gap) {
          acc -= gap;
          const x = rand(this.w * 0.08, this.w * 0.92);
          const y = rand(this.h * 0.1, this.h * 0.5);
          this.rocket(clamp(x + rand(-150, 150), 20, this.w - 20), this.h + 10, x, y, Math.random() < 0.4);
        }
      },
    });
  }

  /* ------------------------------------------------------------ main loop */
  loop = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  update(dt: number) {
    // ambient embers
    this.ambientT += dt;
    if (this.ambientT > 0.18 && this.parts.length < 900) {
      this.ambientT = 0;
      this.add({
        x: rand(0, this.w),
        y: this.h + 10,
        vx: rand(-12, 12),
        vy: rand(-90, -35),
        max: rand(5, 9),
        size: rand(1.2, 3),
        h: rand(25, 48),
        s: 100,
        l: rand(55, 75),
        kind: "glow",
        phase: rand(0, 6.28),
        drag: 1,
        twinkle: true,
      });
    }

    for (const e of this.emitters) {
      e.t += dt;
      e.tick(dt, e.t);
    }
    this.emitters = this.emitters.filter((e) => e.t < e.dur);

    for (const r of this.rockets) {
      r.t += dt;
      const k = Math.min(1, r.t / r.dur);
      const e = 1 - Math.pow(1 - k, 2.2);
      const x = r.x0 + (r.x1 - r.x0) * e + Math.sin(r.t * 18) * 2 * (1 - k);
      const y = r.y0 + (r.y1 - r.y0) * e;
      this.add({ x, y, vx: rand(-20, 20), vy: rand(20, 70), max: rand(0.3, 0.7), size: rand(1.2, 2.2), h: rand(28, 48), s: 100, l: rand(60, 85), g: 120, drag: 0.95 });
      if (k >= 1) {
        this.burst(r.x1, r.y1, r.type, r.big ? 1.35 : 1);
        r.t = 9999;
      }
    }
    this.rockets = this.rockets.filter((r) => r.t < 9000);

    const dragK = dt * 60;
    for (const p of this.parts) {
      p.life += dt;
      p.px = p.x;
      p.py = p.y;
      if (p.kind === "petal") {
        p.phase = (p.phase ?? 0) + dt * 2;
        p.x += (p.vx + Math.sin(p.phase) * 40) * dt;
        p.y += p.vy * dt;
        p.rot = (p.rot ?? 0) + (p.vr ?? 0) * dt;
        continue;
      }
      if (p.kind === "glow" && p.phase !== undefined && p.drag === 1) {
        p.phase += dt * 2;
        p.x += (p.vx + Math.sin(p.phase) * 14) * dt;
        p.y += p.vy * dt;
        continue;
      }
      const d = Math.pow(p.drag, dragK);
      p.vx *= d;
      p.vy *= d;
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.grow) p.size += p.grow * dt * (p.kind === "ring" ? 1 : 0.6);
    }
    this.parts = this.parts.filter((p) => p.life < p.max && p.y < this.h + 40);

    this.flash = Math.max(0, this.flash - dt * 1.6);
    if (this.shakeAmt > 0.2) {
      this.shakeAmt *= Math.pow(0.88, dragK);
      if (!this.shakeEl) this.shakeEl = document.getElementById("shake-target");
      if (this.shakeEl) this.shakeEl.style.transform = `translate(${rand(-1, 1) * this.shakeAmt}px, ${rand(-1, 1) * this.shakeAmt}px)`;
    } else if (this.shakeAmt !== 0) {
      this.shakeAmt = 0;
      if (this.shakeEl) this.shakeEl.style.transform = "";
    }
  }

  draw() {
    const c = this.c;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.w, this.h);
    c.lineCap = "round";

    // normal-blend pass
    c.globalCompositeOperation = "source-over";
    for (const p of this.parts) {
      const k = p.life / p.max;
      if (p.kind === "smoke") {
        c.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,${0.28 * (1 - k)})`;
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, 6.283);
        c.fill();
      } else if (p.kind === "petal") {
        const a = k > 0.85 ? (1 - k) / 0.15 : 1;
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot ?? 0);
        c.scale(1, 0.55 + 0.45 * Math.abs(Math.sin((p.phase ?? 0) * 1.3)));
        c.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,${a})`;
        c.beginPath();
        c.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, 6.283);
        c.fill();
        c.fillStyle = `hsla(${p.h},${p.s}%,${p.l - 18}%,${a * 0.6})`;
        c.beginPath();
        c.ellipse(0, p.size * 0.2, p.size * 0.2, p.size * 0.6, 0, 0, 6.283);
        c.fill();
        c.restore();
      }
    }

    // additive pass
    c.globalCompositeOperation = "lighter";
    for (const p of this.parts) {
      if (p.kind === "smoke" || p.kind === "petal") continue;
      const k = p.life / p.max;
      let a = 1 - k;
      if (p.twinkle) a *= 0.5 + 0.5 * Math.sin(p.life * 40 + p.x);
      if (a <= 0) continue;
      if (p.kind === "spark") {
        c.strokeStyle = `hsla(${p.h},${p.s}%,${p.l}%,${a})`;
        c.lineWidth = p.size * (1 - k * 0.5);
        c.beginPath();
        c.moveTo(p.px, p.py);
        c.lineTo(p.x + 0.01, p.y);
        c.stroke();
      } else if (p.kind === "glow") {
        const r = p.size * (p.drag === 1 ? 1 : 1 - k * 0.4);
        const g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        g.addColorStop(0, `hsla(${p.h},${p.s}%,${p.l}%,${a * 0.9})`);
        g.addColorStop(1, `hsla(${p.h},${p.s}%,${p.l}%,0)`);
        c.fillStyle = g;
        c.beginPath();
        c.arc(p.x, p.y, r * 3, 0, 6.283);
        c.fill();
      } else if (p.kind === "ring") {
        c.strokeStyle = `hsla(${p.h},${p.s}%,${p.l}%,${a})`;
        c.lineWidth = 6 * a + 1;
        c.beginPath();
        c.arc(p.x, p.y, p.size, 0, 6.283);
        c.stroke();
      }
    }

    if (this.flash > 0.01) {
      c.globalCompositeOperation = "source-over";
      c.fillStyle = `rgba(255,214,150,${this.flash})`;
      c.fillRect(0, 0, this.w, this.h);
    }
  }
}

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

export const fx = new FX();
export { rand, pick };
