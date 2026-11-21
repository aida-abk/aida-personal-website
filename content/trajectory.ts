import type { Part } from "@/components/Parts";

// One entry per term, from the Trajectory table in 01-site-content.md.
// An empty cell in the table is left out here.
export type Term = {
  term: string;
  courses?: string;
  made?: Part[];
  also?: Part[];
  thread?: Part[];
  threads?: string[]; // which of the threads this term carries
};

// The six threads, in the order they appear. Fall 2026 and Spring 2027 carry all of them.
export const threads = ["rehabilitation", "perception-action", "neuroimaging", "decision-making", "abstract sequences", "signal processing"];

export const columns = {
  courses: "Courses",
  made: "What I made",
  also: "What else I was doing",
  thread: "Thread",
};

export const terms: Term[] = [
  {
    term: "Before Brown",
    also: ["Robotics, CS and math olympiads; BeyondCurriculum organizing committee"],
    thread: ["rehabilitation"],
    threads: ["rehabilitation"],
  },
  {
    term: "Fall 2024",
    courses: "The Two Visual Systems; Calculus II; The Brain: Intro to Neuroscience; Health Care in the US",
    made: ["Paper presentations on perception versus action; calculus in neuroscience project"],
    also: ["Joined the 3D Shape Perception Lab (December)"],
    thread: ["perception-action"],
    threads: ["perception-action"],
  },
  {
    term: "Spring 2025",
    courses: "Perception and Action; Honors Statistical Inference; Linear Algebra with Theory; Principles of Neurobiology; Computing Foundations: Data",
    made: ["Desert-ant path integration model"],
    also: ["Joined the Alhusaini Lab (January); FullStack@Brown"],
    thread: ["perception-action"],
    threads: ["perception-action"],
  },
  {
    term: "Summer 2025",
    also: [
      "UTRA award in the Alhusaini Lab: clinical research (recruiting patients, collecting MRI data, learning FreeSurfer). Summer of Neurosciences Program",
    ],
    thread: ["neuroimaging"],
    threads: ["neuroimaging"],
  },
  {
    term: "Fall 2025",
    courses: "Neural Systems; Abstract Algebra; Data Structures and Algorithms; Dostoevsky",
    made: ["Paper on trauma and theodicy in The Brothers Karamazov"],
    also: ["Became Neuroprocessing Team Lead (October)"],
    thread: ["neuroimaging"],
    threads: ["neuroimaging"],
  },
  {
    term: "Winter 2026",
    courses: "Applied ODEs",
    made: ["Hodgkin-Huxley report"],
  },
  {
    term: "Spring 2026",
    courses: "Deep Learning; Computational Neuroscience; Neural Computation in Learning and Decision Making; Principles of Economics",
    made: ["Hopfield networks; Parkinson's classifier; social foraging"],
    also: ["TA for CSCI 0111 (from January); President of the Computational Neuroscience DUG (from April)"],
    thread: ["decision-making"],
    threads: ["decision-making"],
  },
  {
    term: "Summer 2026",
    made: ["SINDy on cortical LFPs"],
    also: ["Carney Quantitative Scholar"],
    thread: ["signal processing; abstract sequences"],
    threads: ["signal processing", "abstract sequences"],
  },
  {
    term: "Fall 2026",
    courses: "Statistical Neuroscience (graduate); Computational Probability and Statistics; Multivariable Calculus with Theory; Structure of the Nervous System; Genetics",
    made: ["Directed Reading Program project"],
    also: ["Joined the Radiation Physics Instrumentation Lab at Massachusetts General Hospital (October); NEMIC Health Innovator Pathways fellow; leading the Computational Neuroscience Departmental Undergraduate Group; MAPS peer mentor; attended NYBCI 2026"],
    thread: ["converges on BCI"],
    threads: threads,
  },
  {
    term: "Spring 2027",
    also: ["Joining the Asaad Lab to study how microperturbations delivered through electrodes map to behavior; launching Brown Neurotech"],
    thread: ["BCI"],
    threads: threads,
  },
];
