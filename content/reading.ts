// From 06-reading.md.
export type Book = { title: string; author: string };

export const nowReading: Book[] = [
  { title: "The Brain from Inside Out", author: "György Buzsáki" },
  { title: "Why People Die by Suicide", author: "Thomas Joiner" },
  { title: "If Anyone Builds It, Everyone Dies", author: "Eliezer Yudkowsky & Nate Soares" },
];

export const read2026: Book[] = [
  { title: "A Mathematician's Lament", author: "Paul Lockhart" },
  { title: "Imagined Communities: Reflections on the Origin and Spread of Nationalism", author: "Benedict Anderson" },
  { title: "Chaos: Making a New Science", author: "James Gleick" },
  { title: "Surely You're Joking, Mr. Feynman!", author: "Richard Feynman" },
  { title: "A Random Walk Down Wall Street", author: "Burton Malkiel" },
  { title: "Sexual Suicide", author: "George Gilder" },
  { title: "Models of the Mind: How Physics, Engineering and Mathematics Have Shaped Our Understanding of the Brain", author: "Grace W. Lindsay" },
];

export const wouldReread: Book[] = [
  { title: "The Trouble with Testosterone", author: "Robert Sapolsky" },
  { title: "All Quiet on the Western Front", author: "Erich Maria Remarque" },
  { title: "The House with the Mezzanine", author: "Anton Chekhov" },
  { title: "Clean Monday", author: "Ivan Bunin" },
  { title: "The Captain's Daughter", author: "Alexander Pushkin" },
  { title: "Dubrovsky", author: "Alexander Pushkin" },
  { title: "The Pedagogical Poem", author: "Anton Makarenko" },
  { title: "From Atom to Tree (От атома к дереву)", author: "Sergey Yastrebov" },
  { title: "Whatever You Think, Think the Opposite", author: "Paul Arden" },
];

// The full log. Each book: title, author, the year it was first published
// (null when unknown; negative for BC) and the year Aida read it.
// `original` is the title in the language Aida read it in, when not English.
// The publication years were filled in by Claude and need Aida's check.
export type LogBook = {
  title: string;
  author: string; // as printed: "Fyodor Dostoevsky"
  index: string;  // as sorted in the index: "Dostoevsky, Fyodor"
  written: number | null;
  read: string;
  note?: string;
  original?: string;
};

const A = {
  lockhart: ["Paul Lockhart", "Lockhart, Paul"],
  anderson: ["Benedict Anderson", "Anderson, Benedict"],
  gleick: ["James Gleick", "Gleick, James"],
  feynman: ["Richard Feynman", "Feynman, Richard"],
  malkiel: ["Burton Malkiel", "Malkiel, Burton"],
  gilder: ["George Gilder", "Gilder, George"],
  lindsay: ["Grace W. Lindsay", "Lindsay, Grace W."],
  dostoevsky: ["Fyodor Dostoevsky", "Dostoevsky, Fyodor"],
  labatut: ["Benjamín Labatut", "Labatut, Benjamín"],
  kalanithi: ["Paul Kalanithi", "Kalanithi, Paul"],
  fowles: ["John Fowles", "Fowles, John"],
  chekhov: ["Anton Chekhov", "Chekhov, Anton"],
  goodale: ["Melvyn Goodale", "Goodale, Melvyn"],
  fauci: ["Anthony Fauci", "Fauci, Anthony"],
  sacks: ["Oliver Sacks", "Sacks, Oliver"],
  berne: ["Eric Berne", "Berne, Eric"],
  bulgakov: ["Mikhail Bulgakov", "Bulgakov, Mikhail"],
  turgenev: ["Ivan Turgenev", "Turgenev, Ivan"],
  pasternak: ["Boris Pasternak", "Pasternak, Boris"],
  foer: ["Joshua Foer", "Foer, Joshua"],
  sapolsky: ["Robert Sapolsky", "Sapolsky, Robert"],
  murakami: ["Haruki Murakami", "Murakami, Haruki"],
  dovlatov: ["Sergei Dovlatov", "Dovlatov, Sergei"],
  yastrebov: ["Sergey Yastrebov", "Yastrebov, Sergey"],
  lermontov: ["Mikhail Lermontov", "Lermontov, Mikhail"],
  pelevin: ["Victor Pelevin", "Pelevin, Victor"],
  makarenko: ["Anton Makarenko", "Makarenko, Anton"],
  ostrovsky: ["Alexander Ostrovsky", "Ostrovsky, Alexander"],
  dekruif: ["Paul de Kruif", "de Kruif, Paul"],
  arden: ["Paul Arden", "Arden, Paul"],
  saltykov: ["Mikhail Saltykov-Shchedrin", "Saltykov-Shchedrin, Mikhail"],
  stevenson: ["Robert Louis Stevenson", "Stevenson, Robert Louis"],
  ilfpetrov: ["Ilf and Petrov", "Ilf and Petrov"],
  zamyatin: ["Yevgeny Zamyatin", "Zamyatin, Yevgeny"],
  wilde: ["Oscar Wilde", "Wilde, Oscar"],
  griboyedov: ["Alexander Griboyedov", "Griboyedov, Alexander"],
  austen: ["Jane Austen", "Austen, Jane"],
  nabokov: ["Vladimir Nabokov", "Nabokov, Vladimir"],
  pushkin: ["Alexander Pushkin", "Pushkin, Alexander"],
  shakespeare: ["William Shakespeare", "Shakespeare, William"],
  bunin: ["Ivan Bunin", "Bunin, Ivan"],
  king: ["Stephen King", "King, Stephen"],
  gorky: ["Maxim Gorky", "Gorky, Maxim"],
  remarque: ["Erich Maria Remarque", "Remarque, Erich Maria"],
  kuprin: ["Alexander Kuprin", "Kuprin, Alexander"],
  salinger: ["J. D. Salinger", "Salinger, J. D."],
  arsenyeva: ["Alexandra Arsenyeva", "Arsenyeva, Alexandra"],
  huxley: ["Aldous Huxley", "Huxley, Aldous"],
  plato: ["Plato", "Plato"],
  aristotle: ["Aristotle", "Aristotle"],
  suntzu: ["Sun Tzu", "Sun Tzu"],
  durrell: ["Gerald Durrell", "Durrell, Gerald"],
  tolstoy: ["Leo Tolstoy", "Tolstoy, Leo"],
  camus: ["Albert Camus", "Camus, Albert"],
  goethe: ["Johann Wolfgang von Goethe", "Goethe, Johann Wolfgang von"],
  orwell: ["George Orwell", "Orwell, George"],
  dreiser: ["Theodore Dreiser", "Dreiser, Theodore"],
  maupassant: ["Guy de Maupassant", "Maupassant, Guy de"],
  london: ["Jack London", "London, Jack"],
  adams: ["Douglas Adams", "Adams, Douglas"],
  rowling: ["J. K. Rowling", "Rowling, J. K."],
  lindgren: ["Astrid Lindgren", "Lindgren, Astrid"],
} as const;

type Row = [title: string, author: keyof typeof A, written: number | null, extra?: { note?: string; original?: string }];

const byYearRead: Record<string, Row[]> = {
  "2026": [
    ["A Mathematician's Lament", "lockhart", 2009],
    ["Imagined Communities", "anderson", 1983],
    ["Chaos: Making a New Science", "gleick", 1987],
    ["Surely You're Joking, Mr. Feynman!", "feynman", 1985],
    ["A Random Walk Down Wall Street", "malkiel", 1973],
    ["Sexual Suicide", "gilder", 1973],
    ["Models of the Mind", "lindsay", 2021],
  ],
  "2025": [
    ["The Brothers Karamazov", "dostoevsky", 1880],
    ["The Dream of a Ridiculous Man", "dostoevsky", 1877],
    ["The Gambler", "dostoevsky", 1866],
    ["Notes from Underground", "dostoevsky", 1864],
    ["A Gentle Creature", "dostoevsky", 1876],
    ["When We Cease to Understand the World", "labatut", 2020],
    ["When Breath Becomes Air", "kalanithi", 2016],
  ],
  "2024": [
    ["The Magus", "fowles", 1965],
    ["A Boring Story", "chekhov", 1889],
    ["Sight Unseen: An Exploration of Conscious and Unconscious Vision", "goodale", 2004],
    ["On Call: A Doctor's Journey in Public Service", "fauci", 2024],
  ],
  "2023": [
    ["Migraine", "sacks", 1970],
    ["Games People Play", "berne", 1964],
    ["Brain Inflammation", "bulgakov", 1926],
    ["First Love", "turgenev", 1860],
    ["Asya", "turgenev", 1858],
    ["Mumu", "turgenev", 1854],
    ["Doctor Zhivago", "pasternak", 1957],
    ["Moonwalking with Einstein", "foer", 2011],
    ["The Trouble with Testosterone", "sapolsky", 1997],
    ["Norwegian Wood", "murakami", 1987],
    ["The Foreign Woman", "dovlatov", 1986],
    ["From Atom to Tree", "yastrebov", 2018, { original: "От атома к дереву" }],
    ["A Hero of Our Time", "lermontov", 1840],
    ["Generation \"П\"", "pelevin", 1999],
    ["The Pedagogical Poem", "makarenko", 1933],
    ["Without a Dowry", "ostrovsky", 1878],
    ["The Storm", "ostrovsky", 1859],
    ["Microbe Hunters", "dekruif", 1926],
    ["Whatever You Think, Think the Opposite", "arden", 2006],
    ["The Golovlyov Family", "saltykov", 1880],
    ["The Suicide Club", "stevenson", 1878],
    ["The Collector", "fowles", 1963],
    ["The Golden Calf", "ilfpetrov", 1931],
  ],
  "2022": [
    ["We", "zamyatin", 1924],
    ["The Picture of Dorian Gray", "wilde", 1890],
    ["Woe from Wit", "griboyedov", 1825],
    ["Pride and Prejudice", "austen", 1813],
    ["Morphine", "bulgakov", 1927],
    ["Lolita", "nabokov", 1955],
    ["The Captain's Daughter", "pushkin", 1836],
    ["Hamlet", "shakespeare", 1601],
    ["Macbeth", "shakespeare", 1606],
    ["Clean Monday", "bunin", 1944],
    ["The Dead Zone", "king", 1979],
    ["Demons", "dostoevsky", 1872],
    ["Dubrovsky", "pushkin", 1841],
    ["Childhood", "gorky", 1914],
    ["All Quiet on the Western Front", "remarque", 1929],
    ["The Demon", "lermontov", 1839],
    ["The Garnet Bracelet", "kuprin", 1911],
    ["The Catcher in the Rye", "salinger", 1951],
    ["Notes of a Front-Line Nurse", "arsenyeva", null],
    ["White Nights", "dostoevsky", 1848, { note: "reread 2025" }],
    ["Brave New World", "huxley", 1932],
    ["Apology of Socrates", "plato", -399],
  ],
  "2021": [
    ["Politics", "aristotle", -350],
    ["A Young Doctor's Notebook", "bulgakov", 1926],
    ["The Art of War", "suntzu", -500],
    ["My Family and Other Animals", "durrell", 1956],
    ["Anna Karenina", "tolstoy", 1878],
    ["The Cherry Orchard", "chekhov", 1904],
    ["The Stranger", "camus", 1942],
    ["Faust", "goethe", 1808],
    ["1984", "orwell", 1949],
    ["The Financier", "dreiser", 1912],
    ["Crime and Punishment", "dostoevsky", 1866],
    ["Bel-Ami", "maupassant", 1885],
    ["Eugene Onegin", "pushkin", 1833],
    ["Collected stories", "chekhov", null],
    ["The House with the Mezzanine", "chekhov", 1896],
  ],
  "2020 and earlier": [
    ["Martin Eden", "london", 1909],
    ["The Hitchhiker's Guide to the Galaxy", "adams", 1979],
    ["Romeo and Juliet", "shakespeare", 1597],
    ["The Master and Margarita", "bulgakov", 1967],
    ["Harry Potter (all eight, including the play)", "rowling", 1997],
    ["Pippi Longstocking", "lindgren", 1945],
  ],
};

export const log: LogBook[] = Object.entries(byYearRead).flatMap(([read, rows]) =>
  rows.map(([title, a, written, extra]) => ({ title, author: A[a][0], index: A[a][1], written, read, ...extra })),
);

// Titles of the books Aida would reread, as they appear in the log.
export const rereadTitles = new Set(wouldReread.map((b) => b.title.replace(/ \(.*\)$/, "")));
