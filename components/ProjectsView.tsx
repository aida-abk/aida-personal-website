"use client";

import { useState } from "react";
import { makeLinker } from "./Linked";
import { Models } from "./Models";
import { Parts } from "./Parts";
import s from "./chapter.module.css";
import { cards, fields, flagships } from "@/content/projects";
import { projectRefs } from "@/content/references";

// ---- The map: fields at the corners, each project placed between its fields.
// The ring is taller than it is wide so the field names fit beside it.
const W = 720, H = 600, cx = W / 2, cy = H / 2, RX = 132, RY = 212;
const corner = (i: number) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / fields.length;
  return { x: cx + RX * Math.cos(a), y: cy + RY * Math.sin(a) };
};

type Node = { n: number; id: string; title: string; fields: string[]; big: boolean; x: number; y: number };

const nodes: Node[] = [
  ...flagships.map((p) => ({ title: p.title, fields: p.fields.split(", "), big: true })),
  ...cards.map((c) => ({ title: c.project, fields: c.fields.split(", "), big: false })),
].map((p, i) => {
  const pts = p.fields.map((f) => corner(fields.indexOf(f)));
  let x = pts.reduce((a, b) => a + b.x, 0) / pts.length;
  let y = pts.reduce((a, b) => a + b.y, 0) / pts.length;
  if (pts.length === 1) { x = cx + (x - cx) * 0.7; y = cy + (y - cy) * 0.7; }
  return { ...p, n: i + 1, id: `project-${i + 1}`, x, y };
});
// Projects that share fields land on the same spot; push them apart until
// no two circles touch.
for (let step = 0; step < 200; step++) {
  for (const a of nodes) for (const b of nodes) {
    if (a.n >= b.n) continue;
    let dx = b.x - a.x, dy = b.y - a.y;
    let d = Math.hypot(dx, dy);
    const min = (a.big ? 19 : 14) + (b.big ? 19 : 14) + 8;
    if (d >= min) continue;
    if (d < 0.01) { dx = Math.cos(a.n * 2.4); dy = Math.sin(a.n * 2.4); d = 1; }
    const push = (min - d) / 2;
    a.x -= (dx / d) * push; a.y -= (dy / d) * push;
    b.x += (dx / d) * push; b.y += (dy / d) * push;
  }
}

export function ProjectsView({ pipeline }: { pipeline: { wide: string; narrow: string } }) {
  const [picked, setPicked] = useState<number | null>(null);
  const link = makeLinker(projectRefs);
  const node = nodes.find((p) => p.n === picked);

  // Choosing a project on the map opens its write-up and brings it into view.
  const go = (p: Node) => {
    setPicked(p.n);
    const el = document.getElementById(p.id);
    if (!el) return;
    if (el instanceof HTMLDetailsElement) el.open = true;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.map} role="group" aria-label="Fields">
        {node?.fields.map((f) => {
          const c = corner(fields.indexOf(f));
          return <line key={f} x1={node.x} y1={node.y} x2={c.x} y2={c.y} className={s.mapLine} />;
        })}
        {fields.map((f, i) => {
          const c = corner(i);
          // Names at the top and bottom are centred; names at the sides run
          // outward. A long name is set on two lines.
          const side = (c.x - cx) / RX;
          const words = f.split(" ");
          const lines = words.length > 2 ? [words.slice(0, 2).join(" "), words.slice(2).join(" ")] : [f];
          const centred = Math.abs(side) < 0.5;
          // The two names at the bottom are nudged apart so they never touch.
          const x = centred ? c.x + (Math.abs(side) > 0.1 ? Math.sign(side) * 26 : 0) : c.x + Math.sign(side) * 26;
          const y = centred ? (c.y < cy ? c.y - 30 - (lines.length - 1) * 24 : c.y + 44) : c.y + 7;
          return (
            <text key={f} x={x} y={y} textAnchor={centred ? "middle" : side > 0 ? "start" : "end"}
              className={`${s.mapField} ${node?.fields.includes(f) ? s.mapFieldLit : ""}`}>
              {lines.map((l, k) => <tspan key={l} x={x} dy={k === 0 ? 0 : 24}>{l}</tspan>)}
            </text>
          );
        })}
        {nodes.map((p) => (
          <g key={p.n} className={`${s.mapNode} ${picked === p.n ? s.mapNodeOn : ""}`} tabIndex={0} role="button"
            aria-label={p.title}
            onClick={() => go(p)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(p); } }}
            onMouseEnter={() => setPicked(p.n)} onFocus={() => setPicked(p.n)}>
            <circle cx={p.x} cy={p.y} r={p.big ? 19 : 14} />
            <text x={p.x} y={p.y + 5.5} textAnchor="middle">{p.n}</text>
          </g>
        ))}
      </svg>
      <p className={s.mapCaption} aria-live="polite">{node ? <span key={node.n}>{node.title}</span> : " "}</p>

      {flagships.map((p, i) => (
        <details key={p.title} id={nodes[i].id}
          className={`${s.lead} ${picked === nodes[i].n ? s.leadOn : ""}`}
          onMouseEnter={() => setPicked(nodes[i].n)}>
          <summary>
            <span className={s.leadNo}>{nodes[i].n}</span>
            <span className={s.leadBig}>{p.lead.big}<small>{p.lead.label}</small></span>
            <span className={s.heading}>{p.title}</span>
            <span className={s.leadQuestion}>{link(p.question)}</span>
          </summary>
          <div className={s.leadBody}>
            <p className={s.meta}>{link(p.where)}</p>
            {p.drawing === "models" && <Models />}
            {p.drawing === "pipeline" && (
              <figure className={`${s.figure} ${s.diagram}`}>
                <div className={s.diagramWide} dangerouslySetInnerHTML={{ __html: pipeline.wide }} />
                <div className={s.diagramNarrow} dangerouslySetInnerHTML={{ __html: pipeline.narrow }} />
              </figure>
            )}
            {p.image && (
              <figure className={s.figure}>
                {p.image.href
                  ? <a href={p.image.href}><img src={p.image.src} width={p.image.width} height={p.image.height} alt={p.image.alt} loading="lazy" /></a>
                  : <img src={p.image.src} width={p.image.width} height={p.image.height} alt={p.image.alt} loading="lazy" />}
                {p.image.caption && <figcaption>{p.image.caption}</figcaption>}
              </figure>
            )}
            <dl className={s.fields}>
              <dt className={s.label}>Fields</dt><dd>{p.fields}</dd>
              <dt className={s.label}>What I did</dt>
              <dd><ul className={s.dashes}>{p.did.map((d) => <li key={d}>{link(d)}</li>)}</ul></dd>
              {p.result && <><dt className={s.label}>Result</dt><dd>{p.result}</dd></>}
              {p.shownAt && <><dt className={s.label}>Shown at</dt><dd>{p.shownAt}</dd></>}
              {p.figure.length > 0 && <><dt className={s.label}>Figure</dt><dd><Parts parts={p.figure} /></dd></>}
              <dt className={s.label}>{p.linksLabel}</dt><dd><Parts parts={p.links} /></dd>
            </dl>
          </div>
        </details>
      ))}

      <ul className={s.cards}>
        {cards.map((c, i) => {
          const n = nodes[flagships.length + i];
          return (
            <li key={c.project} id={n.id} className={picked === n.n ? s.leadOn : undefined} onMouseEnter={() => setPicked(n.n)}>
              <h2><span className={s.leadNo}>{n.n}</span>{c.project}</h2>
              <p className={s.meta}>{c.when}. {c.fields}</p>
              <p>{link(c.line)}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
