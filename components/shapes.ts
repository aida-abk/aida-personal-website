// The drawings the plate's dots regroup into for each chapter, and the seeded
// random numbers that keep every visit's drawing the same.
import { log } from "@/content/reading";

export const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
export type Rand = () => number;
export type Shape = (n: number, w: number, h: number, rand: Rand) => Float32Array;

const inDisc = (out: Float32Array, k: number, x: number, y: number, r: number, rand: Rand) => {
  const a = rand() * 6.2832, d = Math.sqrt(rand()) * r;
  out[2 * k] = x + Math.cos(a) * d; out[2 * k + 1] = y + Math.sin(a) * d;
};

// Trajectory: six strands, one per thread, that meet and go on as one.
export const strands: Shape = (n, w, h, rand) => {
  const out = new Float32Array(n * 2), meet = { x: w / 2, y: h * 0.66 };
  for (let k = 0; k < n; k++) {
    const part = Math.floor(rand() * 7.7), t = rand(), spread = (rand() - rand()) * w * 0.012;
    if (part >= 6) { out[2 * k] = meet.x + spread * 1.3; out[2 * k + 1] = meet.y + t * (h * 0.97 - meet.y); continue; }
    const x0 = w * (0.1 + 0.16 * part), y0 = h * 0.04, ease = t * t * (3 - 2 * t);
    out[2 * k] = x0 + (meet.x - x0) * ease + spread; out[2 * k + 1] = y0 + (meet.y - y0) * t;
  }
  return out;
};

// Projects: the fitted models in their three types, each disc sized by its count.
export const discs = (counts: number[]): Shape => (n, w, h, rand) => {
  const out = new Float32Array(n * 2), root = counts.map(Math.sqrt), gap = w * 0.04;
  const unit = Math.min((w * 0.96 - 2 * gap) / (2 * root.reduce((a, b) => a + b, 0)), (h * 0.46) / Math.max(...root));
  const total = counts.reduce((a, b) => a + b, 0);
  let left = (w - (2 * unit * root.reduce((a, b) => a + b, 0) + 2 * gap)) / 2, k = 0;
  counts.forEach((c, i) => {
    const r = root[i] * unit, end = i === counts.length - 1 ? n : k + Math.round((n * c) / total);
    for (; k < end; k++) inDisc(out, k, left + r, h / 2, r, rand);
    left += 2 * r + gap;
  });
  return out;
};

// Reading: every dated book as a small disc, in a column for when it was written.
export const books: Shape = (n, w, h, rand) => {
  const column = (y: number) => (y < 0 ? 0 : y < 1800 ? 1 : 2 + Math.min(22, Math.floor((y - 1800) / 10)));
  const stacks: number[] = new Array(25).fill(0);
  const dated = log.filter((b) => b.written !== null);
  const places = dated.map((b) => { const c = column(b.written!); return { c, row: stacks[c]++ }; });
  const cw = (w * 0.96) / 25, r = Math.min(cw * 0.42, (h * 0.9) / (2 * Math.max(...stacks)));
  const out = new Float32Array(n * 2);
  for (let k = 0; k < n; k++) {
    const p = places[Math.floor((k * places.length) / n)];
    inDisc(out, k, w * 0.02 + (p.c + 0.5) * cw, h * 0.95 - r - p.row * 2 * r, r * 0.86, rand);
  }
  return out;
};
