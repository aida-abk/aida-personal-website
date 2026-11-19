// Stream of Thoughts: short notes and longer essays, newest first. Edit the
// entries here. The Home page shows the notes along a line; the Stream page
// lists everything, essays included.
//
// A note:   { date: "2026-11-19", text: "The note, in full." }
//           add lang: "ru" to a note in Russian.
// An essay: { date: "...", title: "Its title", href: "/its-page/" }
//
// Dates are year-month-day, the day the note was created in Apple Notes. A
// missing date shows as a visible TODO. Do not fill one by guessing.
// A note with a `hold` line is kept here but not shown: delete that line to
// publish it. The text of the notes is from "Stream of thoughts picks.md" and
// "stream-of-thoughts.md", word for word.

export type Entry = {
  date?: string;
  title?: string;
  href?: string;
  text?: string;
  lang?: "ru";
  hold?: string;
};

const entries: Entry[] = [
  { title: "Why BCI", href: "/why-bci/" },
  { date: "2025-04-16", text: "You exist in the realm of what you have written. More writing = more alive." },
  { date: "2023-09-23", text: "I believe I do not exist as an individual entity unless I am written down in some form." },
  { date: "2023-06-07", text: "I date my biography by the ideas I come up with or encounter." },
  { date: "2024-01-04", text: "My self-esteem is directly proportional to the number of things I have read, which is healthy." },
  { date: "2024-09-08", text: "If something seems random, it just means you can't see the full picture." },
  { date: "2023-05-26", text: "Information is like bubblegum: once you've heard it enough times it loses its taste and vibrance, you get annoyed, and you can't chew it." },
  { date: "2025-08-22", text: "The important new skill of today is the ability to be on the territory of cringe. Do not fear." },
  { date: "2023-10-05", text: "There are two universal problems: creating or finding structure, and breaking existing structure. Structure is a powerful concept." },
  { date: "2023-06-24", text: "When you know things in detail, you never have the courage to label something as black and white and, for God's sake, to say it out loud. That's why it is so hard to be around politicians and businessmen." },
  { date: "2023-06-20", text: "Pretentious (or authoritarian, if you will) cultures are the complete opposite of the American \"fake it till you make it\". There it is rather \"fake it and nobody will question you\"." },
  { date: "2023-07-10", text: "Parents say it doesn't matter if you win or lose; it's how you play the game. It means the ultimate goal is to be invited to as many games as possible in the future. Hence, along with mastering the skills of the game itself, we have to learn a set of meta-skills that hold across every change in the environment. That is what constitutes morality and the definition of being a good person. Of course it varies from culture to culture, but only because a culture is a subset of the bigger game itself!" },
  { date: "2026-10-21", text: "70% of thoughts are unrealized impulses. Most of them are ambitious projects you never take up, because you only have a finite amount of time. LLMs, however, let me actually act on those impulses. The downside, socially speaking, is a looser touch with reality. It's not necessarily healthy for a human to live in a world where there is no barrier between a thought and the final product." },
  { date: "2026-11-15", text: "I am generally a skeptic when it comes to linear progress and a huge proponent of non-linear change in the social domain. However, you can't deny that the necessary condition for this non-linearity is a big collective conviction that there is a linear degradation worth fighting." },
  { date: "2023-04-19", text: "The less you have, the more truth you are going to hear, because there is no barrier or backup to shield you." },
  { date: "2023-07-10", text: "Part of the reason you are alive is that you are dying all the time, on both the physical and the mental level." },
  { date: "2023-05-23", text: "Is there such a thing as \"too stupid to even question\"?" },
  { date: "2025-01-18", text: "Humor is HUGELY under-researched." },
  { date: "2025-03-11", text: "Today I discovered Marvin Minsky." },
  { date: "2023-02-03", lang: "ru", text: "Если цель оправдывает средства, то средства характеризуют цель." },
  { date: "2023-05-23", lang: "ru", text: "Мы недостаточно бедны, чтобы нас любить, и недостаточно богаты, чтобы нам доверять." },
  { date: "2024-02-23", lang: "ru", text: "Ненавижу плацкарт. К концу поездки невольно чувствуешь, что вы семья." },
  { date: "2023-05-30", lang: "ru", text: "Утро — момент, когда птицы беспрепятственно сплетничают, пока сын Божий пытается найти силы покинуть обливионы сна." },
  { date: "2023-04-25", lang: "ru", text: "Эволюция = джаз." },
  { date: "2023-04-07", lang: "ru", text: "Красота — в оркестре, в сочетании, в интерсекции, в конфликтующем дзене, в паттерне." },
  { date: "2023-07-04", lang: "ru", text: "Победители думают, что до этого они всё делали правильно." },
  { date: "2024-06-30", lang: "ru", text: "Самое большое неудобство ИИ — неумение задавать вопросы." },
  { date: "2023-04-02", lang: "ru", text: "Самый гениальный диджитал-продукт Apple — Preview." },
  { date: "2023-04-25", lang: "ru", text: "Сегодня легитимная теория — та, которая получила финансирование." },
  { date: "2023-05-25", lang: "ru", text: "Слушать красивую музыку под неприятные крики — то же, что есть еду под неприятный запах. Интерпретация кардинально меняется." },
  { date: "2023-02-13", lang: "ru", text: "Самое страшное для истинного учёного — произнести слово «никогда». Но без него не достучаться до умов народа." },
  { date: "2023-01-20", lang: "ru", text: "За что я обожаю советские пособия, так это за высокомерность выражений и высокопарность терминов. Американские книги пишут максимально просто и доходчиво, приведут 865494 аналогии, чтобы ты точно запомнил; советское наследие делает науку эксклюзивной." },
  { date: "2023-01-26", lang: "ru", text: "Мой мозг — как собор Марселя Пруста из «В поисках утраченного времени», как ковёр, переплетённый из пространства и времени. Одно не важнее другого. Где-то узор чёткий и не потерял характерных оттенков; где-то, в силу времени или пренебрежения мастера, появились разводы, выцвела былая краска и всё накрыло одеялом катышков. Поэтому вы можете с равной вероятностью услышать от меня вопросы про Гермиону Грейнджер и про причины обречённости банановых республик. Поэтому мне сложно понять, что важно в моменте. Поэтому я одинаково хороша и одинаково бездарна во всех сферах: математика, литература, физика, химия, биология, информатика, пение, спорт, коньки и лыжи, готовка и уборка, мода и свобода, правда или ложь." },
  // Second batch, notes 41 to 95.
  { date: "2023-03-03", text: "Be a friend of what you don't know." },
  { date: "2023-06-20", text: "Being in a small world, I still felt I was part of something profoundly big and magnificent." },
  { date: "2023-02-28", text: "Errors should have degrees." },
  { date: "2023-04-06", text: "Expose yourself to different ideas; being obvious in your decisions afterwards would be a betrayal of yourself." },
  { date: "2023-07-20", text: "Gratitude does not just fall upon you; it is a practice." },
  { date: "2023-06-08", text: "I know that science can solve everything. I know that science can't solve everything." },
  { date: "2023-04-08", text: "Medicine, and any biology for that matter, is contextual." },
  { date: "2023-05-25", text: "My biggest fear is to be in a world, a society, whatever, where everyone is perverted to the degree that I can no longer tell the difference between truth and a lie." },
  { date: "2023-06-20", text: "Organisms are energy-transforming organizations that, after a certain degree of entropy, cannot perform critically important functions." },
  { date: "2023-09-23", text: "Power is contextual." },
  { date: "2023-01-26", text: "Repetition. Recognition. Intuition." },
  { date: "2023-04-12", text: "Scientific writing should be creative and engaging, not repellent!" },
  { date: "2026-04-13", text: "The Wizard of Oz = understanding America." },
  { date: "2023-04-16", text: "The best way to empower someone is to give them knowledge that will assist them in the future and open the way to new horizons." },
  { date: "2023-08-15", text: "The concept I am fascinated by every time is phenomenology." },
  { date: "2022-12-22", text: "The culture of capturing information and knowledge is not spreading as it could." },
  { date: "2025-04-17", text: "I want to understand what I'm \"eating\" more (informational diet)." },
  { date: "2023-09-07", text: "For people in the US and Europe it is sometimes hard to understand what a privilege it is to study what you love, as the free market is still arbitrary in former Soviet countries. People with power are not interested in open competition and can artificially create obstacles to the development of one sphere, or subsidize the fields they are most interested in (petroleum). The last is usually a good thing, though." },
  { date: "2026-04-07", text: "What Brown has taught me so far: surprisingly, and I'm not sure what exactly explains it, the overall Christian spirit of the US or specifically the people at Brown, I learned to build my life, or at least to try building it, around serving others." },
  { date: "2024-12-08", text: "So much garbage information is overriding my decision-making." },
  { date: "2025-05-24", text: "Understand computers. Learn how to write." },
  { date: "2023-09-15", lang: "ru", text: "Быть собой на пользу другим — вместо того чтобы жертвовать собой на пользу другим." },
  { date: "2023-03-25", lang: "ru", text: "Важно ли ощущать свою субъектность?" },
  { date: "2023-09-10", lang: "ru", text: "Голодный человек совершает ошибки." },
  { date: "2023-04-11", lang: "ru", text: "Не передать чувство радости, которое приносят графики." },
  { date: "2023-03-07", lang: "ru", text: "Неочевидные факты = удовольствие." },
  { date: "2023-10-01", lang: "ru", text: "Почему электронные книги забываются, в отличие от бумажных?" },
  { date: "2026-05-08", lang: "ru", text: "Поэзия — дело молодых." },
  { date: "2023-01-26", lang: "ru", text: "Появление мысли — получение новой субстанции. Мыслительная деятельность — переливание «жидкостей ума»." },
  { date: "2023-05-18", lang: "ru", text: "Синтез — самое важное для ощущения удовлетворённости." },
  { date: "2022-12-21", lang: "ru", text: "Система не способна адаптироваться. Решение, которое было принято один раз, не берёт во внимание изменившиеся обстоятельства; в результате приходится выполнять много бессмысленных обязательств. Одновременно непослушание грозит лишением всякого уважения и одобрения." },
  { date: "2023-08-16", lang: "ru", text: "Сомневаться: скорее поверю, что все вокруг сошли с ума, чем предположу, что это я ошибаюсь." },
  { date: "2023-04-01", lang: "ru", text: "Трагедия — возможность узнать новое." },
  { date: "2023-03-17", lang: "ru", text: "Низкая саморефлексия как никогда спасает в моменты острой несправедливости." },
  { date: "2023-04-24", lang: "ru", text: "Нехватка «коллективного разума», сплачивающих мероприятий и так далее непосредственно влияет на утечку мозгов. Ведь с класса всё и начинается. Именно в этом заключается успех КТЛ. Братство — основа, на которой держится идея прохождения пути отрочества через совместную победу над трудностями взросления. Индивидуализм заставляет терять миллионы." },
  // Third batch, from "stream-of-thoughts.md".
  { date: "2026-11-11", text: "The ever-present fear of starting a blog. What is a blog, and why do so many people who have something to say never end up starting one?" },
  { date: "2026-11-11", text: "The moon illusion. What is the difference between the horizon and the zenith?" },
  { date: "2026-11-11", text: "The fundamental trade-off between temporal and spatial resolution." },
  { date: "2026-11-11", text: "Taking classes as a personality. What defines a person's self-worth, and why is its locus fixed externally for some people?" },
  { date: "2026-11-01", text: "The dimensions of friendship: loyalty, IQ, values, globalness (?), conscientiousness." },
  { date: "2026-10-09", text: "Oh, the gods of self-rising flour! Oh, the velvety crushed tomatoes. And of course the cheese, the encapsulation of American fast food. I dare you to name one staple that does not involve a fermented piece of aged milk! But I digress… Together, these are what brings people together, provides emotional comfort, and persisted even through the Depression. Otherwise known as pizza." },
  { date: "2026-10-09", text: "Pizzanomics is an adjacent field that studies how individuals, businesses, governments and societies allocate the scarce resource of pizza slices among unlimited wants and needs." },
  { date: "2025-12-05", text: "What defines the Karamazov nature? With such extremes in the three brothers, can we say the truth is in the middle, or does the author lean toward one point of view? And what did the Grand Inquisitor get right, or wrong?" },
  { date: "2025-11-14", text: "Review of Ella's sandwich (tuna and kimchi). I made the famous Ella's sandwich, thinking it would be a harmless little lunch. You know, something mild, polite, maybe whispering \"protein\" in the background. Instead, this thing yelled at me. First bite: tuna said, \"Hey.\" Second bite: cheese said, \"I'm melting, babe.\" Third bite: kimchi kicked the door down like, \"SURPRISE, IT'S FERMENTATION TIME.\" The tomato tried to keep the peace, the arugula attempted to be classy, and somewhere in the middle of all that chaos I realized… I liked it. I really liked it. It tasted like someone accidentally invented fusion cuisine during a nervous breakdown, and somehow nailed it. 10/10." },
  { date: "2025-06-28", text: "The limitation imposed by speech and hand movements, typing included, hinders the cognitive power we can use and generate." },
  { date: "2025-05-09", lang: "ru", text: "9 Мая в государственном календаре Казахстана называется «Днём Победы». Спрашивается: победы над чем? Мне понятно, какой смысл это имеет для поколения моей бабушки. Смысл празднований «победы» в том, чтобы дать моральную правоту и небессмысленность таким серьёзным потерям. На поколение или два национальные трагедии слишком личные, чтобы их трогать. Но следующие поколения переосмысляют их, исследуют и восстанавливают более ясную картину, потому что сама война уже не несёт личной травмы." },
  { date: "2024-02-15", text: "We are at the rise of apocalyptic thinking, since the level of the abnormal is so low and awareness is so high. Its features: truth doesn't matter, money doesn't matter, a huge distrust of institutions, and uniformity across all economic and social classes: the poor, the middle class and the rich." },
  { date: "2024-01-10", lang: "ru", text: "Шанс сказать что-то революционное — почти 0. Шанс сказать что-то новое — 1%. Но я скажу то, что хочу сказать." },
  { date: "2024-01-06", lang: "ru", text: "Информационное пространство и его бедность: язык, интернет, непопулярный научпоп, национальный вопрос, доминирование английского. Язык как преграда к образованию. Язык как невольный механизм отдаления от национальных ценностей." },
  { date: "2023-04-09", text: "Over time a vague picture becomes clear, and then… Stage 1: opaqueness (birth). Stage 2: things are clear enough to orient on your own, though not without help (childhood). Stage 3: things are clear in spots, but most of the picture is vague, and the dissonance makes you miserable rather than happy. If you are lucky enough to hold on to one spot and make it clearer each day, you are a happy one, because by exploring it in depth the whole picture sooner or later clarifies (adolescence). Stage 4: you either accept this patchwork peace or make it the purpose of your life to clear as much as possible; most of us prefer to go deep in one spot (adulthood). Stage 5: seeing the picture for so long creates a cognitive distortion of clarity. The blur matters less, as you understand that its impact on your life, your happiness and your love is insignificant compared with the moral and intellectual anger it raises (old age). Stage 6: darkness (death)." },
  { date: "2023-01-30", text: "Art made the eye doctors better." },
  { date: "2023-01-05", lang: "ru", text: "В городе, о котором не упоминает ни один фильм, не напишет ни одна книга, который не нарисует ни один художник, в городе, где самый яркий цвет здания — серо-малиновый, где всё удобно параллельно, сурово холодно и успокаивающе неинтересно, тоже бывают события. Январские." },
  { date: "2022-06-18", lang: "ru", text: "В фотографии есть две неправды. Первая — само наличие фотографа: он снимает не жизнь, а реакцию жизни на себя. Вторая — кадрирование: фотограф делит жизнь на две части: то, что попало в рамку, и то, что осталось за ней." },
  { date: "2022-02-06", lang: "ru", text: "Время — удивительная штука. Во всех смыслах. Физики не могут объяснить его сущность в нашем измерении, философы — дать ему ценность и место, поэты горюют над бременем, которое оно на нас возлагает, а честной народ не понимает, куда оно бежит. Мы приписываем ему исключительно человеческие качества: называем жестоким и беспощадным в моменты горя, но когда горе у другого, убеждаем его, что время залечит. Не ждёт Земля дождя. Ждут только люди." },
];

// Shown entries, newest first; entries without a date come last.
export const stream = entries
  .filter((e) => !e.hold)
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
