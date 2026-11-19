import { readFileSync } from "node:fs";
import path from "node:path";
import { Chapter } from "@/components/Chapter";
import { ProjectsView } from "@/components/ProjectsView";

export const metadata = { title: "Projects" };

// Aida's MRI pipeline diagram, read from public/figures when the site is
// built and set into the page itself so that it takes the site's typefaces.
// It comes in two layouts: wide for a desktop column, narrow for a phone.
// The files' embedded provenance record is left out of the page; `mark`
// renames the ids of one copy so the two can sit in the same page.
const diagram = (name: string, mark: string) =>
  readFileSync(path.join(process.cwd(), "public/figures", name), "utf8")
    .replace(/<metadata>[\s\S]*?<\/metadata>/, "")
    .replace(/ (width|height)="\d+"/g, "")
    .replace(/id="([^"]+)"/g, `id="${mark}$1"`)
    .replace(/url\(#/g, `url(#${mark}`)
    .replace(/aria-labelledby="([^"]+)"/, (_, ids: string) => `aria-labelledby="${ids.split(" ").map((i) => mark + i).join(" ")}"`);

export default function Projects() {
  return (
    <Chapter href="/projects/">
      <ProjectsView pipeline={{ wide: diagram("mri-pipeline-wide.svg", "w-"), narrow: diagram("mri-pipeline-narrow.svg", "n-") }} />
    </Chapter>
  );
}
