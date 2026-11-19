import { log, rereadTitles, type LogBook } from "@/content/reading";
import s from "./chapter.module.css";

// The full log set as the index at the back of a book: authors in
// alphabetical order, each followed by the titles read.
export function AuthorIndex() {
  const authors = new Map<string, LogBook[]>();
  for (const b of log) authors.set(b.index, [...(authors.get(b.index) ?? []), b]);
  const sorted = [...authors.entries()].sort(([a], [b]) => a.localeCompare(b, "en", { sensitivity: "base" }));

  const letters = new Map<string, typeof sorted>();
  for (const entry of sorted) {
    const letter = entry[0][0].toUpperCase();
    letters.set(letter, [...(letters.get(letter) ?? []), entry]);
  }

  return (
    <div className={s.index}>
      {[...letters.entries()].map(([letter, entries]) => (
        <section key={letter} className={s.indexLetter}>
          <h3>{letter}</h3>
          <ul>
            {entries.map(([name, books]) => (
              <li key={name}>
                {name}:{" "}
                {books.map((b, i) => (
                  <span key={b.title}>
                    {i > 0 && "; "}
                    <i className={rereadTitles.has(b.title) ? s.reread : undefined}>{b.original ?? b.title}</i>
                    {b.original && <> ({b.title})</>}
                    {b.note && <> ({b.note})</>}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
