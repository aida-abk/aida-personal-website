import { Chapter } from "@/components/Chapter";
import { makeLinker } from "@/components/Linked";
import s from "@/components/chapter.module.css";
import { whyBciRefs } from "@/content/references";
import { essay } from "@/content/whyBci";

export const metadata = { title: "Why BCI" };

export default function WhyBci() {
  const link = makeLinker(whyBciRefs);
  return (
    <Chapter href="/why-bci/">
      <article className={s.prose}>
        {essay.map((p) => <p key={p}>{link(p)}</p>)}
      </article>
    </Chapter>
  );
}
