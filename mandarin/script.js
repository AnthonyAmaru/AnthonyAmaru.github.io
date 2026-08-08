const requestedLessonId = new URLSearchParams(location.search).get("lesson") || "lesson-1";
const currentLesson = window.MandarinLessons?.get(requestedLessonId);
const vocabulary = currentLesson?.vocabulary || [];
const patternGroups = currentLesson?.sentenceGroups || {};
const planDialogue = currentLesson?.dialogue || [];
const pronunciationDrills = currentLesson?.pronunciationDrills || [];
const conversationReadings = currentLesson?.readings || [];
const characters = currentLesson?.characters || [];
const WRITING_WORDS_KEY = "anthony_mandarin_written_words_v1";
const WRITING_WORDS_CLOUD_KEY = "mandarin_written_words_v1";
const KNOWN_WORDS_KEY = "mandarin-known";
const KNOWN_WORDS_CLOUD_KEY = "mandarin_known_words_v1";

const state = {
  activeCategory: "All",
  query: "",
  showPinyin: true,
  patternGroup: Object.keys(patternGroups)[0],
  readingLayer: "chinese",
  session: [],
  sessionIndex: 0,
  known: new Set(readKnownWords()),
};

let writingWords = readWritingWords();
let mandarinCloudSyncPromise = null;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

function normalizeWritingWords(value) {
  return [...new Set((Array.isArray(value) ? value : []).map((word) => String(word || "").trim()).filter(Boolean))];
}

function readWritingWords() {
  try { return normalizeWritingWords(JSON.parse(localStorage.getItem(WRITING_WORDS_KEY) || "[]")); }
  catch { return []; }
}

function writeWritingWords(value) {
  writingWords = normalizeWritingWords(value);
  localStorage.setItem(WRITING_WORDS_KEY, JSON.stringify(writingWords));
  renderWritingWords();
}

function readKnownWords() {
  try { return normalizeWritingWords(JSON.parse(localStorage.getItem(KNOWN_WORDS_KEY) || "[]")); }
  catch { return []; }
}

function writeKnownWords(value) {
  state.known = new Set(normalizeWritingWords(value));
  localStorage.setItem(KNOWN_WORDS_KEY, JSON.stringify([...state.known]));
  updateProgress();
  renderSession();
}

async function saveKnownWords() {
  writeKnownWords([...state.known]);
  if (!window.musicCloud?.isSignedIn()) return;
  try {
    await musicCloud.saveContent("anthony", KNOWN_WORDS_CLOUD_KEY, [...state.known]);
  } catch (error) {
    console.warn("Mandarin known-word save failed", error);
  }
}

async function saveWritingWords() {
  writeWritingWords(writingWords);
  const status = $("#writing-save-status");
  if (!window.musicCloud?.isSignedIn()) {
    status.textContent = "Saved on this device";
    return;
  }
  try {
    await musicCloud.saveContent("anthony", WRITING_WORDS_CLOUD_KEY, writingWords);
    status.textContent = "Saved to cloud";
  } catch (error) {
    status.textContent = "Saved on device · cloud retry needed";
    console.warn("Mandarin writing list save failed", error);
  }
}

async function syncWritingWordsFromCloud() {
  const status = $("#writing-save-status");
  if (!window.musicCloud?.isSignedIn()) {
    status.textContent = "Saved on this device";
    return renderWritingWords();
  }
  try {
    const row = await musicCloud.getContent("anthony", WRITING_WORDS_CLOUD_KEY);
    const merged = normalizeWritingWords([...(row?.value || []), ...writingWords]);
    writeWritingWords(merged);
    if (!row?.value || merged.length !== normalizeWritingWords(row.value).length) await musicCloud.saveContent("anthony", WRITING_WORDS_CLOUD_KEY, merged);
    status.textContent = "Synced privately across devices";
  } catch (error) {
    status.textContent = "Saved on device · cloud unavailable";
    console.warn("Mandarin writing list sync failed", error);
  }
}

async function syncKnownWordsFromCloud() {
  if (!window.musicCloud?.isSignedIn()) return;
  try {
    const row = await musicCloud.getContent("anthony", KNOWN_WORDS_CLOUD_KEY);
    const cloudWords = normalizeWritingWords(row?.value);
    const merged = normalizeWritingWords([...cloudWords, ...state.known]);
    writeKnownWords(merged);
    if (!row?.value || merged.length !== cloudWords.length) await musicCloud.saveContent("anthony", KNOWN_WORDS_CLOUD_KEY, merged);
  } catch (error) {
    console.warn("Mandarin known-word sync failed", error);
  }
}

function syncMandarinProgressFromCloud() {
  if (mandarinCloudSyncPromise) return mandarinCloudSyncPromise;
  mandarinCloudSyncPromise = Promise.all([syncWritingWordsFromCloud(), syncKnownWordsFromCloud()])
    .finally(() => { mandarinCloudSyncPromise = null; });
  return mandarinCloudSyncPromise;
}

function renderWritingWords() {
  const list = $("#writing-word-list");
  $("#writing-word-count").textContent = String(writingWords.length);
  $("#writing-word-empty").hidden = writingWords.length > 0;
  list.innerHTML = writingWords.map((word) => `<li><span lang="zh-Hans">${escapeHtml(word)}</span><button type="button" data-remove-writing-word="${escapeHtml(word)}" aria-label="Remove ${escapeHtml(word)}">×</button></li>`).join("");
  enhanceMandarinSpeech(list);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" })[character]);
}

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
    label.lang = "zh-Hans";
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
  if (markKnown) {
    state.known.add(word[0]);
    void saveKnownWords();
  }
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
  conversationReadings.forEach((reading) => {
    const paragraph = document.createElement("p");
    paragraph.className = "reading-paragraph";
    paragraph.dataset.layer = state.readingLayer;
    const line = reading[state.readingLayer];
    if (state.readingLayer === "chinese") {
      paragraph.lang = "zh-Hans";
      appendHighlightedWords(paragraph, line, reading.newWords.map(([word]) => word));
    } else paragraph.textContent = line;
    const wordList = document.createElement("div");
    wordList.className = "new-word-list";
    reading.newWords.slice(0, 5).forEach(([word, pinyin, meaning]) => {
      const chip = document.createElement("span");
      chip.textContent = `${word} · ${pinyin} · ${meaning}`;
      wordList.append(chip);
    });
    article.append(paragraph, wordList);
  });
}

function appendHighlightedWords(container, text, words) {
  const pattern = new RegExp(`(${words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  text.split(pattern).filter(Boolean).forEach((piece) => {
    if (words.includes(piece)) {
      const mark = document.createElement("mark");
      mark.className = "new-word";
      mark.textContent = piece;
      container.append(mark);
    } else container.append(document.createTextNode(piece));
  });
}

function speakMandarin(text) {
  if (window.MandarinSpeech) return window.MandarinSpeech.speak(text);
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.82;
  utterance.voice = speechSynthesis.getVoices().find((voice) => /^zh[-_]/i.test(voice.lang)) || null;
  speechSynthesis.speak(utterance);
}

function enhanceMandarinSpeech(root = document) {
  const selector = '[lang="zh-Hans"], [data-speak-mandarin]';
  const elements = [...(root.matches?.(selector) ? [root] : []), ...root.querySelectorAll(selector)];
  elements.forEach((element) => {
    element.classList.add("speakable-mandarin");
    element.title ||= "Tap to hear Mandarin";
    if (!element.matches("button, a, input, select, textarea, [tabindex]")) {
      element.tabIndex = 0;
      element.setAttribute("role", "button");
    }
  });
}

function speakFromElement(element) {
  const text = element.dataset.speakMandarin || element.textContent.trim();
  if (text) speakMandarin(text);
}

function renderDialogue() {
  const list = $("#dialogue-list");
  planDialogue.forEach(([speaker, chinese, pinyin, english]) => {
    const row = document.createElement("article");
    row.className = "dialogue-turn";
    const speakerName = speaker === "安" ? "Anthony" : "Xiao Li";
    row.innerHTML = `<span class="dialogue-speaker" aria-label="${speakerName}" title="${speakerName}">${speaker}</span><div><p class="dialogue-chinese" lang="zh-Hans">${chinese}</p><p class="dialogue-pinyin">${pinyin}</p></div><p class="dialogue-english">${english}</p>`;
    list.append(row);
  });
}

function renderPronunciation() {
  const grid = $("#sound-grid");
  pronunciationDrills.forEach(([number, syllable, initial, tone]) => {
    const card = document.createElement("article");
    card.className = "sound-card";
    card.dataset.speakMandarin = syllable;
    card.innerHTML = `<span class="sound-number">${number}</span><strong>${syllable}</strong><small>${initial} · ${tone}</small>`;
    grid.append(card);
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
$("#writing-word-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = $("#writing-word-input");
  const word = input.value.trim();
  if (!word) return;
  if (!writingWords.includes(word)) writingWords.push(word);
  input.value = "";
  await saveWritingWords();
  input.focus();
});
$("#writing-word-list").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-remove-writing-word]");
  if (!button) return;
  writingWords = writingWords.filter((word) => word !== button.dataset.removeWritingWord);
  await saveWritingWords();
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
$("#speak-reading").addEventListener("click", () => speakMandarin(conversationReadings.map((reading) => reading.chinese).join("。")));
document.addEventListener("click", (event) => {
  const target = event.target.closest('.speakable-mandarin, [lang="zh-Hans"], [data-speak-mandarin]');
  if (target) speakFromElement(target);
});
document.addEventListener("keydown", (event) => {
  if (!['Enter', ' '].includes(event.key)) return;
  const target = event.target.closest('.speakable-mandarin, [lang="zh-Hans"], [data-speak-mandarin]');
  if (!target) return;
  event.preventDefault();
  speakFromElement(target);
});
const requestedPage = new URLSearchParams(location.search).get("page");
const mandarinPages = ["lesson", "cards", "sounds", "words", "writing", "sentences", "plans", "reading", "characters"];
const activePage = mandarinPages.includes(requestedPage) ? requestedPage : "lesson";
$$('.mandarin-page').forEach((page) => { page.hidden = page.dataset.page !== activePage; });
$$('[data-page-link]').forEach((link) => {
  if (link.dataset.pageLink === activePage) link.setAttribute("aria-current", "page");
  else link.removeAttribute("aria-current");
});

renderFilters();
renderVocabulary();
renderPronunciation();
renderPatternTabs();
renderPatterns();
renderDialogue();
renderReading();
renderCharacters();
renderWritingWords();
makeSession();
updateProgress();
enhanceMandarinSpeech();
syncMandarinProgressFromCloud();
window.addEventListener("site-cloud-change", () => { void syncMandarinProgressFromCloud(); });
const mandarinMain = $("main");
if (mandarinMain) {
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) enhanceMandarinSpeech(node);
  }))).observe(mandarinMain, { childList: true, subtree: true });
}
