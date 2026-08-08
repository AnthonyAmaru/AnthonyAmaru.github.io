const HISTORY_KEY = "anthony_mandarin_history_v1";
const WRONG_BANK_KEY = "anthony_mandarin_wrong_bank_v1";
const WRONG_BANK_CLOUD_KEY = "mandarin_wrong_bank_v1";

const wordBank = window.MandarinLessons?.allVocabulary() || [];
const sentenceBank = window.MandarinLessons?.allSentences() || [];
const $ = (selector) => document.querySelector(selector);
const state = { questions: [], index: 0, correct: 0, responses: [], mode: "mixed", section: "Mixed practice" };

function ensureAdmin() {
  const unlocked = Boolean(window.musicCloud?.isSignedIn());
  if (!unlocked) sessionStorage.removeItem("anthony_admin_unlocked");
  $("#admin-lock").hidden = unlocked;
  return unlocked;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}

function distractors(bank, answer, count = 3) {
  return shuffle([...new Set(bank.map((item) => item[2]).filter((meaning) => meaning !== answer))]).slice(0, count);
}

function buildQuestions() {
  const type = $("#quiz-type").value;
  const words = wordBank.map(([chinese, pinyin, meaning]) => ({ type: "Word meaning", chinese, pinyin, prompt: "What does this word mean?", answer: meaning, options: shuffle([meaning, ...distractors(wordBank, meaning)]) }));
  const sentences = sentenceBank.map(([chinese, pinyin, meaning]) => ({ type: "Sentence meaning", chinese, pinyin, prompt: "What does this sentence mean?", answer: meaning, options: shuffle([meaning, ...distractors(sentenceBank, meaning)]) }));
  const pool = type === "word" ? words : type === "sentence" ? sentences : [...words, ...sentences];
  return shuffle(pool).slice(0, Math.min(Number($("#question-count").value), pool.length));
}

function showView(id) { document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id)); window.scrollTo({ top: 0, behavior: "smooth" }); }

function questionKey(question) { return `${question.type}:${question.chinese}`; }
function getWrongBank() { try { return JSON.parse(localStorage.getItem(WRONG_BANK_KEY)) || []; } catch { return []; } }
function writeWrongBank(items) {
  const unique = [...new Map(items.filter((item) => item?.chinese && item?.answer).map((item) => [questionKey(item), item])).values()];
  localStorage.setItem(WRONG_BANK_KEY, JSON.stringify(unique));
  renderWrongBank();
  return unique;
}
async function saveWrongBank(items) {
  const unique = writeWrongBank(items);
  if (window.musicCloud?.isSignedIn()) await musicCloud.saveContent("anthony", WRONG_BANK_CLOUD_KEY, unique);
}
function questionFromHistory(item) {
  if (item?.options?.length) return { type: item.type || "Word meaning", chinese: item.chinese, pinyin: item.pinyin || "", prompt: item.prompt || "What does this mean?", answer: item.answer, options: item.options };
  const source = wordBank.find(([chinese]) => chinese === item?.chinese) || sentenceBank.find(([chinese]) => chinese === item?.chinese);
  if (!source) return null;
  const [chinese, pinyin, answer] = source;
  const isSentence = sentenceBank.some(([value]) => value === chinese);
  const bank = isSentence ? sentenceBank : wordBank;
  return { type: isSentence ? "Sentence meaning" : "Word meaning", chinese, pinyin, prompt: isSentence ? "What does this sentence mean?" : "What does this word mean?", answer, options: shuffle([answer, ...distractors(bank, answer)]) };
}
async function loadWrongBank() {
  let bank = getWrongBank();
  if (!bank.length) bank = getHistory().flatMap((entry) => entry.wrong || []).map(questionFromHistory).filter(Boolean);
  if (window.musicCloud?.isSignedIn()) {
    try {
      const row = await musicCloud.getContent("anthony", WRONG_BANK_CLOUD_KEY);
      if (Array.isArray(row?.value)) bank = row.value;
      else await musicCloud.saveContent("anthony", WRONG_BANK_CLOUD_KEY, bank);
      writeWrongBank(bank);
    } catch (error) { console.warn("Mandarin wrong-bank sync failed", error); }
  } else writeWrongBank(bank);
}
function renderWrongBank() {
  const count = getWrongBank().length;
  $("#wrong-bank-count").textContent = String(count);
  $("#start-wrong-bank").disabled = count === 0;
}
function modeLabel(mode) { return ({ mixed: "Mixed practice", word: "Word meanings", sentence: "Sentences", wrong: "Wrong bank" })[mode] || mode; }

function startQuiz(questions = null, mode = null) {
  if (!ensureAdmin()) return;
  state.mode = mode || $("#quiz-type").value;
  const lessonCount = window.MandarinLessons?.lessons?.length || 1;
  const lessonLabel = lessonCount === 1 ? "Lesson 1" : `Lessons 1–${lessonCount}`;
  state.section = state.mode === "wrong" ? "Wrong bank" : `${lessonLabel} · ${modeLabel(state.mode)}`;
  state.questions = questions || buildQuestions();
  state.index = 0;
  state.correct = 0;
  state.responses = state.questions.map(() => ({ selected: null, checked: false, correct: false }));
  showView("quiz-view"); renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.index];
  const response = state.responses[state.index];
  $("#quiz-position").textContent = `${state.index + 1} / ${state.questions.length}`;
  $("#quiz-running-score").textContent = `${state.correct} correct`;
  $("#quiz-progress").style.width = `${(state.responses.filter((item) => item.checked).length / state.questions.length) * 100}%`;
  $("#question-type").textContent = question.type;
  $("#question-pinyin").textContent = question.pinyin;
  $("#question-chinese").textContent = question.chinese;
  $("#question-text").textContent = question.prompt;
  $("#answer-options").innerHTML = question.options.map((option, index) => `<button class="answer-option${response.selected === index ? " selected" : ""}${response.checked && option === question.answer ? " correct" : ""}${response.checked && response.selected === index && !response.correct ? " incorrect" : ""}" type="button" data-index="${index}" ${response.checked ? "disabled" : ""}><span class="letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join("");
  $("#answer-feedback").innerHTML = response.checked ? `<strong>${response.correct ? "✓ 很好！ Correct" : "再试一次 · Saved to wrong bank"}</strong><span>${escapeHtml(question.chinese)} means “${escapeHtml(question.answer)}”</span><small>${escapeHtml(question.pinyin)}</small>` : "";
  $("#answer-feedback").hidden = !response.checked;
  $("#check-answer").hidden = response.checked;
  $("#check-answer").disabled = response.selected === null;
  $("#next-question").hidden = !response.checked;
  $("#previous-question").disabled = state.index === 0;
  $("#next-question").textContent = state.index === state.questions.length - 1 ? "See results" : "Next question";
}

function checkAnswer() {
  const response = state.responses[state.index];
  if (response.selected === null || response.checked) return;
  const question = state.questions[state.index];
  const chosen = question.options[response.selected];
  const correct = chosen === question.answer;
  Object.assign(response, { checked: true, correct, chosen });
  state.correct = state.responses.filter((item) => item.checked && item.correct).length;
  renderQuestion();
}

async function finishQuiz() {
  const results = state.questions.map((question, index) => ({ question, ...state.responses[index] }));
  const wrong = results.filter((item) => !item.correct);
  const total = state.questions.length;
  const percent = Math.round((state.correct / total) * 100);
  const bank = new Map(getWrongBank().map((item) => [questionKey(item), item]));
  results.forEach(({ question, correct }) => {
    if (state.mode === "wrong" && correct) bank.delete(questionKey(question));
    else if (!correct) bank.set(questionKey(question), question);
  });
  await saveWrongBank([...bank.values()]).catch((error) => console.warn("Mandarin wrong-bank save failed", error));
  const history = [{ id: Date.now(), date: new Date().toISOString(), type: state.mode, section: state.section, correct: state.correct, total, percent, wrong: wrong.map(({ question, chosen }) => ({ ...question, chosen })) }, ...getHistory()].slice(0, 30);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  if (musicCloud.isSignedIn()) {
    try {
      const entry = history[0];
      await musicCloud.saveTestAttempt({ subject: "mandarin", mode: entry.type, section: entry.section, correct: entry.correct, total: entry.total, percent: entry.percent, wrong_answers: entry.wrong, completed_at: entry.date });
      await loadHistoryFromCloud();
    } catch (error) {
      $("#history-sync-status").textContent = "Saved locally · cloud retry needed";
      console.warn("Mandarin cloud save failed", error);
    }
  }
  $("#result-percent").textContent = `${percent}%`;
  $("#result-title").textContent = percent >= 80 ? "很好！Very good." : "一点一点来。One step at a time.";
  $("#result-summary").textContent = `${state.correct} correct out of ${total}. ${wrong.length} item${wrong.length === 1 ? "" : "s"} saved for review.`;
  $("#review-wrong").hidden = wrong.length === 0;
  $("#wrong-list").innerHTML = wrong.map(({ question, chosen }) => `<details class="wrong-item"><summary>${escapeHtml(question.chinese)} · ${escapeHtml(question.pinyin)}</summary><p><strong>Your answer:</strong> ${escapeHtml(chosen)}</p><p><strong>Correct:</strong> ${escapeHtml(question.answer)}</p></details>`).join("");
  renderHistory(); showView("results-view");
}

function nextQuestion() { if (state.index < state.questions.length - 1) { state.index += 1; renderQuestion(); } else finishQuiz(); }
function previousQuestion() { if (state.index > 0) { state.index -= 1; renderQuestion(); } }
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } }
function renderHistory() { const history = getHistory(); $("#last-score").textContent = history.length ? `${history[0].percent}%` : "—"; $("#history-list").innerHTML = history.length ? history.map((entry) => `<div class="history-item"><strong>${entry.percent}% · ${entry.correct}/${entry.total}</strong><span>${(entry.wrong || []).length} missed</span><small>${new Date(entry.date).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small><small>Mandarin · ${escapeHtml(entry.section || modeLabel(entry.type))}</small></div>`).join("") : '<p class="empty">Your completed quizzes will appear here.</p>'; }
async function loadHistoryFromCloud() {
  if (!window.musicCloud?.isSignedIn()) { $("#history-sync-status").textContent = "Saved on this device"; return; }
  try {
    const rows = await musicCloud.listTestAttempts("mandarin");
    const history = rows.map((row) => ({ id: row.id, date: row.completed_at, type: row.mode || "mixed", section: row.section || modeLabel(row.mode || "mixed"), correct: row.correct, total: row.total, percent: row.percent, wrong: row.wrong_answers || [] }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    $("#history-sync-status").textContent = "Synced privately across devices";
    renderHistory();
  } catch (error) {
    $("#history-sync-status").textContent = "Cloud sync unavailable · showing this device";
    console.warn("Mandarin cloud load failed", error);
  }
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]); }
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

$("#start-quiz").addEventListener("click", () => startQuiz());
$("#start-wrong-bank").addEventListener("click", () => { const bank = getWrongBank(); const count = Math.min(Number($("#question-count").value), bank.length); startQuiz(shuffle(bank).slice(0, count), "wrong"); });
$("#answer-options").addEventListener("click", (event) => { const option = event.target.closest(".answer-option"); const response = state.responses[state.index]; if (!option || response.checked) return; response.selected = Number(option.dataset.index); renderQuestion(); });
$("#check-answer").addEventListener("click", checkAnswer); $("#next-question").addEventListener("click", nextQuestion); $("#previous-question").addEventListener("click", previousQuestion);
$("#speak-question").addEventListener("click", () => speakMandarin(state.questions[state.index]?.chinese || ""));
$("#question-chinese").addEventListener("click", () => speakMandarin(state.questions[state.index]?.chinese || ""));
$("#question-chinese").addEventListener("keydown", (event) => { if (["Enter", " "].includes(event.key)) { event.preventDefault(); speakMandarin(state.questions[state.index]?.chinese || ""); } });
$("#exit-quiz").addEventListener("click", () => showView("setup-view")); $("#new-quiz").addEventListener("click", () => showView("setup-view"));
$("#review-wrong").addEventListener("click", () => $("#wrong-list").scrollIntoView({ behavior: "smooth" }));
$("#clear-history").addEventListener("click", async () => { if (!ensureAdmin()) return; if (confirm("Clear Mandarin score history on every synced device?")) { localStorage.removeItem(HISTORY_KEY); if (musicCloud.isSignedIn()) await musicCloud.clearTestAttempts("mandarin").catch((error) => console.warn("Cloud clear failed", error)); renderHistory(); } });

const navigationLessonId = new URLSearchParams(location.search).get("lesson") || window.MandarinLessons?.lessons?.[0]?.id || "lesson-1";
document.querySelectorAll("[data-preserve-lesson]").forEach((link) => {
  const url = new URL(link.href, location.href);
  url.searchParams.set("lesson", navigationLessonId);
  link.href = url.href;
});

renderHistory(); renderWrongBank(); ensureAdmin(); loadHistoryFromCloud(); loadWrongBank();
