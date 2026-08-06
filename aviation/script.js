const ADMIN_HASH = "1e67aef3b01e797309c5588def71607f40a4facc6b8993af9a62306f727a2e5a";
const HISTORY_KEY = "anthony_aviation_history_v1";
const WRONG_BANK_KEY = "anthony_aviation_wrong_bank_v1";
const WRONG_BANK_CLOUD_KEY = "aviation_wrong_bank_v1";
const CLOUD_ADMIN_EMAIL = "anthonyamaru93@gmail.com";

const books = {
  phak: { label: "PHAK", title: "Pilot's Handbook of Aeronautical Knowledge", parts: window.PHAK_QUESTIONS || {} },
  afh: { label: "AFH", title: "Airplane Flying Handbook", parts: window.AFH_QUESTIONS || {} },
};

const appState = {
  session: [],
  current: 0,
  correct: 0,
  responses: [],
  mode: "standard",
  book: "phak",
  chapter: "all",
};

const $ = (selector) => document.querySelector(selector);

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

function flattenPart(bookKey, partKey) {
  const part = books[bookKey].parts[partKey];
  if (!part) return [];
  return (part.sections || []).flatMap((section) =>
    (section.questions || []).map((question) => ({
      ...question,
      bookKey,
      bookLabel: books[bookKey].label,
      partKey,
      partTitle: part.title,
      sectionTitle: section.title,
      sectionRef: section.sectionRef,
    })),
  );
}

function allQuestions(bookKey) {
  return Object.keys(books[bookKey].parts).flatMap((partKey) => flattenPart(bookKey, partKey));
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; }
}

function bookName(bookKey) { return books[bookKey]?.title || (bookKey === "wrong" ? "Wrong bank" : bookKey.toUpperCase()); }
function chapterName(bookKey, partKey) {
  if (bookKey === "wrong") return "Saved misses";
  if (partKey === "all") return "All chapters";
  return books[bookKey]?.parts?.[partKey]?.title || partKey;
}
function questionKey(question) { return `${question.bookKey || "aviation"}:${question.id}`; }
function getWrongBank() { try { return JSON.parse(localStorage.getItem(WRONG_BANK_KEY)) || []; } catch { return []; } }
function writeWrongBank(items) {
  const unique = [...new Map(items.filter((item) => item?.id && item?.q).map((item) => [questionKey(item), item])).values()];
  localStorage.setItem(WRONG_BANK_KEY, JSON.stringify(unique));
  renderWrongBank();
  return unique;
}
async function saveWrongBank(items) {
  const unique = writeWrongBank(items);
  if (window.musicCloud?.isSignedIn()) await musicCloud.saveContent("anthony", WRONG_BANK_CLOUD_KEY, unique);
}
function questionFromHistory(item, entry) {
  if (item?.bookKey && item?.opts?.length) return item;
  const pool = books[entry.book] ? allQuestions(entry.book) : Object.keys(books).flatMap(allQuestions);
  return pool.find((question) => question.id === item?.id) || null;
}
async function loadWrongBank() {
  let bank = getWrongBank();
  if (!bank.length) bank = getHistory().flatMap((entry) => (entry.wrong || []).map((item) => questionFromHistory(item, entry))).filter(Boolean);
  if (window.musicCloud?.isSignedIn()) {
    try {
      const row = await musicCloud.getContent("anthony", WRONG_BANK_CLOUD_KEY);
      if (Array.isArray(row?.value)) bank = row.value;
      else await musicCloud.saveContent("anthony", WRONG_BANK_CLOUD_KEY, bank);
      writeWrongBank(bank);
    } catch (error) { console.warn("Aviation wrong-bank sync failed", error); }
  } else writeWrongBank(bank);
}
function renderWrongBank() {
  const count = getWrongBank().length;
  $("#wrong-bank-count").textContent = String(count);
  $("#start-wrong-bank").disabled = count === 0;
}

async function saveHistory(entry) {
  const history = [entry, ...getHistory()].slice(0, 30);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
  if (!window.musicCloud?.isSignedIn()) return;
  try {
    await musicCloud.saveTestAttempt({
      subject: "aviation",
      mode: entry.book,
      section: entry.chapter,
      correct: entry.correct,
      total: entry.total,
      percent: entry.percent,
      wrong_answers: entry.wrong,
      completed_at: entry.date,
    });
    await loadHistoryFromCloud();
  } catch (error) {
    $("#history-sync-status").textContent = "Saved locally · cloud retry needed";
    console.warn("Aviation cloud save failed", error);
  }
}

async function loadHistoryFromCloud() {
  if (!window.musicCloud?.isSignedIn()) {
    $("#history-sync-status").textContent = "Saved on this device";
    return;
  }
  try {
    const rows = await musicCloud.listTestAttempts("aviation");
    const history = rows.map((row) => ({ id: row.id, date: row.completed_at, book: row.mode || "aviation", chapter: row.section || "all", bookLabel: bookName(row.mode || "aviation"), chapterLabel: chapterName(row.mode || "aviation", row.section || "all"), correct: row.correct, total: row.total, percent: row.percent, wrong: row.wrong_answers || [] }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    $("#history-sync-status").textContent = "Synced privately across devices";
    renderHistory();
  } catch (error) {
    $("#history-sync-status").textContent = "Cloud sync unavailable · showing this device";
    console.warn("Aviation cloud load failed", error);
  }
}

function showView(id) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function populateChapters() {
  const bookKey = $("#book-select").value;
  const options = ['<option value="all">All chapters</option>'];
  Object.entries(books[bookKey].parts).forEach(([key, part]) => {
    options.push(`<option value="${key}">${escapeHtml(part.title)}</option>`);
  });
  $("#chapter-select").innerHTML = options.join("");
  updateAvailability();
}

function availableQuestions() {
  const bookKey = $("#book-select").value;
  const partKey = $("#chapter-select").value;
  return partKey === "all" ? allQuestions(bookKey) : flattenPart(bookKey, partKey);
}

function updateAvailability() {
  const count = availableQuestions().length;
  $("#question-availability").textContent = `${count.toLocaleString()} questions available in this selection.`;
}

function startTest(questions = null, context = null) {
  if (!ensureAdmin()) return;
  const available = questions || availableQuestions();
  if (!available.length) return;
  const countValue = $("#question-count").value;
  const count = countValue === "all" ? available.length : Math.min(Number(countValue), available.length);
  appState.session = shuffle(available).slice(0, count);
  appState.current = 0;
  appState.correct = 0;
  appState.responses = appState.session.map(() => ({ selected: null, checked: false, isCorrect: false }));
  appState.mode = context?.mode || "standard";
  appState.book = context?.book || $("#book-select").value;
  appState.chapter = context?.chapter || $("#chapter-select").value;
  showView("quiz-view");
  renderQuestion();
}

function renderQuestion() {
  const question = appState.session[appState.current];
  const response = appState.responses[appState.current];
  $("#quiz-position").textContent = `${appState.current + 1} / ${appState.session.length}`;
  $("#quiz-running-score").textContent = `${appState.correct} correct`;
  $("#quiz-progress").style.width = `${(appState.responses.filter((item) => item.checked).length / appState.session.length) * 100}%`;
  $("#question-source").textContent = `${question.bookLabel} · ${question.sectionRef || question.partTitle}`;
  $("#question-id").textContent = question.id;
  $("#question-text").textContent = question.q;
  $("#answer-options").innerHTML = question.opts.map((option, index) => `
    <button class="answer-option${response.selected === index ? " selected" : ""}${response.checked && index === question.ans ? " correct" : ""}${response.checked && response.selected === index && !response.isCorrect ? " incorrect" : ""}" type="button" data-index="${index}" ${response.checked ? "disabled" : ""}>
      <span class="letter">${String.fromCharCode(65 + index)}</span>
      <span>${escapeHtml(option)}</span>
    </button>
  `).join("");
  const source = question.ref ? `${question.bookLabel} reference · page ${escapeHtml(String(question.ref.page ?? question.ref.bookPage ?? "—"))}` : question.bookLabel;
  $("#answer-feedback").innerHTML = response.checked ? `<strong>${response.isCorrect ? "✓ Correct" : "Saved to wrong bank"}</strong><span>${escapeHtml(question.exp || "Review the correct answer above.")}</span><small>${source}</small>` : "";
  $("#answer-feedback").hidden = !response.checked;
  $("#check-answer").hidden = response.checked;
  $("#check-answer").disabled = response.selected === null;
  $("#next-question").hidden = !response.checked;
  $("#previous-question").disabled = appState.current === 0;
  $("#next-question").textContent = appState.current === appState.session.length - 1 ? "See results" : "Next question";
}

function selectAnswer(index) {
  const response = appState.responses[appState.current];
  if (response.checked) return;
  response.selected = index;
  renderQuestion();
}

function checkAnswer() {
  const response = appState.responses[appState.current];
  if (response.selected === null || response.checked) return;
  const question = appState.session[appState.current];
  Object.assign(response, { checked: true, isCorrect: response.selected === question.ans });
  appState.correct = appState.responses.filter((item) => item.checked && item.isCorrect).length;
  renderQuestion();
}

function nextQuestion() {
  if (appState.current < appState.session.length - 1) {
    appState.current += 1;
    renderQuestion();
  } else {
    finishTest();
  }
}

function previousQuestion() {
  if (appState.current > 0) {
    appState.current -= 1;
    renderQuestion();
  }
}

async function finishTest() {
  const results = appState.session.map((question, index) => ({ question, ...appState.responses[index] }));
  const wrong = results.filter((result) => !result.isCorrect);
  const total = appState.session.length;
  const percent = Math.round((appState.correct / total) * 100);
  const bank = new Map(getWrongBank().map((item) => [questionKey(item), item]));
  results.forEach(({ question, isCorrect }) => {
    if (appState.mode === "wrong" && isCorrect) bank.delete(questionKey(question));
    else if (!isCorrect) bank.set(questionKey(question), question);
  });
  await saveWrongBank([...bank.values()]).catch((error) => console.warn("Aviation wrong-bank save failed", error));
  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    book: appState.book,
    chapter: appState.chapter,
    bookLabel: bookName(appState.book),
    chapterLabel: chapterName(appState.book, appState.chapter),
    correct: appState.correct,
    total,
    percent,
    wrong: wrong.map(({ question, selected }) => ({
      ...question,
      selected,
    })),
  };
  await saveHistory(entry);
  $("#result-percent").textContent = `${percent}%`;
  $("#result-title").textContent = percent >= 80 ? "Strong work. Keep the edge sharp." : "Review the misses, then fly it again.";
  $("#result-summary").textContent = `${appState.correct} correct out of ${total}. ${wrong.length} question${wrong.length === 1 ? "" : "s"} saved for review.`;
  $("#review-wrong").hidden = wrong.length === 0;
  renderWrong(wrong);
  showView("results-view");
}

function renderWrong(results) {
  $("#wrong-list").innerHTML = results.map(({ question, selected }) => `
    <details class="wrong-item">
      <summary>${escapeHtml(question.q)}</summary>
      <p><strong>Your answer:</strong> ${escapeHtml(question.opts[selected] || "No answer")}</p>
      <p><strong>Correct answer:</strong> ${escapeHtml(question.opts[question.ans])}</p>
      <p>${escapeHtml(question.exp || "")}</p>
    </details>
  `).join("");
}

function renderHistory() {
  const history = getHistory();
  $("#last-score").textContent = history.length ? `${history[0].percent}%` : "—";
  $("#history-list").innerHTML = history.length ? history.map((entry) => `
    <div class="history-item">
      <strong>${entry.percent}% · ${entry.correct}/${entry.total}</strong>
      <span>${(entry.wrong || []).length} missed</span>
      <small>${new Date(entry.date).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small>
      <small>${escapeHtml(entry.bookLabel || bookName(entry.book))} · ${escapeHtml(entry.chapterLabel || chapterName(entry.book, entry.chapter))}</small>
    </div>
  `).join("") : '<p class="empty">Your completed tests will appear here.</p>';
}

function searchKnowledge(query) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return Object.keys(books).flatMap(allQuestions).map((question) => {
    const haystack = `${question.q} ${question.exp || ""} ${(question.opts || []).join(" ")}`.toLowerCase();
    const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
    return { question, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
}

function renderSearchResults(query) {
  const matches = searchKnowledge(query);
  $("#aviation-search-results").innerHTML = matches.length ? matches.map(({ question }) => `
    <article class="search-result">
      <h3>${escapeHtml(question.q)}</h3>
      <p>${escapeHtml(question.exp || "No explanation available.")}</p>
    </article>
  `).join("") : '<p class="empty">No matching study notes found.</p>';
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

$("#aviation-unlock-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = $("#aviation-password").value;
  const hash = await digest(password);
  if (hash === ADMIN_HASH) {
    try {
      if (!musicCloud.isSignedIn()) await musicCloud.signIn(CLOUD_ADMIN_EMAIL, password);
      sessionStorage.setItem("anthony_admin_unlocked", "1");
      $("#aviation-password-error").textContent = "";
      $("#aviation-password").value = "";
      ensureAdmin();
      await loadHistoryFromCloud();
      await loadWrongBank();
    } catch (error) { $("#aviation-password-error").textContent = `Cloud sign-in failed: ${error.message}`; }
  } else {
    $("#aviation-password-error").textContent = "That admin password did not match.";
  }
});

$("#book-select").addEventListener("change", populateChapters);
$("#chapter-select").addEventListener("change", updateAvailability);
$("#start-test").addEventListener("click", () => startTest());
$("#start-wrong-bank").addEventListener("click", () => startTest(getWrongBank(), { mode: "wrong", book: "wrong", chapter: "saved" }));
$("#answer-options").addEventListener("click", (event) => {
  const option = event.target.closest(".answer-option");
  if (option) selectAnswer(Number(option.dataset.index));
});
$("#check-answer").addEventListener("click", checkAnswer);
$("#next-question").addEventListener("click", nextQuestion);
$("#previous-question").addEventListener("click", previousQuestion);
$("#exit-test").addEventListener("click", () => showView("setup-view"));
$("#new-test").addEventListener("click", () => showView("setup-view"));
$("#review-wrong").addEventListener("click", () => $("#wrong-list").scrollIntoView({ behavior: "smooth" }));
$("#clear-history").addEventListener("click", async () => {
  if (!ensureAdmin()) return;
  if (confirm("Clear aviation score history on every synced device?")) {
    localStorage.removeItem(HISTORY_KEY);
    if (musicCloud.isSignedIn()) await musicCloud.clearTestAttempts("aviation").catch((error) => console.warn("Cloud clear failed", error));
    renderHistory();
  }
});
$("#aviation-search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderSearchResults($("#aviation-search").value);
});

populateChapters();
renderHistory();
renderWrongBank();
ensureAdmin();
loadHistoryFromCloud();
loadWrongBank();
