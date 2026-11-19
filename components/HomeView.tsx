import Link from "next/link";
import { AtlasPlate } from "@/components/AtlasPlate";
import { Trace } from "@/components/Stream";
import { Todo } from "@/components/Todo";
import { background, contents, links, person, today } from "@/content/home";
import s from "@/app/home.module.css";

// Splits a paragraph around the words that carry a link, to a page of this
// site or to another site.
function withLink(text: string, words: string | undefined, href: string) {
  if (!words || !text.includes(words)) return text;
  const [before, after] = text.split(words);
  const link = href.startsWith("/") ? <Link href={href}>{words}</Link> : <a href={href}>{words}</a>;
  return <>{before}{link}{after}</>;
}

// The Home page. The name and headline, then the contents as a Hermann grid:
// black squares on white lines, one square per chapter, with the brain atlas
// plate as the largest square. Below it, Today and Background on a light
// panel, then the Stream of Thoughts as notes along a line.
export function HomeView() {
  return (
    <div className={s.page}>
      <header className={s.top}>
        <h1 className={s.name}>{person.name}</h1>
        <p className={s.aside}>{person.aside}</p>
        <p className={s.line}>{person.line}</p>
        <p className={s.headline}>{person.headline}</p>
      </header>

      <main>
        <nav className={s.grid} aria-label="Pages">
          <div className={s.plate}><AtlasPlate /></div>
          <ol>
            {contents.map((c, i) => (
              <li key={c.href} className={c.under && c.under.length > 1 ? s.wide : undefined}>
                <Link href={c.href}>
                  <span className={s.no}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.chapter}>{c.title}</span>
                  {c.under && (
                    <span className={s.under}>
                      {c.under.map((u) => <span key={u.lead}>{u.lead}{u.rest}</span>)}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li className={s.links}>
              {links.map((l) => (
                l.href ? <a key={l.label} href={l.href}>{l.label}</a> : <span key={l.label}>{l.label} <Todo>{l.todo}</Todo></span>
              ))}
            </li>
          </ol>
        </nav>

        <div className={s.panel}>
          <section aria-labelledby="today">
            <h2 id="today" className={s.panelHead}>Today</h2>
            <p>{withLink(today.text, today.link, today.href)}</p>
          </section>
          <section aria-labelledby="background">
            <h2 id="background" className={s.panelHead}>Background</h2>
            {background.map((p) => <p key={p.text}>{withLink(p.text, p.link, "/trajectory/")}</p>)}
          </section>
        </div>

        <div className={s.checker} aria-hidden="true" />

        <section className={s.stream} aria-labelledby="stream">
          <h2 id="stream" className={s.streamHead}><Link href="/stream/">Stream of Thoughts</Link></h2>
          <Trace />
        </section>
      </main>
    </div>
  );
}
