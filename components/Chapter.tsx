import Link from "next/link";
import { contents, person } from "@/content/home";
import s from "./chapter.module.css";

const number = (i: number) => String(i + 1).padStart(2, "0");

// The frame every subpage shares: a running head that leads back to Home,
// the chapter number and title, and the contents again at the foot as a strip
// of the Home page's grid, with this chapter's square left out.
// `wide` lets the page use the full width instead of the reading column.
export function Chapter({ href, wide, children }: { href: string; wide?: boolean; children: React.ReactNode }) {
  const index = contents.findIndex((c) => c.href === href);
  const title = contents[index].title;
  return (
    <div className={s.page}>
      <header className={s.runningHead}>
        <Link href="/">{person.name}</Link>
        <span>{title}</span>
      </header>
      <main>
        <div className={s.opening}>
          <p className={s.numeral} aria-hidden="true">{number(index)}</p>
          <h1 className={s.title}>{title}</h1>
        </div>
        <div className={wide ? undefined : s.column}>{children}</div>
      </main>
      <nav className={s.foot} aria-label="Pages">
        <ol>
          {contents.map((c, i) => (
            <li key={c.href}>
              {c.href === href
                ? <span aria-current="page"><span className={s.footNumeral} aria-hidden="true">{number(i)}</span>{c.title}</span>
                : <Link href={c.href}><span className={s.footNumeral} aria-hidden="true">{number(i)}</span>{c.title}</Link>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
