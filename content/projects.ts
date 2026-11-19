import type { Part } from "@/components/Parts";

// From the Projects section of 01-site-content.md.
// The fields a project can carry, in the order they sit around the map.
// To add a concept: add it here, then add it to the "fields" of each project
// that belongs to it.
export const fields = [
  "statistics and decision-making", // top of the map
  "dynamical systems",
  "neural signals",
  "perception",
  "software",
  "neuroimaging",
  "machine learning",
];

export type Flagship = {
  title: string;
  // The one quantity that leads the project, and the words that name it.
  lead: { big: string; label: string };
  where: string;
  fields: string;
  question: string;
  did: string[];
  result?: string;
  shownAt?: string;
  figure: Part[];
  image?: { src: string; width: number; height: number; alt: string; caption?: string; href?: string };
  linksLabel: "Link" | "Links";
  links: Part[];
  before?: string; // must be cleared before the site is published
  // "models": the fitted models, drawn (components/Models.tsx).
  // "pipeline": the MRI pipeline diagram (public/figures/mri-pipeline-*.svg).
  drawing?: "models" | "pipeline";
};

export const flagships: Flagship[] = [
  {
    title: "Dynamical models of cortical local field potentials",
    lead: { big: "3,000+ → 3", label: "fitted models → equation families" },
    drawing: "models",
    where: "Carney Institute for Brain Science, Brown. Quantitative Scholar, June to August 2026. Advisors: Dr. Theresa Desrochers, Dr. Jason Ritt.",
    fields: "neural signals, dynamical systems, machine learning",
    question: "SINDy recovers governing equations from data, but it had been validated on low-dimensional, mostly deterministic systems. Does it work on high-dimensional, noisy cortical recordings?",
    did: [
      "Built the pipeline end to end in Python: MATLAB v7.3/HDF5 ingestion, trial selection and validation, preprocessing of 500 Hz, 32-channel LFP (about 1,550 trials per channel; per-trial z-scoring, linear detrending, 4th-order zero-phase Butterworth filtering, downsampling, Savitzky-Golay derivative smoothing), time-delay (Takens) embedding, PySINDy fitting, forward ODE simulation, equation export.",
      "Ran a 3,000+ configuration sweep over library degree, delay count, STLSQ threshold, low-pass cutoff and L2 regularization as parallel SLURM array jobs on Brown's Oscar cluster, with automated merge and validation stages.",
      "Wrote a validation battery: power-spectral similarity, autocorrelation, KS statistic, amplitude ratio, Jacobian eigenvalue diagnostics.",
      "Built and deployed a web app for comparing fitted equations, simulated trajectories and validation metrics across configurations.",
    ],
    result: "The 3,000+ fitted models resolved into three equation families. One family has stable short-horizon dynamics.",
    shownAt: "Brown Undergraduate Summer Research Symposium, August 2026, as a poster and a talk. Poster title: \"Seeking Dynamical Models of Cortical Local Field Potentials via Machine Learning.\"",
    // Figure, alt text and caption are taken from the project's README.
    image: {
      src: "/figures/lfp-sindy-8-delays.png", width: 1760, height: 720,
      alt: "Simulation that sustains oscillation",
      caption: "Grey is the raw recording, blue the low-pass filtered signal, and dashed orange the free-running simulation from the trial's initial state.",
    },
    figure: [{ label: "Poster (PDF)", href: "https://github.com/aida-abk/lfp-symreg/blob/main/docs/poster.pdf" }],
    linksLabel: "Links",
    links: [{ label: "github.com/aida-abk/lfp-symreg", href: "https://github.com/aida-abk/lfp-symreg" }, " ", { label: "main.lfp-sweeps.pages.dev", href: "https://main.lfp-sweeps.pages.dev/" }],
  },
  {
    title: "Detecting regional brain atrophy as a biomarker for Parkinson's disease",
    lead: { big: "0.953", label: "AUC" },
    where: "NEUR 0680 (Computational Neuroscience), spring 2026",
    fields: "neuroimaging, machine learning",
    question: "Can morphometric measures from structural MRI alone separate Parkinson's patients from controls?",
    did: [
      "Processed and harmonized a 3,045-subject multi-site dataset (PPMI, OASIS-3, Alhusaini Lab) with FreeSurfer on Brown HPC, extracting 64 morphometric measures per subject.",
      "Trained a TabularTransformer classifier.",
    ],
    result: "AUC = 0.953 on a held-out test set (N = 884), 17 AUC points above prior FreeSurfer-based approaches.",
    image: {
      src: "/figures/parkinsons-poster.jpg", width: 1600, height: 1371,
      alt: "Poster: Detecting Regional Brain Atrophy as a Biomarker for Parkinson's Disease using Structural MRI",
      href: "/figures/parkinsons-poster.pdf",
    },
    figure: [{ label: "Poster (PDF)", href: "/figures/parkinsons-poster.pdf" }],
    linksLabel: "Link",
    links: [{ label: "github.com/aida-abk/neur680-final-project", href: "https://github.com/aida-abk/neur680-final-project" }],
  },
  {
    title: "Hopfield Networks: Do They Need It All?",
    lead: { big: "0.5 → 1.0", label: "critical inverse temperature β*" },
    where: "CSCI 1470 (Deep Learning), spring 2026",
    fields: "machine learning",
    question: "Do three core claims of Ramsauer et al. (2021) hold on MNIST, CIFAR-10 and Fashion-MNIST?",
    did: [
      "Reimplemented modern Hopfield networks from scratch in PyTorch.",
      "Ran a controlled attention-swap experiment comparing Hopfield retrieval with standard attention in few-shot classification.",
    ],
    result: "The critical inverse temperature β* shifts from about 0.5 to about 1.0 on structured embeddings, which the original paper does not report. This suggests the default Transformer scaling factor may be suboptimal for correlated key spaces. The Hopfield advantage in few-shot classification is task-dependent.",
    image: {
      src: "/figures/hopfield-poster.jpg", width: 1600, height: 1155,
      alt: "Poster: Hopfield Networks: Do They Need It All?",
      href: "/figures/hopfield-poster.pdf",
    },
    figure: [{ label: "Poster (PDF)", href: "/figures/hopfield-poster.pdf" }],
    linksLabel: "Link",
    links: [{ label: "github.com/aida-abk/cs1470-final-project", href: "https://github.com/aida-abk/cs1470-final-project" }],
  },
  {
    title: "Structural MRI pipeline and subject-ID portal",
    lead: { big: "~100", label: "subjects" },
    where: "Movement Disorders Program, Rhode Island Hospital and Warren Alpert Medical School. Research Assistant from January 2025, Neuroprocessing Team Lead since October 2025. PI: Dr. Saud Alhusaini.",
    fields: "neuroimaging, software",
    question: "How does a new lab staffed mostly by rotating undergraduates process about 100 subjects without labeling errors?",
    did: [
      "Rebuilt the structural MRI workflow from single-subject to batch submission, with an automated stage verifying FreeSurfer recon-all completion.",
      "Built a subject-ID portal (Google Apps Script and JavaScript, linking XNAT with Google Sheets) that generates compliant IDs and flags database missingness for a 15+ person recruiting and scanning team.",
      "Wrote onboarding protocols, training materials and a lab-wide MRI scanning protocol. Trained 4 lab members. Lead a 5-person team.",
      "Coordinate the lab's ENIGMA Consortium work on Parkinson's disease and essential tremor across 16 partner universities (Nipoppy pipelines on about 65 subjects).",
      "Set up the lab GitHub organization and built the lab website.",
    ],
    drawing: "pipeline",
    figure: [],
    linksLabel: "Link",
    links: [{ label: "github.com/brown-alhusaini-lab", href: "https://github.com/brown-alhusaini-lab" }],
  },
];

export type Card = { project: string; when: string; fields: string; line: string };

export const cards: Card[] = [
  { project: "Optimal foraging in a social domain", when: "NEUR 1660, spring 2026", fields: "statistics and decision-making", line: "Marginal Value Theorem applied to a networking event: conversation partners as patches, job offers as hidden resources. Four agents (fixed-time, ε-greedy, MVT rate-tracker, drift-diffusion) across 108 conditions at 500 simulations each. MVT beats DDM in resource-rich settings through time efficiency." },
  { project: "Trajectory inference from single-cell RNA-seq", when: "APMA Directed Reading Program, fall 2026", fields: "dynamical systems, statistics and decision-making", line: "Optimal transport and transcriptomic vector fields (Lavenant et al. 2021; Qiu et al. 2022). Final project compares PCA and UMAP embeddings of hematopoiesis data and estimates RNA velocity. Presenting December 2026." },
  { project: "Morphometric similarity networks in essential tremor", when: "Alhusaini Lab, ongoing", fields: "neuroimaging", line: "MSN analysis on a 308-region Desikan-Killiany subparcellation with 3D cortical heatmaps. Manuscript in preparation." },
  { project: "Oblique effect experiment", when: "Domini Lab, 2025", fields: "perception, software", line: "PsychoPy and Flutter mobile pipeline synchronized through Firebase RTDB. Also a MATLAB routine for optimal staircase increment sizes." },
  { project: "Desert-ant path integration", when: "CLPS 1500, spring 2025", fields: "perception", line: "Agent-based Python model of homing by stride integration, reproducing the stilts-and-stumps overshoot and its recalibration." },
  { project: "Hodgkin-Huxley", when: "APMA 0350, winter 2026", fields: "dynamical systems, neural signals", line: "A written walk through the four coupled ODEs behind the action potential." },
];
