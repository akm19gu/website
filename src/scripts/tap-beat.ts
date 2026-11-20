// アイコンを一定のテンポで3回タップすると、そのテンポで4つ打ちのビートが鳴る隠し機能。
// 最初はキックだけで、ハイハットとスネアがだんだん大きくなって盛り上がっていく。
// 音は Web Audio API でその場で作る。SAMPLES に音声ファイルを指定すると、その音に差し替わる。

export type Voice = 'kick' | 'hat' | 'snare';

// 差し替え用の音声ファイル。public/ に置いて、そこからのパスを書く（例: 'sounds/kick.wav'）。
// null のあいだは合成音を使う。
export const SAMPLES: Record<Voice, string | null> = {
  kick: null,
  hat: null,
  snare: null,
};

const START_TAPS = 3; // ビートが始まるのに必要なタップ数
const MIN_INTERVAL = 250; // ms（BPM 240）
const MAX_INTERVAL = 1000; // ms（BPM 60）
const TOLERANCE = 0.35; // タップ間隔のずれをどこまで許すか（平均に対する割合）
const BARS = 16; // 何小節鳴らすか
// 何拍目から何拍目にかけて音量を上げていくか
const HAT_IN: [number, number] = [4, 16];
const SNARE_IN: [number, number] = [8, 24];
const FULL_AT = 24; // 見た目の盛り上がりが最大になる拍

const ramp = (beat: number, [from, to]: [number, number]) => Math.min(1, Math.max(0, (beat - from) / (to - from)));

// その拍でのハイハット・スネアの音量（0〜1）と、盛り上がり具合（0〜1）
export const levels = (beat: number) => ({
  hat: ramp(beat, HAT_IN) ** 1.5,
  snare: ramp(beat, SNARE_IN) ** 1.5,
  intensity: ramp(beat, [0, FULL_AT]),
});

// ---- 合成音 ----
let noise: AudioBuffer | null = null;
const noiseBuffer = (ctx: BaseAudioContext) => {
  if (noise && noise.sampleRate === ctx.sampleRate) return noise;
  noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.3), ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
};

const synth: Record<Voice, (ctx: BaseAudioContext, out: AudioNode, t: number) => void> = {
  kick(ctx, out, t) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(g).connect(out);
    osc.start(t);
    osc.stop(t + 0.42);
  },
  hat(ctx, out, t) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    src.connect(hp).connect(g).connect(out);
    src.start(t);
    src.stop(t + 0.07);
  },
  snare(ctx, out, t) {
    // 胴鳴り（短い三角波）とスナッピー（ノイズ）を重ねる
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.45, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(og).connect(out);
    osc.start(t);
    osc.stop(t + 0.13);

    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.55, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    src.connect(hp).connect(ng).connect(out);
    src.start(t);
    src.stop(t + 0.2);
  },
};

// ---- ドラムキット（音量のつまみと、音の出し方）----
const MASTER = 0.6;

export const createKit = (ctx: BaseAudioContext) => {
  const comp = ctx.createDynamicsCompressor();
  const master = ctx.createGain();
  master.gain.value = MASTER;
  comp.connect(master).connect(ctx.destination);

  const bus = { kick: ctx.createGain(), hat: ctx.createGain(), snare: ctx.createGain() };
  for (const g of Object.values(bus)) g.connect(comp);

  const buffers: Partial<Record<Voice, AudioBuffer>> = {};

  // SAMPLES に指定された音声ファイルを読み込む。読めなかったものは合成音のまま。
  const load = async (baseUrl: string) => {
    await Promise.all(
      (Object.keys(SAMPLES) as Voice[]).map(async (v) => {
        const path = SAMPLES[v];
        if (!path) return;
        try {
          const res = await fetch(baseUrl + path);
          if (!res.ok) return;
          buffers[v] = await ctx.decodeAudioData(await res.arrayBuffer());
        } catch {
          // 合成音にフォールバック
        }
      }),
    );
  };

  const play = (v: Voice, t: number) => {
    const buf = buffers[v];
    if (!buf) return synth[v](ctx, bus[v], t);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(bus[v]);
    src.start(t);
  };

  return { master, bus, buffers, load, play };
};

export type Kit = ReturnType<typeof createKit>;

// 1拍ぶん：キックは毎拍、ハイハットは裏拍、スネアは2・4拍目。音量はその拍の盛り上がりに合わせる。
export const scheduleBeat = (kit: Kit, t: number, beat: number, spb: number) => {
  const lv = levels(beat);
  kit.bus.hat.gain.setValueAtTime(lv.hat, t);
  kit.bus.snare.gain.setValueAtTime(lv.snare, t);
  kit.play('kick', t);
  if (lv.hat > 0) kit.play('hat', t + spb / 2);
  if (lv.snare > 0 && (beat % 4 === 1 || beat % 4 === 3)) kit.play('snare', t);
};

// ---- タップの検出と再生 ----
type Options = {
  stopButton?: HTMLElement | null; // 鳴っている間だけ出す「止める」ボタン
  background?: HTMLElement | null; // 拍に合わせて少し脈打たせる背景
  baseUrl?: string; // 音声ファイルの基準パス
};

export const setupTapBeat = (target: HTMLElement, { stopButton, background, baseUrl = '/' }: Options = {}) => {
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ctx: AudioContext | null = null;
  let kit: Kit | null = null;
  let taps: number[] = [];
  let timer = 0;
  let playing = false;
  let nextTime = 0;
  let beat = 0;
  let spb = 0.5;
  let pendingKick = false; // 音の許可が下りる前のタップで、キックを鳴らせなかった

  // 音の準備。スマホでは指を離したとき（pointerup）でないと許可が下りないので、何度呼んでもよい作りにする。
  const ensure = () => {
    if (!ctx) {
      ctx = new AudioContext({ latencyHint: 'interactive' });
      kit = createKit(ctx);
      void kit.load(baseUrl);
    }
    return ctx.state === 'running' ? Promise.resolve() : ctx.resume();
  };

  const bump = (el: HTMLElement, amount: number, duration: number, delay = 0) => {
    if (reduceMotion) return;
    el.animate([{ transform: `scale(${1 + amount})` }, { transform: 'scale(1)' }], { duration, delay, easing: 'ease-out' });
  };

  const setIntensity = (v: number) => root.style.setProperty('--beat', v.toFixed(3));

  const setPlaying = (on: boolean) => {
    playing = on;
    root.classList.toggle('beat-on', on);
    target.classList.toggle('is-playing', on);
    if (stopButton) stopButton.hidden = !on;
    if (!on) setIntensity(0);
  };

  const stop = (mute = false) => {
    clearInterval(timer);
    timer = 0;
    // 止めるボタンのときは、予約済みの音が残らないようにすぐ絞る
    if (mute && ctx && kit) kit.master.gain.setTargetAtTime(0, ctx.currentTime, 0.02);
    setPlaying(false);
  };

  // 少し先までの拍を前もって予約しておく（ずれにくくするため）
  const schedule = () => {
    if (!ctx || !kit) return;
    while (nextTime < ctx.currentTime + 0.12) {
      const delay = Math.max(0, (nextTime - ctx.currentTime) * 1000);
      if (beat >= BARS * 4) {
        // 最後は頭の一発で締める
        kit.play('kick', nextTime);
        bump(target, 0.1, 200, delay);
        return stop();
      }
      scheduleBeat(kit, nextTime, beat, spb);
      const { intensity } = levels(beat);
      setTimeout(() => playing && setIntensity(intensity), delay);
      bump(target, 0.05 + intensity * 0.07, 160, delay);
      if (background) bump(background, intensity * 0.03, spb * 800, delay);
      beat++;
      nextTime += spb;
    }
  };

  // lastTap（performance.now() の値）から数えて1拍あとに、次の拍を置く
  const alignTo = (lastTap: number) => {
    if (!ctx) return;
    const elapsed = (performance.now() - lastTap) / 1000;
    nextTime = ctx.currentTime + Math.max(0.02, spb - elapsed);
  };

  const start = (intervalMs: number, lastTap: number) => {
    spb = intervalMs / 1000;
    void ensure().then(() => {
      if (!ctx || !kit) return;
      kit.master.gain.cancelScheduledValues(ctx.currentTime);
      kit.master.gain.setValueAtTime(MASTER, ctx.currentTime);
      // タップの3発がそのまま1〜3拍目なので、続きは4拍目から
      beat = START_TAPS;
      alignTo(lastTap);
      clearInterval(timer);
      timer = window.setInterval(schedule, 25);
      setPlaying(true);
      schedule();
    });
  };

  target.addEventListener('pointerdown', (e) => {
    if (e.button) return;
    const now = performance.now();

    // 鳴り出す前のタップは、そのままキックとして鳴らす（すぐ手応えが返るように）
    if (!playing) {
      bump(target, 0.08, 160);
      void ensure();
      if (ctx?.state === 'running' && kit) {
        kit.master.gain.cancelScheduledValues(ctx.currentTime);
        kit.master.gain.setValueAtTime(MASTER, ctx.currentTime);
        kit.play('kick', ctx.currentTime);
      } else {
        pendingKick = true;
      }
    }

    if (taps.length && now - taps[taps.length - 1] > MAX_INTERVAL * 1.2) taps = [];
    taps.push(now);
    taps = taps.slice(-START_TAPS);
    if (taps.length < START_TAPS) return;

    const iv = taps.slice(1).map((t, i) => t - taps[i]);
    const mean = iv.reduce((a, b) => a + b, 0) / iv.length;
    if (mean < MIN_INTERVAL || mean > MAX_INTERVAL) return;
    if (iv.some((x) => Math.abs(x - mean) > mean * TOLERANCE)) return;

    if (playing) {
      // 鳴っている途中で叩き直したら、盛り上がりはそのままでテンポだけ合わせる
      spb = mean / 1000;
      alignTo(now);
    } else {
      start(mean, now);
    }
  });

  // スマホでは、指を離した時点で初めて音が出せるようになる。最初の一発はここで鳴らす。
  target.addEventListener('pointerup', () => {
    void ensure().then(() => {
      if (!pendingKick) return;
      pendingKick = false;
      if (!playing && ctx && kit) kit.play('kick', ctx.currentTime);
    });
  });

  stopButton?.addEventListener('click', () => {
    taps = [];
    stop(true);
  });
};
