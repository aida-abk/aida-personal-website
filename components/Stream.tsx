import Link from "next/link";
import { stream } from "@/content/stream";
import { Todo } from "./Todo";
import s from "./stream.module.css";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2025-08-22" as "22 Aug 2025".
const day = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

// A longer note gets more of the line.
const width = (text: string) => (text.length > 500 ? s.w4 : text.length > 260 ? s.w3 : text.length > 110 ? s.w2 : s.w1);

// The notes along one line, like samples along a trace: newest at the left,
// alternately above and below the line, each with its date on a tick. The
// strip scrolls sideways. Essays are not on it; they are in StreamList.
export function Trace() {
  const notes = stream.filter((e) => e.text);
  return (
    <div className={s.scroll} tabIndex={0} role="group" aria-label="Notes in order of date, newest first">
      <ol className={s.trace}>
        {notes.map((n, i) => (
          <li key={i} className={`${width(n.text!)} ${i % 2 ? s.below : s.above}`}>
            <p lang={n.lang}>{n.text}</p>
            <span className={s.tick}>{n.date ? <time dateTime={n.date}>{day(n.date)}</time> : <Todo>date</Todo>}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Every note and essay as a reading column, newest first: a note in full, an
// essay as its title leading to its own page.
export function StreamList() {
  return (
    <ol className={s.list}>
      {stream.map((e, i) => (
        <li key={i}>
          <span className={s.date}>{e.date ? <time dateTime={e.date}>{day(e.date)}</time> : <Todo>date</Todo>}</span>
          {e.title
            ? <p className={s.title}>{e.href ? <Link href={e.href}>{e.title}</Link> : e.title}</p>
            : <p lang={e.lang}>{e.text}</p>}
        </li>
      ))}
    </ol>
  );
}
