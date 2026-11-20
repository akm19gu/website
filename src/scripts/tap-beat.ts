// アイコンを一定のテンポで4回以上タップすると、そのテンポで4つ打ちのビートが鳴る隠し機能。
// 音はファイルを使わず Web Audio API でその場で作る。

const MIN_TAPS = 4; // ビートが始まるのに必要なタップ数
const MIN_INTERVAL = 250; // ms（BPM 240）
const MAX_INTERVAL = 1000; // ms（BPM 60）
const TOLERANCE = 0.2; // 間隔のばらつきをどこまで許すか（平均に対する割合）
const BARS = 8; // 何小節鳴らすか

// ---- 音色 ----
let noise: AudioBuffer | null = null;
const noiseBuffer = (ctx: BaseAudioContext) => {
  if (noise && noise.sampleRate === ctx.sampleRate) return noise;
  noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
};

export const kick = (ctx: BaseAudioContext, out: AudioNode, t: number) => {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
  g.gain.setValueAtTime(1, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + 0.42);
};

export const hat = (ctx: BaseAudioContext, out: AudioNode, t: number) => {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.22, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  src.connect(hp).connect(g).connect(out);
  src.start(t);
  src.stop(t + 0.07);
};

export const clap = (ctx: BaseAudioContext, out: AudioNode, t: number) => {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1400;
  bp.Q.value = 0.8;
  const g = ctx.createGain();
  // 手拍子らしく、ごく短い3回の立ち上がりを重ねる
  g.gain.setValueAtTime(0, t);
  for (const dt of [0, 0.012, 0.024]) {
    g.gain.setValueAtTime(0.5, t + dt);
    g.gain.exponentialRampToValueAtTime(0.05, t + dt + 0.01);
  }
  g.gain.setValueAtTime(0.35, t + 0.034);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  src.connect(bp).connect(g).connect(out);
  src.start(t);
  src.stop(t + 0.22);
};

// 1拍ぶん（キック、裏のハイハット、2・4拍目のクラップ）
export const playBeat = (ctx: BaseAudioContext, out: AudioNode, t: number, beat: number, spb: number) => {
  kick(ctx, out, t);
  hat(ctx, out, t + spb / 2);
  if (beat % 4 === 1 || beat % 4 === 3) clap(ctx, out, t);
};

export const masterChain = (ctx: BaseAudioContext) => {
  const comp = ctx.createDynamicsCompressor();
  const g = ctx.createGain();
  g.gain.value = 0.6;
  comp.connect(g).connect(ctx.destination);
  return comp;
};

// ---- タップの検出と再生 ----
export const setupTapBeat = (target: HTMLElement) => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ctx: AudioContext | null = null;
  let out: AudioNode | null = null;
  let taps: number[] = [];
  let timer = 0;
  let nextTime = 0;
  let beat = 0;
  let spb = 0.5;

  const pulse = (when: number) => {
    if (reduceMotion || !ctx) return;
    const delay = Math.max(0, (when - ctx.currentTime) * 1000);
    setTimeout(() => {
      target.animate([{ transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 160, easing: 'ease-out' });
    }, delay);
  };

  const stop = () => {
    clearInterval(timer);
    timer = 0;
    target.classList.remove('is-playing');
  };

  // 少し先までの拍を前もって予約しておく（ずれにくくするため）
  const schedule = () => {
    if (!ctx || !out) return;
    while (nextTime < ctx.currentTime + 0.12) {
      if (beat >= BARS * 4) return stop();
      playBeat(ctx, out, nextTime, beat, spb);
      pulse(nextTime);
      beat++;
      nextTime += spb;
    }
  };

  const start = (intervalMs: number) => {
    if (!ctx) {
      ctx = new AudioContext();
      out = masterChain(ctx);
    }
    void ctx.resume();
    spb = intervalMs / 1000;
    // 最後のタップから1拍あとに、1拍目を置く
    nextTime = ctx.currentTime + spb;
    beat = 0;
    clearInterval(timer);
    timer = window.setInterval(schedule, 25);
    target.classList.add('is-playing');
  };

  target.addEventListener('pointerdown', () => {
    const now = performance.now();
    if (taps.length && now - taps[taps.length - 1] > MAX_INTERVAL * 1.5) taps = [];
    taps.push(now);
    taps = taps.slice(-MIN_TAPS);
    if (taps.length < MIN_TAPS) return;
    const iv = taps.slice(1).map((t, i) => t - taps[i]);
    const mean = iv.reduce((a, b) => a + b, 0) / iv.length;
    if (mean < MIN_INTERVAL || mean > MAX_INTERVAL) return;
    if (iv.some((x) => Math.abs(x - mean) > mean * TOLERANCE)) return;
    taps = [];
    start(mean);
  });
};
