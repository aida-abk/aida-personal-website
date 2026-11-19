"use client";

import { useState } from "react";
import { makeLinker } from "./Linked";
import { type Part } from "./Parts";
import { Todo } from "./Todo";
import s from "./chapter.module.css";
import { trajectoryRefs } from "@/content/references";
import { columns, terms, threads } from "@/content/trajectory";

// The terms, each open to start with; a click on its heading closes it to
// one line. Choosing a thread keeps
// the terms that carry it in ink and fades the rest.
export function TrajectoryList() {
  const [thread, setThread] = useState<string | null>(null);
  const link = makeLinker(trajectoryRefs);
  const show = (parts: Part[]) =>
    parts.map((p, i) =>
      typeof p === "string" ? <span key={i}>{link(p)}</span>
      : "todo" in p ? <Todo key={i}>{p.todo}</Todo>
      : <a key={i} href={p.href}>{p.label}</a>,
    );

  return (
    <>
      <div className={s.threads} role="group" aria-label={columns.thread}>
        <span className={s.label}>{columns.thread}</span>
        {threads.map((t) => (
          <button
            key={t}
            type="button"
            className={s.threadButton}
            aria-pressed={thread === t}
            onClick={() => setThread(thread === t ? null : t)}
          >
            {t}
          </button>
        ))}
      </div>

      {terms.map((t) => {
        const faded = thread !== null && !t.threads?.includes(thread);
        return (
          <details key={t.term} open className={`${s.term} ${faded ? s.faded : ""}`}>
            <summary>
              <span className={s.termHead}>
                <span className={s.heading}>{t.term}</span>
                {t.thread && <span className={s.label}>{show(t.thread)}</span>}
              </span>
              {t.made && <span className={s.termMade}>{show(t.made)}</span>}
            </summary>
            <dl className={s.fields}>
              {t.courses && <><dt className={s.label}>{columns.courses}</dt><dd>{t.courses}</dd></>}
              {t.also && <><dt className={s.label}>{columns.also}</dt><dd>{show(t.also)}</dd></>}
            </dl>
          </details>
        );
      })}
    </>
  );
}
