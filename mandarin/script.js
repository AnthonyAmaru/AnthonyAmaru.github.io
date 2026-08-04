const vocabulary = [
  // Greetings and courtesy
  ["你好", "nǐ hǎo", "hello", "Greetings"],
  ["很好", "hěn hǎo", "very good; doing well", "Greetings"],
  ["不好", "bù hǎo", "not good", "Greetings"],
  ["不错", "bù cuò", "not bad", "Greetings"],
  ["最近怎么样？", "zuìjìn zěnmeyàng?", "How have you been recently?", "Greetings"],
  ["对不起", "duìbuqǐ", "sorry", "Greetings"],
  ["不好意思", "bù hǎoyìsi", "excuse me; sorry", "Greetings"],
  ["没关系", "méi guānxi", "it is okay; no problem", "Greetings"],
  ["谢谢", "xièxie", "thank you", "Greetings"],
  ["明天见", "míngtiān jiàn", "see you tomorrow", "Greetings"],
  ["拜拜", "bāibāi", "bye-bye", "Greetings"],
  ["加油", "jiāyóu", "keep going; you can do it", "Greetings"],

  // Identity and people
  ["我", "wǒ", "I; me", "People"],
  ["你", "nǐ", "you", "People"],
  ["他", "tā", "he; him", "People"],
  ["我们", "wǒmen", "we; us", "People"],
  ["你们", "nǐmen", "you (plural)", "People"],
  ["他们", "tāmen", "they; them", "People"],
  ["人", "rén", "person; people", "People"],
  ["朋友", "péngyou", "friend", "People"],
  ["老师", "lǎoshī", "teacher", "People"],
  ["叫", "jiào", "to be called; to call", "People"],
  ["名字", "míngzi", "name", "People"],
  ["美国", "měiguó", "United States", "People"],
  ["中国", "zhōngguó", "China", "People"],
  ["加拿大", "jiānádà", "Canada", "People"],
  ["中文", "zhōngwén", "Chinese language", "People"],
  ["说", "shuō", "to say; to speak", "People"],
  ["问", "wèn", "to ask", "People"],
  ["自己", "zìjǐ", "oneself", "People"],

  // Food and drink
  ["面包", "miànbāo", "bread", "Food & drink"],
  ["饺子", "jiǎozi", "dumplings", "Food & drink"],
  ["面条", "miàntiáo", "noodles", "Food & drink"],
  ["米饭", "mǐfàn", "cooked rice", "Food & drink"],
  ["鸡肉", "jīròu", "chicken", "Food & drink"],
  ["西兰花", "xīlánhuā", "broccoli", "Food & drink"],
  ["馄饨", "húntun", "wontons", "Food & drink"],
  ["鱼", "yú", "fish", "Food & drink"],
  ["肉", "ròu", "meat", "Food & drink"],
  ["可乐", "kělè", "cola", "Food & drink"],
  ["咖啡", "kāfēi", "coffee", "Food & drink"],
  ["茶", "chá", "tea", "Food & drink"],
  ["水", "shuǐ", "water", "Food & drink"],
  ["冰水", "bīngshuǐ", "ice water", "Food & drink"],
  ["热水", "rèshuǐ", "hot water", "Food & drink"],
  ["吃", "chī", "to eat", "Food & drink"],
  ["喝", "hē", "to drink", "Food & drink"],
  ["吃饭", "chīfàn", "to eat a meal", "Food & drink"],
  ["饿", "è", "hungry", "Food & drink"],
  ["好吃", "hǎochī", "tasty; delicious", "Food & drink"],
  ["辣", "là", "spicy", "Food & drink"],
  ["披萨", "pīsà", "pizza", "Food & drink"],

  // Restaurant
  ["饭店", "fàndiàn", "restaurant", "Restaurant"],
  ["服务员", "fúwùyuán", "server; waiter", "Restaurant"],
  ["要", "yào", "to want", "Restaurant"],
  ["还要", "hái yào", "also want; want more", "Restaurant"],
  ["有", "yǒu", "to have; there is", "Restaurant"],
  ["没有", "méi yǒu", "not have; there is not", "Restaurant"],
  ["请客", "qǐngkè", "to treat someone; pay for guests", "Restaurant"],
  ["买单", "mǎidān", "to ask for or pay the bill", "Restaurant"],
  ["一共", "yígòng", "altogether; in total", "Restaurant"],
  ["打包", "dǎbāo", "to pack food to go", "Restaurant"],
  ["杯", "bēi", "cup; measure word for cups", "Restaurant"],
  ["碗", "wǎn", "bowl; measure word for bowls", "Restaurant"],
  ["块", "kuài", "informal unit for yuan", "Restaurant"],
  ["钱", "qián", "money", "Restaurant"],
  ["好的", "hǎo de", "okay; all right", "Restaurant"],
  ["多少钱？", "duōshao qián?", "How much money?", "Restaurant"],

  // Descriptions
  ["大", "dà", "big; large", "Descriptions"],
  ["小", "xiǎo", "small", "Descriptions"],
  ["热", "rè", "hot", "Descriptions"],
  ["冰", "bīng", "ice; iced", "Descriptions"],
  ["很", "hěn", "very; linking degree word", "Descriptions"],
  ["非常", "fēicháng", "extremely; very", "Descriptions"],
  ["太…了", "tài…le", "too…; extremely…", "Descriptions"],
  ["大的", "dà de", "the large one", "Descriptions"],
  ["小的", "xiǎo de", "the small one", "Descriptions"],
  ["热的", "rè de", "the hot one", "Descriptions"],
  ["冰的", "bīng de", "the iced or cold one", "Descriptions"],
  ["辣的", "là de", "the spicy one", "Descriptions"],

  // Numbers
  ["零", "líng", "zero", "Numbers"],
  ["一", "yī", "one", "Numbers"],
  ["二", "èr", "two in counting", "Numbers"],
  ["两", "liǎng", "two before most measure words", "Numbers"],
  ["三", "sān", "three", "Numbers"],
  ["四", "sì", "four", "Numbers"],
  ["五", "wǔ", "five", "Numbers"],
  ["六", "liù", "six", "Numbers"],
  ["七", "qī", "seven", "Numbers"],
  ["八", "bā", "eight", "Numbers"],
  ["九", "jiǔ", "nine", "Numbers"],
  ["十", "shí", "ten", "Numbers"],
  ["百", "bǎi", "one hundred", "Numbers"],
  ["个", "ge", "general measure word", "Numbers"],

  // Calendar and time
  ["今天", "jīntiān", "today", "Time"],
  ["昨天", "zuótiān", "yesterday", "Time"],
  ["明天", "míngtiān", "tomorrow", "Time"],
  ["星期", "xīngqī", "week", "Time"],
  ["星期一", "xīngqīyī", "Monday", "Time"],
  ["星期五", "xīngqīwǔ", "Friday", "Time"],
  ["星期日", "xīngqīrì", "Sunday", "Time"],
  ["月", "yuè", "month", "Time"],
  ["号 / 日", "hào / rì", "day of the month", "Time"],
  ["生日", "shēngrì", "birthday", "Time"],
  ["时间", "shíjiān", "time", "Time"],
  ["现在", "xiànzài", "now", "Time"],
  ["点", "diǎn", "o'clock", "Time"],
  ["分", "fēn", "minute", "Time"],
  ["刻", "kè", "quarter hour", "Time"],
  ["半", "bàn", "half", "Time"],
  ["上午", "shàngwǔ", "morning", "Time"],
  ["下午", "xiàwǔ", "afternoon", "Time"],
  ["晚上", "wǎnshang", "evening; night", "Time"],
  ["几点", "jǐ diǎn", "what time", "Time"],

  // Places and movement
  ["去", "qù", "to go", "Places"],
  ["在", "zài", "to be at; in; on", "Places"],
  ["到", "dào", "to arrive; reach", "Places"],
  ["到了", "dào le", "arrived", "Places"],
  ["哪里", "nǎlǐ", "where", "Places"],
  ["操场", "cāochǎng", "playground; athletic field", "Places"],
  ["上课", "shàngkè", "to attend or start class", "Places"],
  ["太阳", "tàiyáng", "sun", "Places"],
  ["云", "yún", "cloud", "Places"],
  ["猫", "māo", "cat", "Places"],
  ["小猫饭店", "Xiǎomāo Fàndiàn", "Little Cat Restaurant", "Places"],

  // Grammar tools
  ["是", "shì", "to be; identifies or classifies", "Grammar"],
  ["不", "bù", "not; negates habits and descriptions", "Grammar"],
  ["没 / 没有", "méi / méi yǒu", "not have; there is not", "Grammar"],
  ["吗", "ma", "yes or no question particle", "Grammar"],
  ["呢", "ne", "and…?; what about…?", "Grammar"],
  ["了", "le", "new situation or completed action", "Grammar"],
  ["的", "de", "links possession or description", "Grammar"],
  ["吧", "ba", "softens a suggestion", "Grammar"],
  ["什么", "shénme", "what", "Grammar"],
  ["怎么", "zěnme", "how; by what method", "Grammar"],
  ["怎么样", "zěnmeyàng", "how is it?; how are things?", "Grammar"],
  ["几", "jǐ", "how many; usually a small number", "Grammar"],
  ["多少", "duōshao", "how many; how much", "Grammar"],
  ["谁", "shéi", "who", "Grammar"],
];

const patternGroups = {
  "Introductions": [
    ["我叫…", "Wǒ jiào…", "My name is…"],
    ["我是美国人。", "Wǒ shì měiguó rén.", "I am American."],
    ["我不是中国人。", "Wǒ bú shì zhōngguó rén.", "I am not Chinese."],
    ["你是哪国人？", "Nǐ shì nǎ guó rén?", "What country are you from?"],
    ["你叫什么名字？", "Nǐ jiào shénme míngzi?", "What is your name?"],
    ["你呢？", "Nǐ ne?", "What about you?"],
  ],
  "Likes & food": [
    ["我喜欢饺子。", "Wǒ xǐhuan jiǎozi.", "I like dumplings."],
    ["我不喜欢面条。", "Wǒ bù xǐhuan miàntiáo.", "I do not like noodles."],
    ["你喜欢吃什么？", "Nǐ xǐhuan chī shénme?", "What do you like to eat?"],
    ["你喜欢喝什么？", "Nǐ xǐhuan hē shénme?", "What do you like to drink?"],
    ["他不喜欢吃鸡肉。", "Tā bù xǐhuan chī jīròu.", "He does not like eating chicken."],
    ["我饿了。", "Wǒ è le.", "I am hungry now."],
  ],
  "Restaurant": [
    ["我们去吃饭吧。", "Wǒmen qù chīfàn ba.", "Let's go eat."],
    ["我要一碗米饭。", "Wǒ yào yì wǎn mǐfàn.", "I want one bowl of rice."],
    ["我还要两杯冰水。", "Wǒ hái yào liǎng bēi bīngshuǐ.", "I also want two cups of ice water."],
    ["你要大的还是小的？", "Nǐ yào dà de háishi xiǎo de?", "Do you want the large one or the small one?"],
    ["一共多少钱？", "Yígòng duōshao qián?", "How much is it altogether?"],
    ["我请客。", "Wǒ qǐngkè.", "It's my treat."],
    ["我要打包。", "Wǒ yào dǎbāo.", "I want it packed to go."],
  ],
  "Time & place": [
    ["今天星期几？", "Jīntiān xīngqī jǐ?", "What day of the week is today?"],
    ["今天是几月几号？", "Jīntiān shì jǐ yuè jǐ hào?", "What is today's date?"],
    ["现在几点？", "Xiànzài jǐ diǎn?", "What time is it now?"],
    ["现在七点半。", "Xiànzài qī diǎn bàn.", "It is 7:30 now."],
    ["你在哪里？", "Nǐ zài nǎlǐ?", "Where are you?"],
    ["明天下午你有时间吗？", "Míngtiān xiàwǔ nǐ yǒu shíjiān ma?", "Do you have time tomorrow afternoon?"],
    ["你到了吗？", "Nǐ dào le ma?", "Have you arrived?"],
  ],
  "Making plans": [
    ["你明天上午有时间吗？", "Nǐ míngtiān shàngwǔ yǒu shíjiān ma?", "Do you have time tomorrow morning?"],
    ["明天上午没有。", "Míngtiān shàngwǔ méiyǒu.", "I do not have time tomorrow morning."],
    ["下午呢？", "Xiàwǔ ne?", "What about the afternoon?"],
    ["下午有时间。", "Xiàwǔ yǒu shíjiān.", "I have time in the afternoon."],
    ["我们去吃披萨吧。", "Wǒmen qù chī pīsà ba.", "Let's go eat pizza."],
    ["好的，几点？在哪里？", "Hǎo de, jǐ diǎn? Zài nǎlǐ?", "Okay. What time? Where?"],
    ["5点，在小猫饭店。", "Wǔ diǎn, zài Xiǎomāo Fàndiàn.", "At five, at Little Cat Restaurant."],
    ["明天见。", "Míngtiān jiàn.", "See you tomorrow."],
  ],
  "Possession": [
    ["这是我的面包。", "Zhè shì wǒ de miànbāo.", "This is my bread."],
    ["这杯咖啡是你的。", "Zhè bēi kāfēi shì nǐ de.", "This cup of coffee is yours."],
    ["他是我们的朋友。", "Tā shì wǒmen de péngyou.", "He is our friend."],
    ["我要辣的。", "Wǒ yào là de.", "I want the spicy one."],
  ],
};

const planDialogue = [
  ["A", "你明天上午有时间吗？", "Nǐ míngtiān shàngwǔ yǒu shíjiān ma?", "Do you have time tomorrow morning?"],
  ["B", "明天上午没有。", "Míngtiān shàngwǔ méiyǒu.", "I do not have time tomorrow morning."],
  ["A", "下午呢？", "Xiàwǔ ne?", "What about the afternoon?"],
  ["B", "下午有时间。", "Xiàwǔ yǒu shíjiān.", "I have time in the afternoon."],
  ["A", "我们去吃披萨吧。", "Wǒmen qù chī pīsà ba.", "Let's go eat pizza."],
  ["B", "好的，几点？在哪里？", "Hǎo de, jǐ diǎn? Zài nǎlǐ?", "Okay. What time? Where?"],
  ["A", "5点，在小猫饭店。", "Wǔ diǎn, zài Xiǎomāo Fàndiàn.", "At five, at Little Cat Restaurant."],
  ["B", "明天见。", "Míngtiān jiàn.", "See you tomorrow."],
];

const readings = {
  chinese: [
    "今天是7月31号，星期五。今天是我的生日。我问我的朋友小李：“你有时间吗？我们去小猫饭店吃饭吧，我请客。”",
    "11点半，我们到了饭店。今天太热了。我问服务员：“有冰水吗？”",
    "我要两杯冰水。这个饭店的鸡肉西兰花和馄饨很好吃。",
    "我吃了一碗鸡肉西兰花和一碗馄饨。小李不喜欢吃鸡肉。他饿了，吃了三碗馄饨。",
    "我去买单。服务员说：“你的中文很好。一共153块。”",
    "我说：“谢谢。我还要打包一碗面条。”",
  ],
  pinyin: [
    "Jīntiān shì qī yuè sānshíyī hào, xīngqīwǔ. Jīntiān shì wǒ de shēngrì. Wǒ wèn wǒ de péngyou Xiǎo Lǐ: “Nǐ yǒu shíjiān ma? Wǒmen qù Xiǎomāo Fàndiàn chīfàn ba, wǒ qǐngkè.”",
    "Shíyī diǎn bàn, wǒmen dào le fàndiàn. Jīntiān tài rè le. Wǒ wèn fúwùyuán: “Yǒu bīngshuǐ ma?”",
    "Wǒ yào liǎng bēi bīngshuǐ. Zhè ge fàndiàn de jīròu xīlánhuā hé húntun hěn hǎochī.",
    "Wǒ chī le yì wǎn jīròu xīlánhuā hé yì wǎn húntun. Xiǎo Lǐ bù xǐhuan chī jīròu. Tā è le, chī le sān wǎn húntun.",
    "Wǒ qù mǎidān. Fúwùyuán shuō: “Nǐ de zhōngwén hěn hǎo. Yígòng yìbǎi wǔshísān kuài.”",
    "Wǒ shuō: “Xièxie. Wǒ hái yào dǎbāo yì wǎn miàntiáo.”",
  ],
  english: [
    "Today is Friday, July 31. Today is my birthday. I ask my friend Xiao Li, “Do you have time? Let's go eat at Little Cat Restaurant. It's my treat.”",
    "At 11:30, we arrive at the restaurant. It is very hot today. I ask the server, “Do you have ice water?”",
    "I want two cups of ice water. This restaurant's chicken with broccoli and wontons are delicious.",
    "I eat one bowl of chicken with broccoli and one bowl of wontons. Xiao Li does not like chicken. He gets hungry and eats three bowls of wontons.",
    "I go to pay the bill. The server says, “Your Chinese is very good. The total is 153 yuan.”",
    "I say, “Thank you. I also want one bowl of noodles packed to go.”",
  ],
};

const characters = [
  ["我", "wǒ", "I; me"], ["你", "nǐ", "you"], ["他", "tā", "he"], ["们", "men", "plural marker"],
  ["人", "rén", "person"], ["爱", "ài", "love"], ["想", "xiǎng", "think; want"], ["不", "bù", "not"],
  ["没", "méi", "not have"], ["是", "shì", "to be"], ["有", "yǒu", "have"], ["要", "yào", "want"],
  ["吃", "chī", "eat"], ["喝", "hē", "drink"], ["说", "shuō", "speak"], ["问", "wèn", "ask"],
  ["去", "qù", "go"], ["到", "dào", "arrive"], ["在", "zài", "at"], ["叫", "jiào", "be called"],
  ["天", "tiān", "day; sky"], ["月", "yuè", "month"], ["日", "rì", "day; sun"], ["时", "shí", "time"],
  ["现", "xiàn", "present"], ["中", "zhōng", "middle; China"], ["文", "wén", "language"], ["水", "shuǐ", "water"],
  ["饭", "fàn", "rice; meal"], ["面", "miàn", "noodles; flour"], ["鸡", "jī", "chicken"], ["肉", "ròu", "meat"],
  ["鱼", "yú", "fish"], ["茶", "chá", "tea"], ["钱", "qián", "money"], ["大", "dà", "big"],
  ["小", "xiǎo", "small"], ["热", "rè", "hot"], ["好", "hǎo", "good"], ["朋", "péng", "friend"],
];

const state = {
  activeCategory: "All",
  query: "",
  showPinyin: true,
  patternGroup: Object.keys(patternGroups)[0],
  readingLayer: "chinese",
  session: [],
  sessionIndex: 0,
  known: new Set(JSON.parse(localStorage.getItem("mandarin-known") || "[]")),
};

const $ = (selector) => document.querySelector(selector);
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

function updateProgress() {
  const percent = Math.round((state.known.size / vocabulary.length) * 100);
  $("#hero-progress").textContent = `${percent}%`;
  $("#hero-progress-bar").style.width = `${percent}%`;
}

function makeSession() {
  state.session = shuffle(vocabulary).slice(0, 5);
  state.sessionIndex = 0;
  renderSession();
  renderFlashcard();
}

function renderSession() {
  const list = $("#session-list");
  list.replaceChildren();
  state.session.forEach((word, index) => {
    const item = document.createElement("li");
    if (index === state.sessionIndex) item.classList.add("active");
    if (state.known.has(word[0])) item.classList.add("known");
    const number = document.createElement("span");
    number.className = "session-number";
    number.textContent = state.known.has(word[0]) ? "✓" : index + 1;
    const label = document.createElement("span");
    label.textContent = word[0];
    item.append(number, label);
    list.append(item);
  });
}

function renderFlashcard() {
  const word = state.session[state.sessionIndex];
  if (!word) return;
  $("#flashcard").classList.remove("revealed");
  $("#flash-answer").setAttribute("aria-hidden", "true");
  $("#flash-category").textContent = word[3];
  $("#flash-position").textContent = `${state.sessionIndex + 1} / ${state.session.length}`;
  $("#flash-hanzi").textContent = word[0];
  $("#flash-pinyin").textContent = word[1];
  $("#flash-meaning").textContent = word[2];
  renderSession();
}

function revealCard() {
  $("#flashcard").classList.toggle("revealed");
  const revealed = $("#flashcard").classList.contains("revealed");
  $("#flash-answer").setAttribute("aria-hidden", String(!revealed));
}

function advanceCard(markKnown) {
  const word = state.session[state.sessionIndex];
  if (markKnown) state.known.add(word[0]);
  localStorage.setItem("mandarin-known", JSON.stringify([...state.known]));
  updateProgress();
  state.sessionIndex = (state.sessionIndex + 1) % state.session.length;
  renderFlashcard();
}

function renderFilters() {
  const categories = ["All", ...new Set(vocabulary.map((word) => word[3]))];
  const row = $("#category-filters");
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.textContent = category;
    if (category === state.activeCategory) button.classList.add("active");
    button.addEventListener("click", () => {
      state.activeCategory = category;
      row.querySelectorAll("button").forEach((chip) => chip.classList.toggle("active", chip === button));
      renderVocabulary();
    });
    row.append(button);
  });
}

function renderVocabulary() {
  const query = state.query.trim().toLocaleLowerCase();
  const filtered = vocabulary.filter((word) => {
    const inCategory = state.activeCategory === "All" || word[3] === state.activeCategory;
    const matches = !query || word.slice(0, 3).some((value) => value.toLocaleLowerCase().includes(query));
    return inCategory && matches;
  });

  const grid = $("#vocab-grid");
  grid.replaceChildren();
  grid.classList.toggle("hide-pinyin", !state.showPinyin);
  filtered.forEach(([hanzi, pinyin, meaning, category]) => {
    const article = document.createElement("article");
    article.className = "word-card";
    const h3 = document.createElement("h3");
    h3.className = "word-hanzi";
    h3.lang = "zh-Hans";
    h3.textContent = hanzi;
    const py = document.createElement("p");
    py.className = "word-pinyin";
    py.textContent = pinyin;
    const en = document.createElement("p");
    en.className = "word-meaning";
    en.textContent = meaning;
    const tag = document.createElement("span");
    tag.className = "word-category";
    tag.textContent = category;
    article.append(h3, py, en, tag);
    grid.append(article);
  });
  $("#visible-count").textContent = filtered.length;
  $("#vocab-empty").hidden = filtered.length !== 0;
}

function renderPatternTabs() {
  const tabs = $("#pattern-tabs");
  Object.keys(patternGroups).forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pattern-tab";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(group === state.patternGroup));
    button.textContent = group;
    button.addEventListener("click", () => {
      state.patternGroup = group;
      tabs.querySelectorAll("button").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
      renderPatterns();
    });
    tabs.append(button);
  });
}

function renderPatterns() {
  const list = $("#pattern-list");
  list.replaceChildren();
  patternGroups[state.patternGroup].forEach(([chinese, pinyin, english]) => {
    const row = document.createElement("article");
    row.className = "pattern-item";
    const zh = document.createElement("p");
    zh.className = "pattern-chinese";
    zh.lang = "zh-Hans";
    zh.textContent = chinese;
    const py = document.createElement("p");
    py.className = "pattern-pinyin";
    py.textContent = pinyin;
    const en = document.createElement("p");
    en.className = "pattern-english";
    en.textContent = english;
    row.append(zh, py, en);
    list.append(row);
  });
}

function renderReading() {
  const article = $("#reading-copy");
  article.replaceChildren();
  readings[state.readingLayer].forEach((line) => {
    const paragraph = document.createElement("p");
    paragraph.className = "reading-paragraph";
    paragraph.dataset.layer = state.readingLayer;
    paragraph.textContent = line;
    if (state.readingLayer === "chinese") paragraph.lang = "zh-Hans";
    article.append(paragraph);
  });
}

function renderDialogue() {
  const list = $("#dialogue-list");
  planDialogue.forEach(([speaker, chinese, pinyin, english]) => {
    const row = document.createElement("article");
    row.className = "dialogue-turn";
    row.innerHTML = `<span class="dialogue-speaker">${speaker}</span><div><p class="dialogue-chinese" lang="zh-Hans">${chinese}</p><p class="dialogue-pinyin">${pinyin}</p></div><p class="dialogue-english">${english}</p>`;
    list.append(row);
  });
}

function renderCharacters() {
  const grid = $("#character-grid");
  characters.forEach(([character, pinyin, meaning], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-button";
    button.lang = "zh-Hans";
    button.textContent = character;
    button.setAttribute("aria-label", `${character}, ${pinyin}, ${meaning}`);
    if (index === 0) button.classList.add("active");
    button.addEventListener("click", () => {
      grid.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      $("#focus-character").textContent = character;
      $("#focus-pinyin").textContent = pinyin;
      $("#focus-meaning").textContent = meaning;
    });
    grid.append(button);
  });
}

$("#word-count").textContent = vocabulary.length;
$("#flashcard").addEventListener("click", revealCard);
$("#flashcard").addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    revealCard();
  }
});
$("#review-again").addEventListener("click", () => advanceCard(false));
$("#know-word").addEventListener("click", () => advanceCard(true));
$("#new-session").addEventListener("click", makeSession);
$("#vocab-search").addEventListener("input", (event) => {
  state.query = event.target.value;
  renderVocabulary();
});
$("#toggle-pinyin").addEventListener("click", (event) => {
  state.showPinyin = !state.showPinyin;
  event.currentTarget.textContent = state.showPinyin ? "Hide pinyin" : "Show pinyin";
  event.currentTarget.setAttribute("aria-pressed", String(!state.showPinyin));
  renderVocabulary();
});
$("#reading-controls").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-layer]");
  if (!button) return;
  state.readingLayer = button.dataset.layer;
  $("#reading-controls").querySelectorAll("button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderReading();
});
$(".menu-button").addEventListener("click", (event) => {
  const open = $("#site-nav").classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
$("#site-nav").addEventListener("click", () => {
  $("#site-nav").classList.remove("open");
  $(".menu-button").setAttribute("aria-expanded", "false");
});
window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", window.scrollY > 10), { passive: true });

renderFilters();
renderVocabulary();
renderPatternTabs();
renderPatterns();
renderDialogue();
renderReading();
renderCharacters();
makeSession();
updateProgress();
