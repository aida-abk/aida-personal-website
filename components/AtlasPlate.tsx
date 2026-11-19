"use client";

// The Home plate as a brain atlas: one set of dots. At rest they form the
// FreeSurfer average brain, turning from side to side, each dot in its
// region's colour. The same dots then go through the steps of the LFP project:
// the cortex inflated, one simulated trace of a fitted model, that trace in
// its two delay coordinates, the equation form behind it, and the three
// families the fitted models fell into. Pointing at a chapter in the contents
// regroups them into that chapter's drawing.
import { useEffect, useRef, useState } from "react";
import { books, discs, seeded, strands, type Shape } from "./shapes";
import s from "./plate.module.css";

const RATIO = 565 / 843;
const REACH = 40;        // px: how far the pointer pushes
const SIDE = Math.PI / 2; // the angle at which the left side faces the viewer
const SWING = 0.8;       // radians the brain turns to either side of that
const TURN = 0.0045;     // phase per frame: one swing there and back in about 23 seconds
const TILT = 0.2;        // radians: the brain is seen from slightly above
const STILL = SIDE + 0.45; // the still view: the left side, a little from the front
const HOLD = { brain: 8000, inflated: 6000, signal: 4000, portrait: 4000, equation: 4000, families: 4000 } as const; // ms each is held
const EQUATION = "ẋ = Θ(x) ξ"; // the general form of a SINDy model

const SEQUENCE = ["brain", "inflated", "signal", "portrait", "equation", "families"] as const;
const CHAPTERS = ["trajectory", "projects", "reading"] as const;
type State = (typeof SEQUENCE)[number] | (typeof CHAPTERS)[number];

// A surface: where each point is, which way the surface faces there, and half its size in mm.
type Surface = { pos: Int16Array; facing: Int8Array; half: number[] };
type Data = {
  n: number; unit: number; rgb: Uint8Array;
  pial: Surface; inflated: Surface;
  trace: Float32Array; counts: number[];
};

// One oscillator-type model's two delay coordinates over time: the model
// whose swing is the median of its type.
const pickTrace = (meta: { points: number; clip: number; models: number[][] }, traj: Int8Array) => {
  const P = meta.points, swing: [number, number][] = [];
  meta.models.forEach((m, i) => {
    if (m[0] !== 0) return;
    let lo = 127, hi = -127;
    for (let p = 0; p < P; p++) { const v = traj[(i * P + p) * 2]; lo = Math.min(lo, v); hi = Math.max(hi, v); }
    swing.push([hi - lo, i]);
  });
  swing.sort((a, b) => a[0] - b[0]);
  const i = swing[Math.floor(swing.length / 2)][1], out = new Float32Array(P * 2);
  for (let p = 0; p < P * 2; p++) out[p] = (traj[i * P * 2 + p] / 127) * meta.clip;
  return out;
};

// The trace, left to right, as a band of dots.
const signal = (trace: Float32Array): Shape => (n, w, h, rand) => {
  const out = new Float32Array(n * 2), P = trace.length / 2;
  let peak = 0.001;
  for (let p = 0; p < P; p++) peak = Math.max(peak, Math.abs(trace[2 * p]));
  for (let k = 0; k < n; k++) {
    const t = rand() * (P - 1), i = Math.floor(t), f = t - i, j = Math.min(P - 1, i + 1);
    const v = trace[2 * i] + (trace[2 * j] - trace[2 * i]) * f;
    out[2 * k] = w * 0.04 + (t / (P - 1)) * w * 0.92;
    out[2 * k + 1] = h / 2 - (v / peak) * h * 0.36 + (rand() - rand()) * h * 0.022;
  }
  return out;
};

// The same trace with its second delay coordinate against its first: the
// path the model follows, which is what the equation is fitted to.
const portrait = (trace: Float32Array): Shape => (n, w, h, rand) => {
  const out = new Float32Array(n * 2), P = trace.length / 2;
  let peak = 0.001;
  for (const v of trace) peak = Math.max(peak, Math.abs(v));
  for (let k = 0; k < n; k++) {
    const t = rand() * (P - 1), i = Math.floor(t), f = t - i, j = Math.min(P - 1, i + 1);
    const a = trace[2 * i] + (trace[2 * j] - trace[2 * i]) * f, b = trace[2 * i + 1] + (trace[2 * j + 1] - trace[2 * i + 1]) * f;
    out[2 * k] = w / 2 + (a / peak) * h * 0.42 + (rand() - rand()) * h * 0.02;
    out[2 * k + 1] = h / 2 - (b / peak) * h * 0.42 + (rand() - rand()) * h * 0.02;
  }
  return out;
};

// The equation, written once off screen and filled with dots.
const equation: Shape = (n, w, h, rand) => {
  const out = new Float32Array(n * 2), c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  let px = h * 0.5;
  ctx.font = `italic ${px}px Georgia, "Times New Roman", serif`;
  px *= Math.min(1, (w * 0.86) / ctx.measureText(EQUATION).width);
  ctx.font = `italic ${px}px Georgia, "Times New Roman", serif`;
  ctx.fillText(EQUATION, w / 2, h / 2);
  const a = ctx.getImageData(0, 0, w, h).data, inked: number[] = [];
  for (let i = 0; i < w * h; i++) if (a[4 * i + 3] > 128) inked.push(i);
  for (let k = 0; k < n; k++) {
    const i = inked.length ? inked[Math.floor(rand() * inked.length)] : Math.floor(rand() * w * h);
    out[2 * k] = (i % w) + rand(); out[2 * k + 1] = Math.floor(i / w) + rand();
  }
  return out;
};

// One of the plate's data files. A browser can hold a broken copy of a file
// (seen in Firefox: an empty one, which it keeps serving on every reload), so
// a copy that is empty or does not parse is fetched again past the browser's
// own store.
const load = async <T,>(url: string, read: (r: Response) => Promise<T>): Promise<T> => {
  const get = async (init?: RequestInit) => {
    const r = await fetch(url, init);
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    const value = await read(r);
    if (value instanceof ArrayBuffer && !value.byteLength) throw new Error(`${url}: empty`);
    return value;
  };
  try { return await get(); } catch { return get({ cache: "reload" }); }
};

// Something that draws the dots: `draw` paints them where `at` and `look`
// (each dot's radius and brightness) now say, `release` lets go of it.
type Painter = { draw: () => void; release: () => void };
type Dots = { canvas: HTMLCanvasElement; w: number; h: number; dpr: number; n: number; rgb: Uint8Array; at: Float32Array; look: Float32Array };

// The dots drawn by the graphics card, all in one call: filling this many
// circles one by one on every frame is slower. Gives null where the browser
// has no working WebGL, and calls `lost` if it stops working later.
const cardPainter = ({ canvas, w, h, dpr, n, rgb, at, look }: Dots, lost: () => void): Painter | null => {
  const gl = canvas.getContext("webgl", { antialias: false });
  if (!gl) return null;
  gl.viewport(0, 0, canvas.width, canvas.height);
  const shader = (type: number, source: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, source); gl.compileShader(sh);
    return sh;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, `
    attribute vec2 at; attribute vec2 look; attribute vec3 rgb;
    uniform vec2 plate; uniform float dpr;
    varying vec4 ink; varying float px;
    void main() {
      gl_Position = vec4(at.x / plate.x * 2.0 - 1.0, 1.0 - at.y / plate.y * 2.0, 0.0, 1.0);
      px = look.x * 2.0 * dpr; gl_PointSize = px;
      ink = vec4(rgb, look.y);
    }`));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec4 ink; varying float px;
    void main() {
      float d = length(gl_PointCoord - 0.5) * px;
      float a = ink.a * clamp(px * 0.5 - d, 0.0, 1.0);
      gl_FragColor = vec4(ink.rgb * a, a);
    }`));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Atlas plate: WebGL program did not link.", gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);
  gl.uniform2f(gl.getUniformLocation(program, "plate"), w, h);
  gl.uniform1f(gl.getUniformLocation(program, "dpr"), dpr);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  const feed = (name: string, values: ArrayBufferView, parts: number, type: number, fixed: boolean) => {
    const buffer = gl.createBuffer()!, where = gl.getAttribLocation(program, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, values, fixed ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(where);
    gl.vertexAttribPointer(where, parts, type, type === gl.UNSIGNED_BYTE, 0, 0);
    return buffer;
  };
  const colours = feed("rgb", rgb.subarray(0, n * 3), 3, gl.UNSIGNED_BYTE, true);
  const places = feed("at", at, 2, gl.FLOAT, false), looks = feed("look", look, 2, gl.FLOAT, false);
  if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) return null;
  canvas.addEventListener("webglcontextlost", lost);
  return {
    draw: () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, places); gl.bufferSubData(gl.ARRAY_BUFFER, 0, at);
      gl.bindBuffer(gl.ARRAY_BUFFER, looks); gl.bufferSubData(gl.ARRAY_BUFFER, 0, look);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, n);
    },
    release: () => {
      canvas.removeEventListener("webglcontextlost", lost);
      [colours, places, looks].forEach((b) => gl.deleteBuffer(b)); gl.deleteProgram(program);
    },
  };
};

// The same dots filled one by one, for browsers where the graphics card is
// not available to the page.
const flatPainter = ({ canvas, w, h, dpr, n, rgb, at, look }: Dots): Painter | null => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const inks = Array.from({ length: n }, (_, i) => `rgb(${rgb[3 * i]},${rgb[3 * i + 1]},${rgb[3 * i + 2]})`);
  return {
    draw: () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        const r = look[2 * i];
        if (r <= 0) continue;
        ctx.globalAlpha = look[2 * i + 1]; ctx.fillStyle = inks[i];
        ctx.beginPath(); ctx.arc(at[2 * i], at[2 * i + 1], r, 0, 6.2832); ctx.fill();
      }
    },
    release: () => {},
  };
};

export function AtlasPlate() {
  const ref = useRef<HTMLCanvasElement>(null);
  const show = useRef<(c: State | null) => void>(() => {});
  const [w, setW] = useState(0);
  const [data, setData] = useState<Data | null>(null);
  // True once the graphics card turned out not to be usable: the canvas is
  // then replaced by a fresh one that is drawn on directly.
  const [flat, setFlat] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([
      load("/atlas/meta.json", (r) => r.json()),
      load("/atlas/points.bin", (r) => r.arrayBuffer()),
      load("/models/meta.json", (r) => r.json()),
      load("/models/trajectories.bin", (r) => r.arrayBuffer()),
    ]).then(([atlas, points, models, traj]) => {
      if (!live) return;
      const n = atlas.points;
      setData({
        n, unit: atlas.unit_mm, rgb: new Uint8Array(points, n * 9, n * 3),
        pial: { pos: new Int16Array(points, 0, n * 3), facing: new Int8Array(points, n * 6, n * 3), half: atlas.half_extent_mm },
        inflated: { pos: new Int16Array(points, n * 12, n * 3), facing: new Int8Array(points, n * 18, n * 3), half: atlas.inflated_half_extent_mm },
        trace: pickTrace(models, new Int8Array(traj)), counts: models.counts,
      });
    }).catch((e) => console.warn("Atlas plate: its data did not load.", e));
    return () => { live = false; };
  }, []);

  useEffect(() => {
    const measure = new ResizeObserver(([entry]) => setW(Math.round(entry.contentRect.width)));
    measure.observe(ref.current!);
    return () => measure.disconnect();
  }, [flat]);

  // Pointing at a chapter in the contents calls up its drawing; leaving it
  // hands the plate back to its own sequence.
  useEffect(() => {
    const entries = [...document.querySelectorAll<HTMLLIElement>('nav[aria-label="Pages"] > ol > li')];
    const stop: (() => void)[] = [];
    let back = 0;
    entries.forEach((li) => li.querySelectorAll("a").forEach((a) => {
      const chapter = CHAPTERS.find((c) => a.getAttribute("href")?.includes(c));
      if (!chapter) return;
      const on = () => { clearTimeout(back); show.current(chapter); };
      const off = () => { back = window.setTimeout(() => show.current(null), 300); };
      for (const [name, fn] of [["mouseenter", on], ["focus", on], ["mouseleave", off], ["blur", off]] as const) {
        a.addEventListener(name, fn);
        stop.push(() => a.removeEventListener(name, fn));
      }
    }));
    return () => { clearTimeout(back); stop.forEach((f) => f()); };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !w || !data) return;
    const h = Math.round(w * RATIO), dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = w * dpr; canvas.height = h * dpr;

    // Fewer dots when they are filled one by one, to stay smooth.
    const gap = Math.max(2.6, Math.sqrt((w * h) / (flat ? 8000 : 14000)));
    const n = Math.min(data.n, Math.floor(w / gap) * Math.floor(h / gap));
    const at = new Float32Array(n * 2), look = new Float32Array(n * 2);
    const dots: Dots = { canvas, w, h, dpr, n, rgb: data.rgb, at, look };
    const painter = flat ? flatPainter(dots) : cardPainter(dots, () => setFlat(true));
    if (!painter) { if (!flat) setFlat(true); return; }
    const rand = seeded(5);

    // A surface in px, centred on the plate and sized to stay inside it as it
    // swings. x right, y front, z up.
    const fit = ({ half }: Surface) =>
      Math.min((h * 0.98) / (2 * (half[2] + 14)), (w * 0.94) / (2 * Math.max(half[1], 0.72 * (half[0] + half[1])))) * data.unit;
    const scales = new Map([[data.pial, fit(data.pial)], [data.inflated, fit(data.inflated)]]);
    const tiltC = Math.cos(TILT), tiltS = Math.sin(TILT);
    const light = [-0.45, 0.6, 0.66]; // towards the viewer's upper left
    const cell = gap * 2.2, gcols = Math.ceil(w / cell) + 1, grows = Math.ceil(h / cell) + 1;
    const nearest = new Float32Array(gcols * grows);

    const brain = new Float32Array(n * 2), depth = new Float32Array(n), lit = new Float32Array(n);
    const place = (angle: number, surface: Surface) => {
      const { pos, facing } = surface, scale = scales.get(surface)!;
      const c = Math.cos(angle), sn = Math.sin(angle), deep = (14 / data.unit) * scale;
      nearest.fill(-1e9);
      for (let i = 0; i < n; i++) {
        const x = pos[3 * i] * scale, y = pos[3 * i + 1] * scale, z = pos[3 * i + 2] * scale;
        const u = x * c + y * sn, d = -x * sn + y * c;
        brain[2 * i] = w / 2 + u; brain[2 * i + 1] = h / 2 - (z * tiltC - d * tiltS);
        const nx = facing[3 * i], ny = facing[3 * i + 1], nz = facing[3 * i + 2];
        const nu = nx * c + ny * sn, nd = -nx * sn + ny * c;
        const towards = (nd * tiltC + nz * tiltS) / 127, up = (nz * tiltC - nd * tiltS) / 127;
        depth[i] = towards > 0.05 ? d * tiltC + z * tiltS : -1e9;
        lit[i] = Math.max(0, (nu / 127) * light[0] + up * light[1] + towards * light[2]);
        if (depth[i] > -1e8) {
          const g = Math.floor(brain[2 * i] / cell) + gcols * Math.floor(brain[2 * i + 1] / cell);
          if (g >= 0 && g < nearest.length && depth[i] > nearest[g]) nearest[g] = depth[i];
        }
      }
      // A dot shows only if it faces the viewer and nothing nearer covers it.
      for (let i = 0; i < n; i++) {
        const g = Math.floor(brain[2 * i] / cell) + gcols * Math.floor(brain[2 * i + 1] / cell);
        if (depth[i] < (nearest[g] ?? 1e9) - deep) lit[i] = -1; else lit[i] = 0.42 + 0.58 * lit[i];
      }
    };

    const vel = new Float32Array(n * 2);
    const size = new Float32Array(n), wait = new Float32Array(n), glow = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      at[2 * i] = rand() * w; at[2 * i + 1] = rand() * h;
      size[i] = gap * (0.42 + rand() * 0.2);
      wait[i] = rand() * 70;
    }

    // Each drawing's places are handed out front to back along the brain, so
    // a dot travels to a place near its own end of the plate.
    const byX = Array.from({ length: n }, (_, i) => i).sort((a, b) => data.pial.pos[3 * a + 1] - data.pial.pos[3 * b + 1]);
    const arrange = (shape: Shape) => {
      const raw = shape(n, w, h, seeded(9)), out = new Float32Array(n * 2);
      const places = Array.from({ length: n }, (_, k) => k).sort((a, b) => raw[2 * a] - raw[2 * b]);
      byX.forEach((dot, k) => { out[2 * dot] = raw[2 * places[k]]; out[2 * dot + 1] = raw[2 * places[k] + 1]; });
      return out;
    };
    const goals: Record<State, Float32Array> = {
      brain, inflated: brain, signal: arrange(signal(data.trace)), portrait: arrange(portrait(data.trace)),
      equation: arrange(equation), families: arrange(discs(data.counts)),
      trajectory: arrange(strands), projects: arrange(discs(data.counts)), reading: arrange(books),
    };

    let state: State = "brain", goal: Float32Array = brain, phase = 0;
    let swell = 1; // dots are drawn larger as the brain, where only the near side shows
    const paint = () => {
      for (let i = 0; i < n; i++) {
        look[2 * i] = glow[i] < 0.04 ? 0 : size[i] * swell * Math.min(1, glow[i] * 4);
        look[2 * i + 1] = Math.min(1, glow[i]);
      }
      painter.draw();
    };
    const release = painter.release;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const still = (c: State) => {
        if (c === "brain" || c === "inflated") { place(STILL, data[c === "brain" ? "pial" : "inflated"]); glow.set(lit); swell = 1.5; } else { glow.fill(1); swell = 1; }
        at.set(goals[c]); paint();
      };
      still("brain");
      show.current = (c) => still(c ?? "brain");
      const step = () => still(state = SEQUENCE[(SEQUENCE.indexOf(state as never) + 1) % SEQUENCE.length]);
      canvas.addEventListener("click", step);
      return () => { show.current = () => {}; canvas.removeEventListener("click", step); release(); };
    }

    let pointer: { x: number; y: number } | null = null;
    let frame = 0, ticks = 0, running = false, seen = false, held: State | null = null, since = performance.now();
    const tick = () => {
      ticks++;
      const turning = state === "brain" || state === "inflated";
      if (turning) { phase += TURN; place(SIDE + SWING * Math.sin(phase), state === "brain" ? data.pial : data.inflated); }
      swell += ((turning ? 1.5 : 1) - swell) * 0.05;
      let moving = 0;
      for (let i = 0; i < n; i++) {
        if (ticks < wait[i]) { moving++; continue; }
        const x = at[2 * i], y = at[2 * i + 1];
        let ax = (goal[2 * i] - x) * 0.012, ay = (goal[2 * i + 1] - y) * 0.012;
        if (pointer) {
          const dx = x - pointer.x, dy = y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < REACH * REACH && d2 > 0.01) {
            const d = Math.sqrt(d2), push = (1 - d / REACH) * 1.6;
            ax += (dx / d) * push; ay += (dy / d) * push;
          }
        }
        vel[2 * i] = (vel[2 * i] + ax) * 0.86; vel[2 * i + 1] = (vel[2 * i + 1] + ay) * 0.86;
        at[2 * i] = x + vel[2 * i]; at[2 * i + 1] = y + vel[2 * i + 1];
        const want = turning ? Math.max(0, lit[i]) : 1;
        glow[i] += (want - glow[i]) * 0.07;
        if (Math.abs(vel[2 * i]) + Math.abs(vel[2 * i + 1]) > 0.02 || Math.abs(want - glow[i]) > 0.02
          || Math.abs(goal[2 * i] - x) + Math.abs(goal[2 * i + 1] - y) > 0.3) moving++;
      }
      paint();
      // The brain keeps turning; any other drawing rests once its dots are in place.
      if (turning || moving || pointer || swell > 1.01) frame = requestAnimationFrame(tick); else running = false;
    };
    const wake = () => { if (!running && seen) { running = true; frame = requestAnimationFrame(tick); } };
    const go = (c: State) => { state = c; goal = goals[c]; since = performance.now(); wake(); };
    show.current = (c) => { held = c; go(c ?? "brain"); };

    // Left alone, the plate runs its own sequence: brain, trace, equation.
    const clock = window.setInterval(() => {
      if (pointer) since = performance.now(); // a pointer on the plate holds the drawing
      if (held || !seen || !(state in HOLD)) return;
      if (performance.now() - since > HOLD[state as keyof typeof HOLD])
        go(SEQUENCE[(SEQUENCE.indexOf(state as never) + 1) % SEQUENCE.length]);
    }, 250);

    const move = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
      wake();
    };
    const leave = () => { pointer = null; };
    // A tap or click on the plate moves it on to the next state.
    const step = () => { if (state in HOLD) go(SEQUENCE[(SEQUENCE.indexOf(state as never) + 1) % SEQUENCE.length]); };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("click", step);
    const watch = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      if (seen) { since = performance.now(); wake(); } else { cancelAnimationFrame(frame); running = false; }
    });
    watch.observe(canvas);
    return () => {
      show.current = () => {};
      cancelAnimationFrame(frame); clearInterval(clock); watch.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("click", step);
      release();
    };
  }, [w, data, flat]);

  return (
    <figure className={s.plate}>
      <canvas key={flat ? "flat" : "card"} ref={ref} role="img" style={{ aspectRatio: "843 / 565" }}
        aria-label="A brain drawn in dots, each coloured by its region of cortex. The dots go on to form the inflated cortex, one trace of a simulated signal, the loop that trace follows in two coordinates, the equation form ẋ = Θ(x) ξ, and three discs for the three families of fitted models." />
      <figcaption>FreeSurfer average brain (fsaverage), Desikan-Killiany atlas. Trace: simulated output of one fitted model</figcaption>
    </figure>
  );
}
