import Link from "next/link";

// Turns known phrases inside a piece of copy into links without changing the
// wording. Each phrase is linked the first time it appears on a page.
export function makeLinker(refs: Record<string, string>) {
  const seen = new Set<string>();
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return function link(text: string): React.ReactNode {
    const out: React.ReactNode[] = [];
    let rest = text;
    for (;;) {
      let best: { phrase: string; at: number } | null = null;
      for (const phrase of Object.keys(refs)) {
        if (seen.has(phrase)) continue;
        const m = new RegExp(`(?<![A-Za-z])${escape(phrase)}(?![A-Za-z])`).exec(rest);
        if (!m) continue;
        if (!best || m.index < best.at || (m.index === best.at && phrase.length > best.phrase.length)) {
          best = { phrase, at: m.index };
        }
      }
      if (!best) break;
      seen.add(best.phrase);
      const href = refs[best.phrase];
      out.push(rest.slice(0, best.at));
      out.push(
        href.startsWith("/")
          ? <Link key={out.length} href={href}>{best.phrase}</Link>
          : <a key={out.length} href={href}>{best.phrase}</a>,
      );
      rest = rest.slice(best.at + best.phrase.length);
    }
    out.push(rest);
    return <>{out}</>;
  };
}
