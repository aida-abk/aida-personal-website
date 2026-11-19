import { Todo } from "./Todo";

// A run of copy that may contain visible TODOs or links between plain text.
export type Part = string | { todo: string } | { label: string; href: string };

export function Parts({ parts }: { parts: Part[] }) {
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === "string") return <span key={i}>{p}</span>;
        if ("todo" in p) return <Todo key={i}>{p.todo}</Todo>;
        return <a key={i} href={p.href}>{p.label}</a>;
      })}
    </>
  );
}
