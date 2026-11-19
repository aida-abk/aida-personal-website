import { Chapter } from "@/components/Chapter";
import { AuthorIndex } from "@/components/AuthorIndex";
import { Written } from "@/components/Written";
import s from "@/components/chapter.module.css";
import { type Book, nowReading, read2026, wouldReread } from "@/content/reading";

export const metadata = { title: "Reading" };

function Books({ id, heading, books }: { id: string; heading: string; books: Book[] }) {
  return (
    <section className={s.section} aria-labelledby={id}>
      <h2 id={id} className={s.label}>{heading}</h2>
      <ul className={s.books}>
        {books.map((b) => <li key={b.title}><i>{b.title}</i>, {b.author}</li>)}
      </ul>
    </section>
  );
}

export default function Reading() {
  return (
    <Chapter href="/reading/">
      <Books id="now" heading="Now reading" books={nowReading} />
      <Books id="y2026" heading="Read in 2026" books={read2026} />
      <Books id="reread" heading="Books I would reread" books={wouldReread} />
      <section className={s.section} aria-labelledby="log">
        <h2 id="log" className={s.label}>Full log</h2>
        <p className={s.key}><span className={s.reread}>Books I would reread</span></p>
        <Written />
        <AuthorIndex />
      </section>
    </Chapter>
  );
}
