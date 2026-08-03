const ADMIN_HASH = "1e67aef3b01e797309c5588def71607f40a4facc6b8993af9a62306f727a2e5a";
const HISTORY_KEY = "anthony_mandarin_history_v1";
const CLOUD_ADMIN_EMAIL = "anthonyamaru93@gmail.com";

const wordBank = [
  ["你好", "nǐ hǎo", "hello"], ["很好", "hěn hǎo", "very good"], ["谢谢", "xièxie", "thank you"],
  ["明天见", "míngtiān jiàn", "see you tomorrow"], ["加油", "jiāyóu", "keep going"], ["朋友", "péngyou", "friend"],
  ["老师", "lǎoshī", "teacher"], ["名字", "míngzi", "name"], ["中文", "zhōngwén", "Chinese language"],
  ["面包", "miànbāo", "bread"], ["饺子", "jiǎozi", "dumplings"], ["面条", "miàntiáo", "noodles"],
  ["米饭", "mǐfàn", "cooked rice"], ["鸡肉", "jīròu", "chicken"], ["西兰花", "xīlánhuā", "broccoli"],
  ["馄饨", "húntun", "wontons"], ["冰水", "bīngshuǐ", "ice water"], ["热水", "rèshuǐ", "hot water"],
  ["好吃", "hǎochī", "delicious"], ["服务员", "fúwùyuán", "server or waiter"], ["请客", "qǐngkè", "to treat someone"],
  ["买单", "mǎidān", "to pay the bill"], ["打包", "dǎbāo", "to pack food to go"], ["一共", "yígòng", "altogether"],
  ["生日", "shēngrì", "birthday"], ["昨天", "zuótiān", "yesterday"], ["明天", "míngtiān", "tomorrow"],
  ["现在", "xiànzài", "now"], ["饭店", "fàndiàn", "restaurant"], ["操场", "cāochǎng", "playground"],
  ["时间", "shíjiān", "time"], ["哪里", "nǎlǐ", "where"], ["没有", "méi yǒu", "do not have"],
  ["非常", "fēicháng", "extremely"], ["太…了", "tài…le", "too or extremely"], ["两", "liǎng", "two before measure words"],
];

const sentenceBank = [
  ["我叫安东尼。", "Wǒ jiào Āndōngní.", "My name is Anthony."],
  ["我是美国人。", "Wǒ shì Měiguó rén.", "I am American."],
  ["我不是中国人。", "Wǒ bú shì Zhōngguó rén.", "I am not Chinese."],
  ["你是哪国人？", "Nǐ shì nǎ guó rén?", "What country are you from?"],
  ["你叫什么名字？", "Nǐ jiào shénme míngzi?", "What is your name?"],
  ["你呢？", "Nǐ ne?", "What about you?"],
  ["我喜欢吃饺子。", "Wǒ xǐhuan chī jiǎozi.", "I like eating dumplings."],
  ["你有冰水吗？", "Nǐ yǒu bīngshuǐ ma?", "Do you have ice water?"],
  ["我要两杯冰水。", "Wǒ yào liǎng bēi bīngshuǐ.", "I want two cups of ice water."],
  ["我们去饭店吃饭吧。", "Wǒmen qù fàndiàn chīfàn ba.", "Let's go to the restaurant to eat."],
  ["今天太热了。", "Jīntiān tài rè le.", "It is too hot today."],
  ["现在几点？", "Xiànzài jǐ diǎn?", "What time is it now?"],
  ["我还要一碗面条。", "Wǒ hái yào yì wǎn miàntiáo.", "I also want a bowl of noodles."],
  ["一共一百五十三块。", "Yígòng yì bǎi wǔ shí sān kuài.", "The total is 153 yuan."],
  ["明天见！", "Míngtiān jiàn!", "See you tomorrow!"],
];

const $ = (selector) => document.querySelector(selector);
const state = { questions: [], index: 0, selected: null, checked: false, correct: 0, results: [] };

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function ensureAdmin() {
  const unlocked = sessionStorage.getItem("anthony_admin_unlocked") === "1";
  $("#admin-lock").hidden = unlocked;
  return unlocked;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}

function distractors(bank, answer, count = 3) {
  return shuffle(bank.map((item) => item[2]).filter((meaning) => meaning !== answer)).slice(0, count);
}

function buildQuestions() {
  const type = $("#quiz-type").value;
  const words = wordBank.map(([chinese, pinyin, meaning]) => ({ type: "Word meaning", chinese, pinyin, prompt: "What does this word mean?", answer: meaning, options: shuffle([meaning, ...distractors(wordBank, meaning)]) }));
  const sentences = sentenceBank.map(([chinese, pinyin, meaning]) => ({ type: "Sentence meaning", chinese, pinyin, prompt: "What does this sentence mean?", answer: meaning, options: shuffle([meaning, ...distractors(sentenceBank, meaning)]) }));
  const pool = type === "word" ? words : type === "sentence" ? sentences : [...words, ...sentences];
  return shuffle(pool).slice(0, Math.min(Number($("#question-count").value), pool.length));
}

function showView(id) { document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id)); window.scrollTo({ top: 0, behavior: "smooth" }); }

function startQuiz() {
  if (!ensureAdmin()) return;
  state.questions = buildQuestions(); state.index = 0; state.selected = null; state.checked = false; state.correct = 0; state.results = [];
  showView("quiz-view"); renderQuestion();
}

function renderQuestion() {
  const question = state.questions[state.index];
  state.selected = null; state.checked = false;
  $("#quiz-position").textContent = `${state.index + 1} / ${state.questions.length}`;
  $("#quiz-running-score").textContent = `${state.correct} correct`;
  $("#quiz-progress").style.width = `${(state.index / state.questions.length) * 100}%`;
  $("#question-type").textContent = question.type;
  $("#question-pinyin").textContent = question.pinyin;
  $("#question-chinese").textContent = question.chinese;
  $("#question-text").textContent = question.prompt;
  $("#answer-options").innerHTML = question.options.map((option, index) => `<button class="answer-option" type="button" data-index="${index}"><span class="letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(option)}</span></button>`).join("");
  $("#answer-feedback").hidden = true; $("#check-answer").hidden = false; $("#check-answer").disabled = true; $("#next-question").hidden = true;
  $("#next-question").textContent = state.index === state.questions.length - 1 ? "See results" : "Next question";
}

function checkAnswer() {
  if (state.selected === null || state.checked) return;
  state.checked = true;
  const question = state.questions[state.index];
  const chosen = question.options[state.selected];
  const correct = chosen === question.answer;
  if (correct) state.correct += 1;
  state.results.push({ question, chosen, correct });
  document.querySelectorAll(".answer-option").forEach((option) => { const value = question.options[Number(option.dataset.index)]; option.disabled = true; option.classList.toggle("correct", value === question.answer); option.classList.toggle("incorrect", Number(option.dataset.index) === state.selected && !correct); });
  $("#answer-feedback").innerHTML = `<strong>${correct ? "✓ 很好！ Correct" : "再试一次 · Review this one"}</strong><span>${escapeHtml(question.chinese)} means “${escapeHtml(question.answer)}”</span><small>${escapeHtml(question.pinyin)}</small>`;
  $("#answer-feedback").hidden = false; $("#check-answer").hidden = true; $("#next-question").hidden = false;
  $("#quiz-running-score").textContent = `${state.correct} correct`;
  $("#quiz-progress").style.width = `${((state.index + 1) / state.questions.length) * 100}%`;
}

async function finishQuiz() {
  const wrong = state.results.filter((item) => !item.correct);
  const total = state.questions.length;
  const percent = Math.round((state.correct / total) * 100);
  const history = [{ id: Date.now(), date: new Date().toISOString(), type: $("#quiz-type").value, correct: state.correct, total, percent, wrong: wrong.map(({ question, chosen }) => ({ chinese: question.chinese, pinyin: question.pinyin, answer: question.answer, chosen })) }, ...getHistory()].slice(0, 30);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  if (musicCloud.isSignedIn()) {
    try {
      const entry = history[0];
      await musicCloud.saveTestAttempt({ subject: "mandarin", mode: entry.type, section: null, correct: entry.correct, total: entry.total, percent: entry.percent, wrong_answers: entry.wrong, completed_at: entry.date });
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
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } }
function renderHistory() { const history = getHistory(); $("#last-score").textContent = history.length ? `${history[0].percent}%` : "—"; $("#history-list").innerHTML = history.length ? history.map((entry) => `<div class="history-item"><strong>${entry.percent}% · ${entry.correct}/${entry.total}</strong><span>${entry.wrong.length} missed</span><small>${new Date(entry.date).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small><small>${entry.type}</small></div>`).join("") : '<p class="empty">Your completed quizzes will appear here.</p>'; }
async function loadHistoryFromCloud() {
  if (!window.musicCloud?.isSignedIn()) { $("#history-sync-status").textContent = "Saved on this device"; return; }
  try {
    const rows = await musicCloud.listTestAttempts("mandarin");
    const history = rows.map((row) => ({ id: row.id, date: row.completed_at, type: row.mode || "mixed", correct: row.correct, total: row.total, percent: row.percent, wrong: row.wrong_answers || [] }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    $("#history-sync-status").textContent = "Synced privately across devices";
    renderHistory();
  } catch (error) {
    $("#history-sync-status").textContent = "Cloud sync unavailable · showing this device";
    console.warn("Mandarin cloud load failed", error);
  }
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]); }

$("#mandarin-unlock-form").addEventListener("submit", async (event) => { event.preventDefault(); const password = $("#mandarin-password").value; const hash = await digest(password); if (hash === ADMIN_HASH) { try { if (!musicCloud.isSignedIn()) await musicCloud.signIn(CLOUD_ADMIN_EMAIL, password); sessionStorage.setItem("anthony_admin_unlocked", "1"); $("#mandarin-password-error").textContent = ""; $("#mandarin-password").value = ""; ensureAdmin(); await loadHistoryFromCloud(); } catch (error) { $("#mandarin-password-error").textContent = `Cloud sign-in failed: ${error.message}`; } } else $("#mandarin-password-error").textContent = "That admin password did not match."; });
$("#start-quiz").addEventListener("click", startQuiz);
$("#answer-options").addEventListener("click", (event) => { const option = event.target.closest(".answer-option"); if (!option || state.checked) return; state.selected = Number(option.dataset.index); document.querySelectorAll(".answer-option").forEach((item) => item.classList.toggle("selected", item === option)); $("#check-answer").disabled = false; });
$("#check-answer").addEventListener("click", checkAnswer); $("#next-question").addEventListener("click", nextQuestion);
$("#exit-quiz").addEventListener("click", () => showView("setup-view")); $("#new-quiz").addEventListener("click", () => showView("setup-view"));
$("#review-wrong").addEventListener("click", () => $("#wrong-list").scrollIntoView({ behavior: "smooth" }));
$("#clear-history").addEventListener("click", async () => { if (!ensureAdmin()) return; if (confirm("Clear Mandarin score history on every synced device?")) { localStorage.removeItem(HISTORY_KEY); if (musicCloud.isSignedIn()) await musicCloud.clearTestAttempts("mandarin").catch((error) => console.warn("Cloud clear failed", error)); renderHistory(); } });

renderHistory(); ensureAdmin(); loadHistoryFromCloud();
