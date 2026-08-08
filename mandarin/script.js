const requestedLessonId = new URLSearchParams(location.search).get("lesson") || "lesson-1";
const currentLesson = window.MandarinLessons?.get(requestedLessonId);
const vocabulary = window.MandarinLessons?.allVocabulary() || currentLesson?.vocabulary || [];
const patternGroups = currentLesson?.sentenceGroups || {};
const planDialogue = currentLesson?.dialogue || [];
const conversationReadings = currentLesson?.readings || [];
const characters = window.MandarinLessons?.allCharacters() || currentLesson?.characters || [];
const pinyinSoundGroups = window.MandarinLessons?.pinyinSoundGroups || {};
const WRITING_WORDS_KEY = "anthony_mandarin_written_words_v1";
const WRITING_WORDS_CLOUD_KEY = "mandarin_written_words_v1";
const KNOWN_WORDS_KEY = "mandarin-known";
const KNOWN_WORDS_CLOUD_KEY = "mandarin_known_words_v1";

const state = {
  activeCategory: "All",
  wordType: "all",
  mastery: "all",
  query: "",
  showPinyin: true,
  patternGroup: Object.keys(patternGroups)[0],
  soundGroup: Object.keys(pinyinSoundGroups)[0],
  practiceType: "sentences",
  practiceMode: "mandarin",
  practiceRevealed: new Set(),
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
  renderVocabulary();
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
  renderKnownWords();
  renderVocabulary();
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

function renderKnownWords() {
  const knownRows = vocabulary.filter(([hanzi]) => state.known.has(hanzi));
  $("#known-word-count").textContent = String(knownRows.length);
  $("#known-word-empty").hidden = knownRows.length > 0;
  $("#known-word-list").innerHTML = knownRows.map(([hanzi, pinyin, meaning]) => `
    <article class="known-word-chip">
      <strong lang="zh-Hans">${escapeHtml(hanzi)}</strong>
      <span>${escapeHtml(pinyin)}</span>
      <small>${escapeHtml(meaning)}</small>
    </article>`).join("");
  enhanceMandarinSpeech($("#known-word-list"));
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

function lexiconEntries() {
  const characterMap = new Map(characters.map(([hanzi, pinyin, meaning]) => [hanzi, { pinyin, meaning }]));
  const entries = vocabulary.map(([hanzi, pinyin, meaning, category]) => ({
    hanzi, pinyin, meaning, category, isWord: true, isCharacter: characterMap.has(hanzi),
  }));
  const wordHanzi = new Set(entries.map((entry) => entry.hanzi));
  characters.forEach(([hanzi, pinyin, meaning]) => {
    if (!wordHanzi.has(hanzi)) entries.push({ hanzi, pinyin, meaning, category: "Character", isWord: false, isCharacter: true });
  });
  return entries;
}

function masteryState(hanzi) {
  const known = state.known.has(hanzi);
  const writing = writingWords.includes(hanzi);
  if (known && writing) return "both";
  if (known) return "known";
  if (writing) return "writing";
  return "unmarked";
}

function renderChoiceFilters(container, choices, selected, onSelect) {
  container.replaceChildren();
  choices.forEach(({ value, label, color }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.dataset.value = value;
    button.classList.toggle("active", value === selected);
    button.setAttribute("aria-pressed", String(value === selected));
    if (color) button.innerHTML = `<span class="mastery-dot ${color}" aria-hidden="true"></span>${escapeHtml(label)}`;
    else button.textContent = label;
    button.addEventListener("click", () => onSelect(value));
    container.append(button);
  });
}

function renderFilters() {
  const categories = ["All", ...new Set(lexiconEntries().map((entry) => entry.category))];
  renderChoiceFilters($("#category-filters"), categories.map((value) => ({ value, label: value })), state.activeCategory, (value) => {
    state.activeCategory = value;
    renderFilters();
    renderVocabulary();
  });
  renderChoiceFilters($("#word-type-filters"), [
    { value: "all", label: "Words + characters" }, { value: "words", label: "Words" }, { value: "characters", label: "Characters" },
  ], state.wordType, (value) => {
    state.wordType = value;
    renderFilters();
    renderVocabulary();
  });
  renderChoiceFilters($("#mastery-filters"), [
    { value: "all", label: "All" }, { value: "known", label: "Flashcard", color: "yellow" },
    { value: "writing", label: "Writing", color: "orange" }, { value: "both", label: "Both", color: "purple" },
    { value: "unmarked", label: "Unmarked" },
  ], state.mastery, (value) => {
    state.mastery = value;
    renderFilters();
    renderVocabulary();
  });
}

function renderVocabulary() {
  const query = state.query.trim().toLocaleLowerCase();
  const filtered = lexiconEntries().filter((entry) => {
    const inCategory = state.activeCategory === "All" || entry.category === state.activeCategory;
    const inType = state.wordType === "all" || (state.wordType === "words" ? entry.isWord : entry.isCharacter);
    const mastery = masteryState(entry.hanzi);
    const inMastery = state.mastery === "all" || mastery === state.mastery;
    const matches = !query || [entry.hanzi, entry.pinyin, entry.meaning].some((value) => value.toLocaleLowerCase().includes(query));
    return inCategory && inType && inMastery && matches;
  });

  const grid = $("#vocab-grid");
  grid.replaceChildren();
  grid.classList.toggle("hide-pinyin", !state.showPinyin);
  filtered.forEach(({ hanzi, pinyin, meaning, category, isWord, isCharacter }) => {
    const mastery = masteryState(hanzi);
    const article = document.createElement("article");
    article.className = `word-card mastery-${mastery}`;
    const typeLabel = isWord && isCharacter ? "Word · Character" : isCharacter ? "Character" : category;
    article.innerHTML = `
      <h3 class="word-hanzi" lang="zh-Hans">${escapeHtml(hanzi)}</h3>
      <p class="word-pinyin">${escapeHtml(pinyin)}</p>
      <p class="word-meaning">${escapeHtml(meaning)}</p>
      <span class="word-category">${escapeHtml(typeLabel)}</span>
      ${mastery === "unmarked" ? "" : `<span class="mastery-label">${mastery === "known" ? "Flashcard" : mastery === "writing" ? "Writing" : "Flashcard + writing"}</span>`}`;
    grid.append(article);
  });
  $("#visible-count").textContent = String(filtered.length);
  $("#vocab-empty").hidden = filtered.length !== 0;
  enhanceMandarinSpeech(grid);
}

function renderLessonOverview() {
  const overview = currentLesson?.overview || {};
  const cards = overview.cards || [];
  const feature = overview.feature || [];
  const drills = currentLesson?.pronunciationDrills || [];
  $("#lesson-overview-title").textContent = currentLesson?.title || "Lesson";
  $("#lesson-overview-cards").innerHTML = cards.map(([label, chinese, pinyin, meaning]) => `
    <article class="greeting-card">
      <span>${escapeHtml(label)}</span>
      <strong lang="zh-Hans">${escapeHtml(chinese)}</strong>
      <small>${escapeHtml(pinyin)}</small>
      <em>${escapeHtml(meaning)}</em>
    </article>`).join("");
  $("#lesson-overview-feature").innerHTML = feature.length ? `
    <article class="lesson-feature">
      <span>${escapeHtml(feature[0])}</span>
      <strong lang="zh-Hans">${escapeHtml(feature[1])}</strong>
      <p>${escapeHtml(feature[2])}</p>
      <small>${escapeHtml(feature[3])}</small>
    </article>` : "";
  $("#lesson-sound-chips").innerHTML = drills.map(([, syllable, focus, note]) => {
    const example = String(note || "").split("·")[0].trim();
    return `<button type="button" data-speak-mandarin="${escapeHtml(example)}"><strong>${escapeHtml(focus)}</strong><span>${escapeHtml(syllable)}</span></button>`;
  }).join("");
  enhanceMandarinSpeech($("#lesson-one"));
}

function practiceRows() {
  if (state.practiceType === "conversation") {
    return planDialogue.map(([speaker, chinese, pinyin, english], index) => ({
      label: speaker === "安" ? "Anthony" : "Xiao Li", chinese, pinyin, english, key: `conversation-${index}`,
    }));
  }
  if (state.practiceType === "reading") {
    return conversationReadings.map((reading, index) => ({
      label: `Reading ${index + 1}`, chinese: reading.chinese, pinyin: reading.pinyin, english: reading.english,
      newWords: reading.newWords || [], key: `reading-${index}`,
    }));
  }
  return (patternGroups[state.patternGroup] || []).map(([chinese, pinyin, english], index) => ({
    label: state.patternGroup, chinese, pinyin, english, key: `sentence-${state.patternGroup}-${index}`,
  }));
}

function renderPracticeTopics() {
  const tabs = $("#practice-topic-tabs");
  tabs.hidden = state.practiceType !== "sentences";
  tabs.replaceChildren();
  if (tabs.hidden) return;
  Object.keys(patternGroups).forEach((group) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.textContent = group;
    button.classList.toggle("active", group === state.patternGroup);
    button.setAttribute("aria-pressed", String(group === state.patternGroup));
    button.addEventListener("click", () => {
      state.patternGroup = group;
      state.practiceRevealed.clear();
      renderPracticeTopics();
      renderPractice();
    });
    tabs.append(button);
  });
}

function renderPractice() {
  $("#practice-lesson-title").textContent = currentLesson?.title || "Lesson";
  const list = $("#practice-list");
  const revealLayer = state.practiceMode === "mandarin" ? "pinyin" : "english";
  list.innerHTML = practiceRows().map((row) => {
    const revealKey = `${state.practiceType}:${state.practiceMode}:${row.key}`;
    const revealed = state.practiceRevealed.has(revealKey);
    const prompt = state.practiceMode === "mandarin" ? row.chinese : row.pinyin;
    const newWords = state.practiceType === "reading" && row.newWords?.length
      ? `<div class="practice-new-words">${row.newWords.slice(0, 5).map(([word, pinyin, meaning]) => `<span>${escapeHtml(word)} · ${escapeHtml(pinyin)} · ${escapeHtml(meaning)}</span>`).join("")}</div>`
      : "";
    return `<article class="practice-card">
      <div class="practice-card-top"><span>${escapeHtml(row.label)}</span><button type="button" class="practice-speak" data-speak-mandarin="${escapeHtml(row.chinese)}" aria-label="Speak Mandarin">🔊</button></div>
      <p class="practice-prompt ${state.practiceMode === "mandarin" ? "practice-chinese" : "practice-pinyin"}" ${state.practiceMode === "mandarin" ? 'lang="zh-Hans"' : ""}>${escapeHtml(prompt)}</p>
      <button type="button" class="practice-reveal" data-reveal-practice="${escapeHtml(revealKey)}" aria-expanded="${revealed}">${revealed ? "Hide" : "Reveal"}</button>
      <div class="practice-answer" ${revealed ? "" : "hidden"} data-practice-answer>
        <strong>${revealLayer === "pinyin" ? "Pinyin" : "English"}</strong>
        <p>${escapeHtml(row[revealLayer])}</p>
        ${revealed ? newWords : ""}
      </div>
    </article>`;
  }).join("");
  enhanceMandarinSpeech(list);
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

function renderSoundTabs() {
  const tabs = $("#sound-group-tabs");
  tabs.replaceChildren();
  Object.entries(pinyinSoundGroups).forEach(([group, rows]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(group === state.soundGroup));
    button.textContent = `${group} ${rows.length}`;
    button.addEventListener("click", () => {
      state.soundGroup = group;
      renderSoundTabs();
      renderPronunciation();
    });
    tabs.append(button);
  });
}

function renderPronunciation() {
  const grid = $("#sound-grid");
  const rows = pinyinSoundGroups[state.soundGroup] || [];
  grid.replaceChildren();
  rows.forEach(([sound, hanzi, example], index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "sound-card";
    const practicedHere = (currentLesson?.pronunciationDrills || []).some(([, , focus]) => focus === sound);
    card.classList.toggle("lesson-practiced", practicedHere);
    card.dataset.speakMandarin = hanzi;
    card.setAttribute("aria-label", `${sound}, example ${hanzi}, ${example}${practicedHere ? `, practiced in ${currentLesson.title}` : ""}`);
    card.innerHTML = `<span class="sound-number">${index + 1}</span><strong>${escapeHtml(sound)}</strong><span lang="zh-Hans">${escapeHtml(hanzi)}</span><small>${escapeHtml(example)}</small>`;
    grid.append(card);
  });
  enhanceMandarinSpeech(grid);
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
$("#practice-type-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-practice-type]");
  if (!button) return;
  state.practiceType = button.dataset.practiceType;
  state.practiceRevealed.clear();
  $("#practice-type-tabs").querySelectorAll("button").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
  renderPracticeTopics();
  renderPractice();
});
$("#practice-mode-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-practice-mode]");
  if (!button) return;
  state.practiceMode = button.dataset.practiceMode;
  state.practiceRevealed.clear();
  $("#practice-mode-tabs").querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  renderPractice();
});
$("#practice-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-reveal-practice]");
  if (!button) return;
  const key = button.dataset.revealPractice;
  if (state.practiceRevealed.has(key)) state.practiceRevealed.delete(key);
  else state.practiceRevealed.add(key);
  renderPractice();
});
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
const rawRequestedPage = new URLSearchParams(location.search).get("page");
const requestedPage = ["sentences", "plans", "reading"].includes(rawRequestedPage) ? "practice" : rawRequestedPage;
const mandarinPages = ["lesson", "cards", "sounds", "words", "writing", "practice"];
const activePage = mandarinPages.includes(requestedPage) ? requestedPage : "lesson";
$$('[data-preserve-lesson]').forEach((link) => {
  const url = new URL(link.href, location.href);
  url.searchParams.set("lesson", currentLesson?.id || "lesson-1");
  link.href = url.href;
});
$$('.mandarin-page').forEach((page) => { page.hidden = page.dataset.page !== activePage; });
$$('[data-page-link]').forEach((link) => {
  const activeLesson = link.dataset.pageLink !== "lesson" || link.dataset.lessonLink === currentLesson?.id;
  if (link.dataset.pageLink === activePage && activeLesson) link.setAttribute("aria-current", "page");
  else link.removeAttribute("aria-current");
});

renderFilters();
renderVocabulary();
renderLessonOverview();
renderSoundTabs();
renderPronunciation();
renderWritingWords();
makeSession();
renderKnownWords();
renderPracticeTopics();
renderPractice();
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
