"use client";

import { useState } from "react";
import { log, rereadTitles, type LogBook } from "@/content/reading";
import s from "./chapter.module.css";

// One column per period: antiquity, Shakespeare's years, then each decade
// from 1800. Gaps mark where the scale jumps.
type Column = { label?: string; from: number; to: number; gapBefore?: boolean };
const columns: Column[] = [
  { label: "BC", from: -9999, to: 0 },
  { label: "1600", from: 1500, to: 1700, gapBefore: true },
  ...Array.from({ length: 23 }, (_, i): Column => {
    const from = 1800 + i * 10;
    return { from, to: from + 10, gapBefore: i === 0, label: from % 50 === 0 && from > 1800 ? String(from) : undefined };
  }),
];

const year = (y: number) => (y < 0 ? `c. ${-y} BC` : String(y));

// Every dated book as a dot, placed by when it was written, not when it was
// read. Pointing at or tapping a dot names the book.
export function Written() {
  const [picked, setPicked] = useState<LogBook | null>(null);
  const dated = log.filter((b) => b.written !== null).sort((a, b) => a.written! - b.written!);
  return (
    <div>
      <div className={s.written}>
        {columns.map((c) => (
          <div key={c.from} className={`${s.writtenCol} ${c.gapBefore ? s.writtenGap : ""}`}>
            <div className={s.writtenDots}>
              {dated.filter((b) => b.written! >= c.from && b.written! < c.to).map((b) => (
                <button
                  key={b.title}
                  type="button"
                  className={`${s.dot} ${rereadTitles.has(b.title) ? s.dotReread : ""}`}
                  aria-pressed={picked === b}
                  aria-label={`${b.title}, ${b.author}, ${year(b.written!)}, read ${b.read}`}
                  onClick={() => setPicked(b)}
                  onMouseEnter={() => setPicked(b)}
                  onFocus={() => setPicked(b)}
                />
              ))}
            </div>
            <span className={s.writtenLabel}>{c.label ?? " "}</span>
          </div>
        ))}
      </div>
      <p className={s.writtenCaption} aria-live="polite">
        {picked ? <span key={picked.title}><i>{picked.original ?? picked.title}</i>, {picked.author}, {year(picked.written!)}, read {picked.read}</span> : " "}
      </p>
    </div>
  );
}
