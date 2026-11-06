// Tiny synthesized sound engine (no audio files needed)
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;
let sfxOn = true;
let musicOn = false;
let musicTimer: number | null = null;
let droneNodes: (OscillatorNode | GainNode | BiquadFilterNode)[] = [];

export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.0;
    musicGain.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
}

function noise(): AudioBuffer | null {
  if (!ctx) return null;
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

export const isSfxOn = () => sfxOn;
export const isMusicOn = () => musicOn;
export function setSfx(v: boolean) {
  sfxOn = v;
}

export function boom(vol = 1, deep = 1) {
  if (!ctx || !master || !sfxOn) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise();
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(1400 * deep, t);
  lp.frequency.exponentialRampToValueAtTime(60, t + 1.3);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.9 * vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
  src.connect(lp).connect(g).connect(master);
  src.start(t, Math.random());
  src.stop(t + 1.5);
  const o = ctx.createOscillator();
  const og = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(130 * deep, t);
  o.frequency.exponentialRampToValueAtTime(28, t + 0.5);
  og.gain.setValueAtTime(0.9 * vol, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  o.connect(og).connect(master);
  o.start(t);
  o.stop(t + 0.7);
}

export function pop(vol = 0.5) {
  if (!ctx || !master || !sfxOn) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise();
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1200 + Math.random() * 1500;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  src.connect(hp).connect(g).connect(master);
  src.start(t, Math.random());
  src.stop(t + 0.12);
}

export function crackle(count = 20, spread = 1.2, vol = 0.25) {
  if (!ctx || !sfxOn) return;
  for (let i = 0; i < count; i++) {
    window.setTimeout(() => pop(vol * (0.4 + Math.random() * 0.6)), Math.random() * spread * 1000);
  }
}

export function whistle(dur = 0.9) {
  if (!ctx || !master || !sfxOn) return;
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(380, t);
  o.frequency.exponentialRampToValueAtTime(2100, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.1, t + 0.1);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export function hiss(dur = 3, vol = 0.12, freq = 3500) {
  if (!ctx || !master || !sfxOn) return;
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise();
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 0.7;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.15);
  g.gain.setValueAtTime(vol, t + dur - 0.4);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t);
  src.stop(t + dur + 0.1);
}

// Bhairav-ish pentatonic-ish bell
const SCALE = [0, 1, 4, 5, 7, 8, 11];
const BASE = 293.66; // D4
export function noteFreq(i: number) {
  const oct = Math.floor(i / SCALE.length);
  const s = SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length];
  return BASE * Math.pow(2, (s + oct * 12) / 12);
}

export function chime(i = 0, vol = 0.18) {
  if (!ctx || !master || !sfxOn) return;
  const t = ctx.currentTime;
  const f = noteFreq(i);
  [1, 2.01, 3.99].forEach((m, k) => {
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.type = "sine";
    o.frequency.value = f * m;
    const v = vol / (k + 1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6 / (k + 1));
    o.connect(g).connect(master!);
    o.start(t);
    o.stop(t + 1.8);
  });
}

export function munch() {
  if (!ctx || !sfxOn) return;
  pop(0.25);
  window.setTimeout(() => pop(0.2), 90);
  window.setTimeout(() => chime(8 + Math.floor(Math.random() * 5), 0.08), 150);
}

/* ---------- ambient music: tanpura drone + sparse sitar-ish plucks ---------- */
function pluck(freq: number, when: number, vol = 0.12) {
  if (!ctx || !musicGain) return;
  const o = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const f = ctx.createBiquadFilter();
  const g = ctx.createGain();
  o.type = "triangle";
  o2.type = "sawtooth";
  o.frequency.value = freq;
  o2.frequency.value = freq * 2.003;
  f.type = "lowpass";
  f.frequency.setValueAtTime(3200, when);
  f.frequency.exponentialRampToValueAtTime(500, when + 1.2);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.exponentialRampToValueAtTime(vol, when + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);
  const g2 = ctx.createGain();
  g2.gain.value = 0.25;
  o.connect(f);
  o2.connect(g2).connect(f);
  f.connect(g).connect(musicGain);
  o.start(when);
  o2.start(when);
  o.stop(when + 2);
  o2.stop(when + 2);
}

export function startMusic() {
  if (!ctx || !musicGain || musicOn) return;
  musicOn = true;
  const t = ctx.currentTime;
  musicGain.gain.cancelScheduledValues(t);
  musicGain.gain.setValueAtTime(musicGain.gain.value, t);
  musicGain.gain.linearRampToValueAtTime(0.55, t + 2);
  // drone
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 700;
  const dg = ctx.createGain();
  dg.gain.value = 0.06;
  lp.connect(dg).connect(musicGain);
  [BASE / 2, (BASE / 2) * 1.5, BASE / 2 * 1.003, BASE / 4].forEach((f) => {
    const o = ctx!.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.connect(lp);
    o.start();
    droneNodes.push(o);
  });
  droneNodes.push(lp, dg);

  let step = 0;
  let idx = 7;
  const phrase = () => {
    if (!ctx || !musicOn) return;
    const now = ctx.currentTime;
    const n = 2 + Math.floor(Math.random() * 3);
    for (let k = 0; k < n; k++) {
      idx += [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
      idx = Math.max(2, Math.min(14, idx));
      pluck(noteFreq(idx), now + k * 0.42 + 0.05, 0.1);
    }
    if (step % 4 === 0) pluck(noteFreq(0), now, 0.13);
    step++;
  };
  phrase();
  musicTimer = window.setInterval(phrase, 2600);
}

export function stopMusic() {
  if (!ctx || !musicGain) return;
  musicOn = false;
  const t = ctx.currentTime;
  musicGain.gain.cancelScheduledValues(t);
  musicGain.gain.setValueAtTime(musicGain.gain.value, t);
  musicGain.gain.linearRampToValueAtTime(0, t + 0.6);
  if (musicTimer) window.clearInterval(musicTimer);
  musicTimer = null;
  const nodes = droneNodes;
  droneNodes = [];
  window.setTimeout(() => {
    nodes.forEach((n) => {
      try {
        if (n instanceof OscillatorNode) n.stop();
        n.disconnect();
      } catch {
        /* ignore */
      }
    });
  }, 700);
}
