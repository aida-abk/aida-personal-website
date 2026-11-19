"use client";

// Every fitted model of the LFP project as one small ink trajectory. The marks
// open as a single cloud and sort themselves into the three types of model.
// The data is built by scripts/build_models.py.
import { useEffect, useRef, useState } from "react";
import s from "./models.module.css";

// The three types, as worded in the project README.
const TYPES = [
  "fixed-frequency, fixed-amplitude oscillators",
  "weakly nonlinear models that keep a stable dominant frequency",
  "unstable models whose trajectories diverge",
];

type Meta = { points: number; counts: number[]; models: number[][] };
type Data = { meta: Meta; traj: Int8Array };
type Group = { x: number; y: number; r: number };

const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const WAIT = 900, STAGGER = 1300, MOVE = 2400; // ms: the cloud holds, then sorts
const TAIL = 12;                                // points of ink behind each pen

export function Models() {
  const ref = useRef<HTMLCanvasElement>(null);
  const groups = useRef<Group[]>([]);
  const lit = useRef<number | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [width, setWidth] = useState(0);
  lit.current = picked;

  useEffect(() => {
    let live = true;
    Promise.all([
      fetch("/models/meta.json").then((r) => r.json()),
      fetch("/models/trajectories.bin").then((r) => r.arrayBuffer()),
    ]).then(([meta, buf]) => { if (live) setData({ meta, traj: new Int8Array(buf) }); }).catch(() => {});
    // Measured whenever the canvas changes size, which includes the moment
    // the project it sits in is opened.
    const measure = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    measure.observe(ref.current!);
    return () => { live = false; measure.disconnect(); };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !data || !width) return;
    const { meta, traj } = data, n = meta.models.length, P = meta.points;

    // Three discs in a row, each with an area in proportion to its count.
    const w = width, gap = w * 0.035;
    const root = meta.counts.map(Math.sqrt);
    const unit = Math.min((w * 0.96 - 2 * gap) / (2 * root.reduce((a, b) => a + b, 0)), 150 / Math.max(...root));
    const radii = root.map((q) => q * unit);
    const h = Math.round(2 * Math.max(...radii) + 36);
    let left = (w - (2 * radii.reduce((a, b) => a + b, 0) + 2 * gap)) / 2;
    groups.current = radii.map((r) => { const g = { x: left + r, y: h / 2, r }; left += 2 * r + gap; return g; });

    const dpr = window.devicePixelRatio || 1;
    canvas.style.height = `${h}px`;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const white = css.getPropertyValue("--white").trim(), accent = css.getPropertyValue("--accent").trim();

    // Where each mark starts (somewhere in one cloud) and where it settles.
    const rand = seeded(3);
    const from = new Float32Array(n * 2), to = new Float32Array(n * 2);
    const delay = new Float32Array(n), phase = new Float32Array(n);
    const seat = [0, 0, 0];
    const order: number[][] = [[], [], []];
    for (let i = 0; i < n; i++) {
      const kind = meta.models[i][0], g = groups.current[kind];
      const a = rand() * 2 * Math.PI, d = Math.sqrt(rand());
      from[2 * i] = w / 2 + Math.cos(a) * d * w * 0.46;
      from[2 * i + 1] = h / 2 + Math.sin(a) * d * (h / 2 - 14);
      const j = seat[kind]++, rr = g.r * Math.sqrt((j + 0.5) / meta.counts[kind]) * 0.94;
      to[2 * i] = g.x + Math.cos(j * 2.39996) * rr;
      to[2 * i + 1] = g.y + Math.sin(j * 2.39996) * rr;
      delay[i] = rand() * STAGGER; phase[i] = rand() * (P + TAIL);
      order[kind].push(i);
    }
    const size = Math.max(2.2, unit * 0.9) / 127 * 4; // px per stored step

    const draw = (ms: number, still: boolean) => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.6; ctx.lineJoin = "round";
      for (let kind = 0; kind < 3; kind++) {
        const on = lit.current;
        ctx.strokeStyle = on === kind ? accent : white;
        ctx.globalAlpha = on !== null && on !== kind ? 0.16 : 0.55;
        ctx.beginPath();
        for (const i of order[kind]) {
          const t = still ? 1 : Math.min(1, Math.max(0, (ms - WAIT - delay[i]) / MOVE));
          const e = t * t * (3 - 2 * t);
          const x = from[2 * i] + (to[2 * i] - from[2 * i]) * e;
          const y = from[2 * i + 1] + (to[2 * i + 1] - from[2 * i + 1]) * e;
          // The pen runs along the trajectory; a still drawing shows all of it.
          const head = still ? P - 1 : Math.floor((ms * 0.022 + phase[i]) % (P + TAIL));
          const a = still ? 0 : Math.max(0, head - TAIL), b = Math.min(P - 1, head);
          for (let k = a; k <= b; k++) {
            const px = x + traj[(i * P + k) * 2] * size, py = y - traj[(i * P + k) * 2 + 1] * size;
            if (k === a) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0, true);
      const again = setInterval(() => draw(0, true), 250); // keeps the highlight current
      return () => clearInterval(again);
    }
    // Runs only while the drawing is on screen.
    let frame = 0, start = 0;
    const tick = (now: number) => { if (!start) start = now; draw(now - start, false); frame = requestAnimationFrame(tick); };
    const watch = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    watch.observe(canvas);
    return () => { watch.disconnect(); cancelAnimationFrame(frame); };
  }, [data, width]);

  const pick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left, y = e.clientY - box.top;
    const k = groups.current.findIndex((g) => Math.hypot(x - g.x, y - g.y) < g.r + 8);
    setPicked(k < 0 ? null : k);
  };

  const total = data?.meta.models.length;
  return (
    <div>
      <canvas ref={ref} className={s.canvas} style={{ height: 320 }} role="img"
        aria-label={total ? `${total.toLocaleString("en-US")} fitted models, sorted into three types` : "Fitted models"}
        onPointerMove={pick} onPointerDown={pick} onPointerLeave={() => setPicked(null)} />
      <p className={s.caption} aria-live="polite">
        {data && picked !== null ? `${data.meta.counts[picked].toLocaleString("en-US")} ${TYPES[picked]}` : " "}
      </p>
    </div>
  );
}
