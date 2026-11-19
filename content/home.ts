// Home page copy, taken word for word from 01-site-content.md.
// Edit the text here; the layout reads from this file.
// A `todo` string shows as a visible TODO on the page. Do not fill by guessing.

export const person = {
  name: "Aida Abkenova",
  // A note from the Stream of Thoughts (1 Jun 2026), set under the name.
  aside: "I study the brain and sometimes use one.",
  line: "Computational Neuroscience and Applied Mathematics, Brown University, class of 2028",
  headline:
    "Working toward brain-computer interfaces: interpretable models of noisy neural signals.",
};

// The words in `link` point to `href`.
export const today = {
  text: "I lead the neuroimaging processing team in the Movement Disorders Program at Rhode Island Hospital, and I'm studying trajectory inference and statistical neuroscience at Brown.",
  link: "Movement Disorders Program",
  href: "https://neurology.med.brown.edu/clinical-divisions/movement-disorders",
};

// Two paragraphs. In the second, the words in `link` point to the Trajectory page.
export const background = [
  { text: "In high school I competed in robotics and math olympiads. I came to Brown to study neuroscience and found I liked the math as much." },
  {
    text: "Since then I have worked in a 3D perception lab, built the MRI processing pipeline for a hospital lab, and spent a summer at the Carney Institute fitting sparse dynamical models to cortical recordings. In fall 2026 these lines met at brain-computer interfaces.",
    link: "these lines",
  },
];

// The five subpages, in order. `under` lines are listed beneath the entry.
export const contents: { title: string; href: string; under?: { lead: string; rest: string }[] }[] = [
  { title: "Trajectory", href: "/trajectory/" },
  {
    title: "Projects",
    href: "/projects/",
    under: [
      { lead: "Dynamical models of cortical LFPs", rest: ": 3,000+ fitted models resolved into three equation families." },
      { lead: "Regional brain atrophy in Parkinson's disease", rest: ": AUC 0.953 on a held-out test set of 884." },
      { lead: "Hopfield Networks: Do They Need It All?", rest: ": the critical inverse temperature shifts on structured embeddings." },
    ],
  },
  {
    title: "Reading",
    href: "/reading/",
    under: [{ lead: "Now reading", rest: ": The Brain from Inside Out, György Buzsáki; Why People Die by Suicide, Thomas Joiner." }],
  },
  { title: "Why BCI", href: "/why-bci/" },
  { title: "Stream of Thoughts", href: "/stream/" },
];

export const links: { label: string; href?: string; todo?: string }[] = [
  { label: "CV (PDF)", href: "/Aida_Abkenova_CV.pdf" },
  { label: "GitHub", href: "https://github.com/aida-abk" },
  { label: "LinkedIn", href: "https://linkedin.com/in/aida-abkenova" },
  { label: "aida_abkenova@brown.edu", href: "mailto:aida_abkenova@brown.edu" },
];

