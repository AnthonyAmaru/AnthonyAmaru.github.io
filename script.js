const VISITOR_HASH = "5723360ef11043a879520412e9ad897e0ebcb99cc820ec363bfecc9d751a1a99";
const ADMIN_HASH = "1e67aef3b01e797309c5588def71607f40a4facc6b8993af9a62306f727a2e5a";
const CLOUD_ADMIN_EMAIL = "anthonyamaru93@gmail.com";
const MUSIC_PLAYER_STATE_KEY = "anthony_music_player_state_v1";
const KEYS = {
  theme: "anthony_portal_theme",
  resume: "anthony_resume_v1",
  book: "anthony_book_workbook_v1",
  playlists: "anthony_music_playlists_v1",
  connector: "anthony_private_gateway_v1",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let pendingAdminResolve = null;
let adminPasswordForSession = null;
let toastTimer = null;
let bookSaveTimer = null;
let bookCloudSaveTimer = null;
let bookCloudSaveGeneration = 0;
let currentBookChapter = 0;
let currentBookPage = 0;
let bookEditorReady = false;
let currentPlaylist = "all";
let tracks = [];
let visibleTracks = [];
let currentTrackId = null;
let playerStateRestored = false;
const selectedTrackIds = new Set();

const resumeDefaults = {
  work: [
    {
      title: "Forward Deployed Engineer",
      organization: "Bitwave · Full-time",
      dates: "Jan 2023 — Present",
      location: "Remote",
      mark: "B",
      description: "Manage sensitive digital asset accounting and blockchain transaction data for enterprise clients.\nWrite and manipulate SQL queries to analyze, reconcile, and validate financial transaction records.\nSupport customers with accounting reporting issues and transaction investigations across multiple blockchain networks.\nMeet directly with clients to review transaction activity, resolve discrepancies, and provide operational support.\nDesign and improve UI workflows and internal tools to enhance customer experience and reporting efficiency.",
    },
    {
      title: "Business Owner",
      organization: "Healthcare Products Florida Inc · Self-employed",
      dates: "Aug 2020 — Mar 2023",
      location: "Miami, Florida · On-site",
      mark: "HP",
      description: "Founded and managed a medical equipment distribution company focused on respiratory and mobility solutions.\nOversaw international logistics, wholesale distribution, e-commerce operations, and digital marketing.\nLed online retail expansion, vendor sourcing, nationwide sales, fulfillment, and customer acquisition.",
    },
  ],
  education: [
    { title: "Bachelor's degree, Computer Science", organization: "Florida International University", dates: "", location: "", mark: "FIU", description: "" },
    { title: "Associate's degree, Computer Science", organization: "Miami Dade College", dates: "", location: "", mark: "MDC", description: "" },
  ],
};

const BOOK_CLOUD_KEY = "hypothesis_of_man_workbook_v2";
const bookDefaults = window.HYPOTHESIS_BOOK_DEFAULTS || {
  version: 2,
  title: "A Hypothesis of Man",
  updatedAt: null,
  chapters: ["Chapter 1 — Genesis"].map((title, index) => ({
    id: `chapter-${index + 1}`,
    title,
    pages: [{ id: `chapter-${index + 1}-page-1`, content: "" }],
  })),
};

async function digest(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function toast(message) {
  const element = $("#toast");
  element.textContent = message;
  element.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("visible"), 2800);
}

function setModalOpen(open) {
  document.body.classList.toggle("modal-open", open);
}

function showPortal() {
  $("#entry-gate").hidden = true;
  $("#portal").hidden = false;
  refreshDashboard();
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(KEYS.theme, next);
  $("#theme-toggle span").textContent = next === "dark" ? "☀" : "☾";
  $("meta[name='theme-color']").setAttribute("content", next === "dark" ? "#11161c" : "#f2f4f6");
}

function routeTo(route) {
  const page = $("[data-page='" + route + "']");
  if (!page) return;
  $("#go-back-button").hidden = route === "home";
  $$(".page-panel").forEach((panel) => panel.classList.toggle("active", panel === page));
  $$(".nav-link").forEach((link) => {
    const active = link.dataset.pageLink === route;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  $("#primary-nav").classList.remove("open");
  $("#mobile-menu-button").setAttribute("aria-expanded", "false");
  if (route === "music") renderMusic();
  if (route === "resume") renderResume();
  if (route === "interests") refreshDashboard();
}

function portalRouteFromUrl(url = new URL(location.href)) {
  const requested = url.searchParams.get("page");
  return ["resume", "interests", "music"].includes(requested) ? requested : "home";
}

function navigatePortal(route, replace = false) {
  routeTo(route);
  const url = new URL(location.href);
  if (route === "home") url.searchParams.delete("page");
  else url.searchParams.set("page", route);
  url.searchParams.delete("v");
  history[replace ? "replaceState" : "pushState"]({ portalRoute: route }, "", url);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function adminIsUnlocked() {
  return sessionStorage.getItem("anthony_admin_unlocked") === "1";
}

function updateAdminStatus() {
  const chip = $("#admin-status");
  const connected = Boolean(window.musicCloud?.isSignedIn());
  chip.classList.toggle("unlocked", connected);
  $("span:last-child", chip).textContent = connected ? "Cloud synced" : "Cloud locked";
}

function ensureAdmin() {
  if (adminIsUnlocked()) return Promise.resolve(true);
  $("#admin-modal").hidden = false;
  $("#admin-error").textContent = "";
  $("#admin-password").value = "";
  setModalOpen(true);
  requestAnimationFrame(() => $("#admin-password").focus());
  return new Promise((resolve) => { pendingAdminResolve = resolve; });
}

function closeAdminModal(result = false) {
  $("#admin-modal").hidden = true;
  setModalOpen(false);
  if (pendingAdminResolve) pendingAdminResolve(result);
  pendingAdminResolve = null;
}

async function ensureCloudMusicAdmin() {
  if (musicCloud.isSignedIn()) return true;
  if (!adminPasswordForSession) sessionStorage.removeItem("anthony_admin_unlocked");
  if (!(await ensureAdmin())) return false;
  if (!adminPasswordForSession) return false;
  try {
    await musicCloud.signIn(CLOUD_ADMIN_EMAIL, adminPasswordForSession);
    toast("Cloud workspace unlocked for this session.");
    return true;
  } catch (error) {
    adminPasswordForSession = null;
    toast(error.message);
    return false;
  }
}

function getResume() {
  const data = readJson(KEYS.resume, resumeDefaults);
  if (data.work?.length === 1 && data.work[0]?.title === "Add your first work role") return structuredClone(resumeDefaults);
  if (!Array.isArray(data.work)) data.work = [];
  if (!Array.isArray(data.education)) data.education = [];
  const formerBitwaveRole = data.work.find((entry) => entry.title === "Data Specialist" && String(entry.organization || "").toLowerCase().includes("bitwave"));
  if (formerBitwaveRole) {
    formerBitwaveRole.title = "Forward Deployed Engineer";
    writeJson(KEYS.resume, data);
  }
  return data;
}

function organizationLogo(entry) {
  const organization = String(entry.organization || "").toLowerCase();
  if (organization.includes("bitwave")) return { src: "logos/bitwave.webp", className: "bitwave" };
  if (organization.includes("healthcare products florida")) return { symbol: "+", className: "medical" };
  if (organization.includes("florida international university")) return { src: "logos/fiu.png", className: "fiu" };
  if (organization.includes("miami dade college")) return { src: "logos/miami-dade-college.jpg", className: "mdc" };
  return null;
}

function organizationMark(entry) {
  const logo = organizationLogo(entry);
  if (logo?.symbol) return `<div class="company-mark logo-${logo.className}" aria-hidden="true"><span>${escapeHtml(logo.symbol)}</span></div>`;
  if (logo) return `<div class="company-mark has-logo logo-${logo.className}" aria-hidden="true"><img src="${logo.src}" alt="" /></div>`;
  return `<div class="company-mark" aria-hidden="true">${escapeHtml(entry.mark || entry.organization?.slice(0, 1) || "•")}</div>`;
}

function renderResume() {
  const resume = getResume();
  $("#work-list").innerHTML = resume.work.length ? resume.work.map((entry) => `
    <article class="timeline-item">
      ${organizationMark(entry)}
      <div class="timeline-copy"><h3>${escapeHtml(entry.title)}</h3><p class="organization">${escapeHtml(entry.organization)}</p><p class="timeline-meta">${escapeHtml(entry.dates)}${entry.location ? ` · ${escapeHtml(entry.location)}` : ""}</p>${entry.description ? `<details class="resume-details"><summary>Responsibilities</summary><ul>${String(entry.description).split("\n").filter(Boolean).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></details>` : ""}</div>
    </article>`).join("") : '<p class="empty-state">No work experience added yet.</p>';
  $("#education-list").innerHTML = resume.education.length ? resume.education.map((entry) => `
    <article class="education-item">
      ${organizationMark(entry)}<h3>${escapeHtml(entry.organization)}</h3><p class="organization">${escapeHtml(entry.title)}</p>${entry.dates || entry.location ? `<p class="meta">${escapeHtml(entry.dates)}${entry.location ? ` · ${escapeHtml(entry.location)}` : ""}</p>` : ""}
    </article>`).join("") : '<p class="empty-state">No education added yet.</p>';
}

function createBookPage(content = "", extras = {}) {
  const id = crypto.randomUUID ? `page-${crypto.randomUUID()}` : `page-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return { id, content, ...extras };
}

function normalizeBook(rawBook) {
  const defaults = structuredClone(bookDefaults);
  if (!rawBook || !Array.isArray(rawBook.chapters) || !rawBook.chapters.length) return defaults;
  const sourceVersion = Number(rawBook.version || 1);
  const usedDefaultIds = new Set();
  const chapters = rawBook.chapters.map((chapter, index) => {
    const fallback = defaults.chapters.find((item) => item.id === chapter.id || item.title === chapter.title) || defaults.chapters[index];
    if (fallback) usedDefaultIds.add(fallback.id);
    let pages;
    if (Array.isArray(chapter.pages) && chapter.pages.length) {
      pages = chapter.pages.map((page, pageIndex) => ({
        id: page.id || `${chapter.id || `chapter-${index + 1}`}-page-${pageIndex + 1}`,
        content: typeof page.content === "string" ? page.content : "",
        ...(page.image ? { image: page.image, imageAlt: page.imageAlt || "Chapter figure" } : {}),
      }));
    } else {
      const legacyContent = typeof chapter.content === "string" ? chapter.content : "";
      const fallbackPage = fallback?.pages?.[0];
      const useImportedNotes = sourceVersion < 2 && !legacyContent.trim() && fallbackPage;
      pages = [{
        id: `${chapter.id || fallback?.id || `chapter-${index + 1}`}-page-1`,
        content: useImportedNotes ? fallbackPage.content : legacyContent,
        ...(fallbackPage?.image ? { image: fallbackPage.image, imageAlt: fallbackPage.imageAlt || "Chapter figure" } : {}),
      }];
    }
    return {
      id: chapter.id || fallback?.id || `chapter-${Date.now()}-${index}`,
      title: chapter.title || fallback?.title || `Chapter ${index + 1}`,
      pages,
    };
  });
  defaults.chapters.forEach((chapter) => {
    if (!usedDefaultIds.has(chapter.id)) chapters.push(chapter);
  });
  return {
    version: 2,
    title: rawBook.title || defaults.title,
    updatedAt: rawBook.updatedAt || null,
    chapters,
  };
}

function getBook() {
  const rawBook = readJson(KEYS.book, null);
  const book = normalizeBook(rawBook);
  if (!rawBook || Number(rawBook.version || 1) < 2 || rawBook.chapters?.some((chapter) => !Array.isArray(chapter.pages))) {
    writeJson(KEYS.book, book);
  }
  return book;
}

function setBookUpdatedTime(book) {
  if (!book.updatedAt) return $("#book-updated").textContent = "Not edited yet";
  $("#book-updated").textContent = `Updated ${new Date(book.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function queueBookCloudSave(book) {
  clearTimeout(bookCloudSaveTimer);
  const generation = ++bookCloudSaveGeneration;
  if (!window.musicCloud?.isSignedIn()) {
    $("#book-save-status").textContent = "Saved on this device";
    return;
  }
  $("#book-save-status").textContent = "Saving to cloud…";
  const snapshot = structuredClone(book);
  bookCloudSaveTimer = setTimeout(async () => {
    try {
      await musicCloud.saveContent("anthony", BOOK_CLOUD_KEY, snapshot);
      if (generation === bookCloudSaveGeneration) $("#book-save-status").textContent = "Saved to cloud";
    } catch (error) {
      if (generation === bookCloudSaveGeneration) $("#book-save-status").textContent = "Saved on device · cloud unavailable";
      console.warn("Book cloud save failed", error);
    }
  }, 850);
}

function saveBook(book, status, syncCloud = true) {
  book.version = 2;
  book.updatedAt = new Date().toISOString();
  writeJson(KEYS.book, book);
  $("#book-save-status").textContent = status || (musicCloud.isSignedIn() ? "Saving to cloud…" : "Saved on this device");
  setBookUpdatedTime(book);
  if (syncCloud) queueBookCloudSave(book);
  refreshDashboard();
}

function bookContentSignature(book) {
  return JSON.stringify(book.chapters.map((chapter) => ({
    title: chapter.title,
    pages: chapter.pages.map((page) => ({ content: page.content || "", image: page.image || "" })),
  })));
}

async function syncBookFromCloud() {
  const localBook = getBook();
  if (!musicCloud.isSignedIn()) return localBook;
  $("#book-save-status").textContent = "Loading cloud copy…";
  try {
    const row = await musicCloud.getContent("anthony", BOOK_CLOUD_KEY);
    if (!row?.value) {
      const seeded = { ...localBook, updatedAt: localBook.updatedAt || new Date().toISOString() };
      await musicCloud.saveContent("anthony", BOOK_CLOUD_KEY, seeded);
      writeJson(KEYS.book, seeded);
      $("#book-save-status").textContent = "Saved to cloud";
      return seeded;
    }
    const cloudBook = normalizeBook(row.value);
    cloudBook.updatedAt = cloudBook.updatedAt || row.updated_at;
    const localTime = Date.parse(localBook.updatedAt || 0);
    const cloudTime = Date.parse(cloudBook.updatedAt || 0);
    const defaultSignature = bookContentSignature(normalizeBook(bookDefaults));
    const localHasWriting = bookContentSignature(localBook) !== defaultSignature;
    const cloudHasWriting = bookContentSignature(cloudBook) !== defaultSignature;
    if ((localHasWriting && !cloudHasWriting) || localTime > cloudTime) {
      await musicCloud.saveContent("anthony", BOOK_CLOUD_KEY, localBook);
      $("#book-save-status").textContent = "Saved to cloud";
      return localBook;
    }
    writeJson(KEYS.book, cloudBook);
    $("#book-save-status").textContent = "Cloud copy loaded";
    return cloudBook;
  } catch (error) {
    $("#book-save-status").textContent = "Saved on device · cloud unavailable";
    console.warn("Book cloud load failed", error);
    return localBook;
  }
}

function renderChapterList() {
  const book = getBook();
  currentBookChapter = Math.min(currentBookChapter, book.chapters.length - 1);
  $("#chapter-list").innerHTML = book.chapters.map((chapter, index) => `<button class="chapter-button ${index === currentBookChapter ? "active" : ""}" type="button" data-chapter-index="${index}"><span>${escapeHtml(chapter.title)}</span><small>${chapter.pages.length}p</small></button>`).join("");
}

function updateBookPageControls(chapter) {
  const total = chapter.pages.length;
  $("#book-page-position").textContent = `Page ${currentBookPage + 1} of ${total}`;
  $("#book-prev-page").disabled = currentBookPage === 0;
  $("#book-next-page").disabled = currentBookPage >= total - 1;
  const page = chapter.pages[currentBookPage];
  const figure = $("#book-page-figure");
  figure.hidden = !page.image;
  if (page.image) {
    $("#book-page-image").src = page.image;
    $("#book-page-image").alt = page.imageAlt || "Chapter figure";
  } else {
    $("#book-page-image").removeAttribute("src");
    $("#book-page-image").alt = "";
  }
}

function commitBookEditor(syncCloud = true) {
  if (!bookEditorReady) return getBook();
  clearTimeout(bookSaveTimer);
  const book = getBook();
  const chapter = book.chapters[currentBookChapter];
  const page = chapter?.pages?.[currentBookPage];
  if (!chapter || !page) return book;
  chapter.title = $("#book-chapter-title").value.trim() || "Untitled chapter";
  page.content = $("#book-chapter-content").value;
  saveBook(book, undefined, syncCloud);
  renderChapterList();
  return book;
}

function loadBookChapter(index, pageIndex = 0, commitCurrent = true) {
  if (commitCurrent) commitBookEditor();
  const book = getBook();
  const chapter = book.chapters[index];
  if (!chapter) return;
  currentBookChapter = index;
  currentBookPage = Math.max(0, Math.min(pageIndex, chapter.pages.length - 1));
  $("#book-chapter-title").value = chapter.title;
  $("#book-chapter-content").value = chapter.pages[currentBookPage].content || "";
  bookEditorReady = true;
  updateBookCounts();
  updateBookPageControls(chapter);
  setBookUpdatedTime(book);
  renderChapterList();
  $(".chapter-rail").classList.remove("open");
}

function updateBookCounts() {
  const content = $("#book-chapter-content").value.trim();
  const words = content ? content.split(/\s+/).length : 0;
  $("#book-word-count").textContent = `${words.toLocaleString()} word${words === 1 ? "" : "s"}`;
}

function queueBookSave() {
  $("#book-save-status").textContent = "Saving…";
  updateBookCounts();
  clearTimeout(bookSaveTimer);
  bookSaveTimer = setTimeout(() => commitBookEditor(), 420);
}

async function openBookStudio() {
  if (!(await ensureCloudMusicAdmin())) return;
  await syncBookFromCloud();
  $("#book-modal").hidden = false;
  setModalOpen(true);
  currentBookChapter = 0;
  currentBookPage = 0;
  bookEditorReady = false;
  renderChapterList();
  loadBookChapter(0, 0, false);
  updateConnectorStatus();
}

function closeBookStudio() {
  commitBookEditor();
  bookEditorReady = false;
  $("#book-modal").hidden = true;
  setModalOpen(false);
}

function parseMarkdownBook(text) {
  const matches = [...text.matchAll(/^##\s+(.+)$/gm)];
  if (!matches.length) return [{ id: `chapter-${Date.now()}`, title: "Imported manuscript", pages: [createBookPage(text.trim())] }];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    const section = text.slice(start, end).trim();
    const pageMatches = [...section.matchAll(/^###\s+Page\s+\d+\s*$/gmi)];
    const pages = pageMatches.length ? pageMatches.map((pageMatch, pageIndex) => {
      const pageStart = pageMatch.index + pageMatch[0].length;
      const pageEnd = pageMatches[pageIndex + 1]?.index ?? section.length;
      return createBookPage(section.slice(pageStart, pageEnd).trim());
    }) : [createBookPage(section)];
    return { id: `chapter-${Date.now()}-${index}`, title: match[1].trim(), pages };
  });
}

async function importBookFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    let imported;
    if (file.name.toLowerCase().endsWith(".json")) {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.chapters)) throw new Error("The backup does not contain a chapters list.");
      imported = normalizeBook(parsed);
    } else {
      imported = normalizeBook({ version: 2, title: "A Hypothesis of Man", updatedAt: null, chapters: parseMarkdownBook(text) });
    }
    saveBook(imported);
    currentBookChapter = 0;
    currentBookPage = 0;
    bookEditorReady = false;
    renderChapterList();
    loadBookChapter(0, 0, false);
    toast(`Imported ${imported.chapters.length} section${imported.chapters.length === 1 ? "" : "s"}.`);
  } catch (error) {
    toast(`Import failed: ${error.message}`);
  }
}

function downloadFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportBookJson() {
  commitBookEditor();
  downloadFile("A_Hypothesis_of_Man_backup.json", JSON.stringify(getBook(), null, 2), "application/json");
  toast("Private book backup downloaded.");
}

function exportBookMarkdown() {
  commitBookEditor();
  const book = getBook();
  const markdown = `# ${book.title}\n\n${book.chapters.map((chapter) => `## ${chapter.title}\n\n${chapter.pages.map((page, index) => `${chapter.pages.length > 1 ? `### Page ${index + 1}\n\n` : ""}${page.content || ""}`).join("\n\n")}`).join("\n\n")}`;
  downloadFile("A_Hypothesis_of_Man.md", markdown, "text/markdown");
  toast("Markdown manuscript downloaded.");
}

async function sendChapterToAssistant() {
  if (!(await ensureCloudMusicAdmin())) return;
  commitBookEditor();
  const book = getBook();
  const chapter = book.chapters[currentBookChapter];
  const page = chapter?.pages?.[currentBookPage];
  if (!page || !confirm("Send this page to Big Pickle? During its free period, submitted text may be collected and used to improve the model.")) return;
  const button = $("#send-to-assistant");
  button.disabled = true;
  button.textContent = "Sending securely…";
  try {
    const result = await musicCloud.invokeFunction("big-pickle", { scope: "book", action: "edit", chapter: { title: chapter.title, page: currentBookPage + 1, content: page.content } });
    if (typeof result.content !== "string") throw new Error("Gateway response did not include revised content.");
    if (confirm("Big Pickle returned a revision. Replace this page with it?")) {
      page.content = result.content;
      saveBook(book, "AI revision saving to cloud");
      $("#book-chapter-content").value = page.content;
      updateBookCounts();
    }
  } catch (error) {
    toast(`Assistant connection failed: ${error.message}`);
  } finally {
    updateConnectorStatus();
  }
}

function updateConnectorStatus() {
  const status = $("#connector-status");
  if (status) {
    status.textContent = "Ready";
    status.classList.add("connected");
  }
  const send = $("#send-to-assistant");
  if (send) {
    send.disabled = false;
    send.textContent = "Send page to Big Pickle";
  }
}

function toggleQuickAi(force) {
  const popover = $("#quick-ai-popover");
  const toggle = $("#quick-ai-toggle");
  const open = typeof force === "boolean" ? force : popover.hidden;
  popover.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
  if (open) {
    $("#dock-expanded").hidden = true;
    $("#dock-toggle").setAttribute("aria-expanded", "false");
    requestAnimationFrame(() => $("#quick-ai-input").focus());
  }
}

async function invokeAnthonyAi(body) {
  try {
    return await musicCloud.invokeFunction("big-pickle", body);
  } catch (error) {
    if (error.status !== 401) throw error;
    await musicCloud.signOut();
    adminPasswordForSession = null;
    sessionStorage.removeItem("anthony_admin_unlocked");
    updateAdminStatus();
    if (!(await ensureCloudMusicAdmin())) throw new Error("Administrator sign-in is required.");
    return musicCloud.invokeFunction("big-pickle", body);
  }
}

async function askQuickAi(event) {
  event.preventDefault();
  const input = $("#quick-ai-input");
  const question = input.value.trim();
  if (!question || !(await ensureCloudMusicAdmin())) return;
  const topic = $("#quick-ai-topic").value;
  const scope = { Aviation: "aviation", Mandarin: "mandarin", Book: "book-chat" }[topic] || "anthony";
  const answer = $("#quick-ai-answer");
  const send = $("#quick-ai-send");
  answer.hidden = false;
  answer.textContent = "Thinking…";
  send.disabled = true;
  try {
    const result = await invokeAnthonyAi({ scope, topic, message: question });
    if (typeof result.content !== "string") throw new Error("The AI response was empty.");
    answer.textContent = result.content.trim();
  } catch (error) {
    answer.textContent = `I couldn't answer that: ${error.message}`;
  } finally {
    send.disabled = false;
    input.focus();
  }
}

async function renderMusic() {
  const previousBulkPlaylist = $("#bulk-playlist-select").value;
  let playlists = [];
  let cloudError = "";
  try {
    const library = await musicCloud.list("anthony");
    tracks = library.tracks;
    playlists = library.playlists;
  } catch (error) {
    tracks = [];
    cloudError = error.message;
  }
  $("#all-track-count").textContent = tracks.length;
  $("#playlist-list").innerHTML = playlists.map((playlist) => `<button class="playlist-row ${currentPlaylist === String(playlist.id) ? "active" : ""}" type="button" data-playlist="${playlist.id}"><span>♬</span><strong>${escapeHtml(playlist.name)}</strong><small>${tracks.filter((track) => track.playlist_id === playlist.id).length}</small></button>`).join("");
  $$(".playlist-row[data-playlist='all']").forEach((button) => button.classList.toggle("active", currentPlaylist === "all"));
  const selectedPlaylist = playlists.find((playlist) => String(playlist.id) === currentPlaylist);
  visibleTracks = currentPlaylist === "all" ? tracks : tracks.filter((track) => track.playlist_id === selectedPlaylist?.id);
  const availableIds = new Set(tracks.map((track) => String(track.id)));
  [...selectedTrackIds].forEach((id) => { if (!availableIds.has(id)) selectedTrackIds.delete(id); });
  $("#library-title").textContent = currentPlaylist === "all" ? "All music" : selectedPlaylist?.name || "Playlist";
  const playlistOptions = playlists.map((playlist) => `<option value="${playlist.id}">${escapeHtml(playlist.name)}</option>`).join("");
  $("#bulk-playlist-select").innerHTML = `<option value="">Playlist</option>${playlistOptions}`;
  if (playlists.some((playlist) => String(playlist.id) === previousBulkPlaylist)) $("#bulk-playlist-select").value = previousBulkPlaylist;
  $("#track-list").innerHTML = cloudError ? `<div class="library-empty"><p>Cloud library unavailable.</p><small>${escapeHtml(cloudError)}</small></div>` : visibleTracks.length ? visibleTracks.map((track) => {
    return `<article class="track-row"><input class="track-select" type="checkbox" data-select-track="${track.id}" aria-label="Select ${escapeHtml(track.title)}" ${selectedTrackIds.has(String(track.id)) ? "checked" : ""} /><button class="track-play" type="button" data-play-track="${track.id}" aria-label="Play ${escapeHtml(track.title)}">▶</button><div class="track-copy"><strong>${escapeHtml(track.title)}</strong><small>${formatBytes(track.size_bytes)}</small></div><select data-assign-track="${track.id}" aria-label="Move ${escapeHtml(track.title)} to playlist"><option value="">No playlist</option>${playlistOptions}</select><button class="track-delete" type="button" data-delete-track="${track.id}" aria-label="Delete ${escapeHtml(track.title)}">×</button></article>`;
  }).join("") : '<div class="library-empty"><p>No songs here yet.</p><small>Add audio files from your device to begin.</small></div>';
  $$('[data-assign-track]').forEach((select) => { const track = tracks.find((item) => item.id === select.dataset.assignTrack); select.value = track?.playlist_id || ""; });
  updateTrackSelectionControls();
  renderDock();
  restoreMusicPlayerState();
}

function updateTrackSelectionControls() {
  const selectAll = $("#select-all-tracks");
  const deleteButton = $("#delete-selected-tracks");
  const bulkSelect = $("#bulk-playlist-select");
  const assignButton = $("#assign-selected-tracks");
  const visibleIds = visibleTracks.map((track) => String(track.id));
  const selectedVisible = visibleIds.filter((id) => selectedTrackIds.has(id)).length;
  selectAll.disabled = visibleIds.length === 0;
  selectAll.checked = visibleIds.length > 0 && selectedVisible === visibleIds.length;
  selectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
  deleteButton.disabled = selectedTrackIds.size === 0;
  deleteButton.textContent = selectedTrackIds.size ? `Delete ${selectedTrackIds.size}` : "Delete";
  bulkSelect.disabled = bulkSelect.options.length <= 1;
  assignButton.disabled = selectedTrackIds.size === 0 || !bulkSelect.value;
  assignButton.textContent = selectedTrackIds.size ? `Add ${selectedTrackIds.size}` : "Add selected";
}

function renderDock() {
  const select = $("#dock-track-select");
  select.innerHTML = tracks.length ? '<option value="">Choose a song</option>' + tracks.map((track) => `<option value="${track.id}">${escapeHtml(track.title)}</option>`).join("") : '<option value="">No music added yet</option>';
  if (currentTrackId) select.value = String(currentTrackId);
}

function readMusicPlayerState() {
  try { return JSON.parse(sessionStorage.getItem(MUSIC_PLAYER_STATE_KEY)) || null; } catch { return null; }
}

function saveMusicPlayerState() {
  const track = tracks.find((item) => String(item.id) === String(currentTrackId));
  if (!track) return;
  const audio = $("#audio-player");
  sessionStorage.setItem(MUSIC_PLAYER_STATE_KEY, JSON.stringify({ trackId: String(track.id), title: track.title, currentTime: Number(audio.currentTime || 0), playing: !audio.paused }));
}

function restoreMusicPlayerState() {
  if (playerStateRestored) return;
  playerStateRestored = true;
  const saved = readMusicPlayerState();
  const track = tracks.find((item) => String(item.id) === String(saved?.trackId));
  if (!track) return;
  currentTrackId = String(track.id);
  const audio = $("#audio-player");
  audio.src = track.url;
  $("#dock-title").textContent = track.title;
  $("#dock-track-select").value = String(track.id);
  if (Number(saved.currentTime) > 0) {
    const seek = () => { audio.currentTime = Math.min(Number(saved.currentTime), Number.isFinite(audio.duration) ? audio.duration : Number(saved.currentTime)); };
    if (audio.readyState >= 1) seek(); else audio.addEventListener("loadedmetadata", seek, { once: true });
  }
  if (saved.playing) audio.play().catch(() => {});
  updatePlayButton();
}

async function playTrack(id) {
  const track = tracks.find((item) => item.id === String(id));
  if (!track) return;
  currentTrackId = track.id;
  const audio = $("#audio-player");
  audio.src = track.url;
  $("#dock-title").textContent = track.title;
  $("#dock-track-select").value = String(track.id);
  try { await audio.play(); } catch { toast("Tap play to start this song."); }
  updatePlayButton();
  saveMusicPlayerState();
}

function updatePlayButton() {
  $("#dock-play").textContent = $("#audio-player").paused ? "▶" : "❚❚";
}

function stepTrack(direction) {
  const pool = visibleTracks.length ? visibleTracks : tracks;
  if (!pool.length) return;
  const index = Math.max(0, pool.findIndex((track) => track.id === currentTrackId));
  playTrack(pool[(index + direction + pool.length) % pool.length].id);
}

async function addMusicFiles(files) {
  const audioFiles = files.filter((file) => file.type.startsWith("audio/") || /\.(mp3|m4a|aac|wav|ogg|oga|flac|opus|webm)$/i.test(file.name));
  if (!audioFiles.length) return toast("Choose one or more audio files.");
  if (!(await ensureCloudMusicAdmin())) return;
  let added = 0;
  let duplicates = 0;
  for (const file of audioFiles) {
    try {
      const result = await musicCloud.upload("anthony", file);
      if (result?.duplicate) duplicates += 1;
      else added += 1;
    } catch (error) { toast(`Could not upload ${file.name}: ${error.message}`); }
  }
  const skipped = files.length - audioFiles.length;
  toast(`${added} song${added === 1 ? "" : "s"} uploaded.${duplicates ? ` ${duplicates} duplicate${duplicates === 1 ? " was" : "s were"} skipped.` : ""}${skipped ? ` ${skipped} non-audio file${skipped === 1 ? " was" : "s were"} skipped.` : ""}`);
  await renderMusic();
}

async function assignTrack(trackId, playlistId) {
  if (!(await ensureCloudMusicAdmin())) return renderMusic();
  try {
    await musicCloud.assignTrack(trackId, playlistId || null);
    selectedTrackIds.delete(String(trackId));
    toast(playlistId ? "Song moved to the selected playlist." : "Song removed from playlists.");
    renderMusic();
  } catch (error) { toast(error.message); renderMusic(); }
}

async function assignSelectedTracks() {
  const selected = tracks.filter((track) => selectedTrackIds.has(String(track.id)));
  const playlistId = $("#bulk-playlist-select").value;
  if (!selected.length) return;
  if (!playlistId) return toast("Choose a playlist.");
  if (!(await ensureCloudMusicAdmin())) return;
  const button = $("#assign-selected-tracks");
  button.disabled = true;
  button.textContent = "Adding…";
  try {
    await musicCloud.assignTracks(selected.map((track) => track.id), playlistId);
  } catch (error) {
    toast(error.message);
    return updateTrackSelectionControls();
  }
  selectedTrackIds.clear();
  await renderMusic();
  toast(`${selected.length} song${selected.length === 1 ? "" : "s"} added to the playlist.`);
}

async function deleteTrack(id) {
  if (!(await ensureCloudMusicAdmin()) || !confirm("Delete this song from the cloud library?")) return;
  const track = tracks.find((item) => item.id === String(id));
  if (!track) return;
  try { await musicCloud.deleteTrack(track); } catch (error) { return toast(error.message); }
  selectedTrackIds.delete(String(id));
  if (currentTrackId === id) { $("#audio-player").pause(); currentTrackId = null; sessionStorage.removeItem(MUSIC_PLAYER_STATE_KEY); $("#dock-title").textContent = "Nothing selected"; }
  renderMusic();
}

async function deleteSelectedTracks() {
  const selected = tracks.filter((track) => selectedTrackIds.has(String(track.id)));
  if (!selected.length || !(await ensureCloudMusicAdmin())) return;
  if (!confirm(`Delete ${selected.length} selected song${selected.length === 1 ? "" : "s"} from the cloud library?`)) return;
  try {
    await musicCloud.deleteTracks(selected);
  } catch (error) { return toast(error.message); }
  if (selected.some((track) => String(track.id) === String(currentTrackId))) {
    $("#audio-player").pause();
    currentTrackId = null;
    sessionStorage.removeItem(MUSIC_PLAYER_STATE_KEY);
    $("#dock-title").textContent = "Nothing selected";
  }
  selectedTrackIds.clear();
  await renderMusic();
  toast(`${selected.length} song${selected.length === 1 ? "" : "s"} deleted.`);
}

async function createPlaylist() {
  if (!(await ensureCloudMusicAdmin())) return;
  const name = prompt("Name this playlist:");
  if (!name?.trim()) return;
  try { await musicCloud.createPlaylist("anthony", name.trim()); renderMusic(); } catch (error) { toast(error.message); }
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}

async function openStudyApp(name, needsAdmin) {
  if (needsAdmin && !(await ensureAdmin())) return;
  const apps = {
    aviation: { title: "Aviation practice", src: "aviation/index.html?v=20260804-embed1" },
    mandarin: { title: "Mandarin notebook", src: "mandarin/index.html?v=20260804-embed1" },
    "mandarin-quiz": { title: "Mandarin practice", src: "mandarin/quiz.html?v=20260804-embed1" },
    mycology: { title: "Mycology", src: "mycology.html?v=20260804-embed1" },
    books: { title: "Books", src: "books.html?v=20260804-embed1" },
  };
  const app = apps[name];
  if (!app) return;
  const embeddedUrl = new URL(app.src, location.href);
  embeddedUrl.searchParams.set("embedded", "1");
  $("#app-frame").src = embeddedUrl.href;
  $("#app-modal").hidden = false;
  setModalOpen(true);
}

function closeStudyApp() {
  $("#app-frame").src = "about:blank";
  $("#app-modal").hidden = true;
  setModalOpen(false);
  refreshDashboard();
}

function refreshDashboard() {
  const aviation = readJson("anthony_aviation_history_v1", []);
  const mandarin = readJson("anthony_mandarin_history_v1", []);
  $("#aviation-last-score").textContent = aviation.length ? `${aviation[0].percent}%` : "—";
  $("#aviation-test-count").textContent = aviation.length;
  $("#mandarin-last-score").textContent = mandarin.length ? `${mandarin[0].percent}%` : "—";
  $("#home-aviation-score").textContent = aviation.length ? `${aviation[0].percent}% · ${aviation[0].correct}/${aviation[0].total}` : "No aviation score yet";
  $("#home-mandarin-score").textContent = mandarin.length ? `${mandarin[0].percent}% · ${mandarin[0].correct}/${mandarin[0].total}` : "No Mandarin score yet";
  const rawBook = localStorage.getItem(KEYS.book);
  const book = getBook();
  const pageCount = book.chapters.reduce((total, chapter) => total + chapter.pages.length, 0);
  $("#home-book-status").textContent = rawBook ? `${book.chapters.length} sections · ${pageCount} pages` : "Book ready";
  updateConnectorStatus();
  updateAdminStatus();
}

async function syncStudyHistoryFromCloud() {
  if (!window.musicCloud?.isSignedIn()) return;
  try {
    const [aviationRows, mandarinRows] = await Promise.all([
      musicCloud.listTestAttempts("aviation"),
      musicCloud.listTestAttempts("mandarin"),
    ]);
    writeJson("anthony_aviation_history_v1", aviationRows.map((row) => ({ id: row.id, date: row.completed_at, book: row.mode || "aviation", chapter: row.section || "all", correct: row.correct, total: row.total, percent: row.percent, wrong: row.wrong_answers || [] })));
    writeJson("anthony_mandarin_history_v1", mandarinRows.map((row) => ({ id: row.id, date: row.completed_at, type: row.mode || "mixed", correct: row.correct, total: row.total, percent: row.percent, wrong: row.wrong_answers || [] })));
    refreshDashboard();
  } catch (error) { console.warn("Study history sync failed", error); }
}

/* Event wiring */
$("#entry-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = $("#entry-password").value;
  if (await digest(password) === VISITOR_HASH) {
    sessionStorage.setItem("anthony_visitor_unlocked", "1");
    $("#entry-error").textContent = "";
    $("#entry-password").value = "";
    showPortal();
  } else {
    $("#entry-error").textContent = "That answer did not match.";
  }
});

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[href]");
  if (!link || event.defaultPrevented || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const url = new URL(link.href, location.href);
  const rootPath = location.pathname.replace(/index\.html$/, "");
  if (url.origin !== location.origin || url.pathname.replace(/index\.html$/, "") !== rootPath) return;
  event.preventDefault();
  if (!$("#app-modal").hidden) closeStudyApp();
  if (!$("#book-modal").hidden) closeBookStudio();
  navigatePortal(portalRouteFromUrl(url));
});

window.addEventListener("popstate", () => routeTo(portalRouteFromUrl()));

$("#go-back-button").addEventListener("click", () => {
  if (!$("#app-modal").hidden) return closeStudyApp();
  if (!$("#book-modal").hidden) return closeBookStudio();
  let sameSiteReferrer = false;
  try { sameSiteReferrer = new URL(document.referrer).origin === location.origin; } catch { /* Use the homepage fallback. */ }
  if (history.state?.portalRoute || (sameSiteReferrer && history.length > 1)) history.back();
  else navigatePortal("home", true);
});

$("#theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
$("#mobile-menu-button").addEventListener("click", () => {
  const nav = $("#primary-nav");
  const open = nav.classList.toggle("open");
  $("#mobile-menu-button").setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (event) => {
  const popover = $("#quick-ai-popover");
  if (!popover.hidden && !event.target.closest("#quick-ai-popover") && !event.target.closest("#quick-ai-toggle")) toggleQuickAi(false);
});

$("#admin-status").addEventListener("click", async () => {
  if (musicCloud.isSignedIn()) toast("Cloud synced for this session.");
  else if (await ensureCloudMusicAdmin()) {
    updateAdminStatus();
    toast("Cloud synced.");
  }
});
$("#admin-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = $("#admin-password").value;
  if (await digest(password) === ADMIN_HASH) {
    try {
      if (!musicCloud.isSignedIn()) await musicCloud.signIn(CLOUD_ADMIN_EMAIL, password);
      adminPasswordForSession = password;
      sessionStorage.setItem("anthony_admin_unlocked", "1");
      await syncStudyHistoryFromCloud();
      updateAdminStatus();
      closeAdminModal(true);
    } catch (error) {
      $("#admin-error").textContent = `Cloud sign-in failed: ${error.message}`;
    }
  } else {
    $("#admin-error").textContent = "That admin password did not match.";
  }
});

$$('[data-close-modal]').forEach((button) => button.addEventListener("click", () => {
  const id = button.dataset.closeModal;
  if (id === "admin-modal") closeAdminModal(false);
  else { $("#" + id).hidden = true; setModalOpen(false); }
}));

$$('.launch-app').forEach((button) => button.addEventListener("click", () => openStudyApp(button.dataset.app, button.dataset.admin === "true")));

$("#open-book-studio").addEventListener("click", openBookStudio);
$("#close-book").addEventListener("click", closeBookStudio);
$("#chapter-menu").addEventListener("click", () => $(".chapter-rail").classList.toggle("open"));
$("#chapter-list").addEventListener("click", (event) => { const button = event.target.closest("[data-chapter-index]"); if (button) loadBookChapter(Number(button.dataset.chapterIndex), 0); });
$("#book-chapter-title").addEventListener("input", queueBookSave);
$("#book-chapter-content").addEventListener("input", queueBookSave);
$("#book-prev-page").addEventListener("click", () => loadBookChapter(currentBookChapter, currentBookPage - 1));
$("#book-next-page").addEventListener("click", () => loadBookChapter(currentBookChapter, currentBookPage + 1));
$("#add-book-page").addEventListener("click", () => {
  commitBookEditor();
  const book = getBook();
  const chapter = book.chapters[currentBookChapter];
  if (!chapter) return;
  chapter.pages.push(createBookPage());
  saveBook(book);
  currentBookPage = chapter.pages.length - 1;
  loadBookChapter(currentBookChapter, currentBookPage, false);
  $("#book-chapter-content").focus();
});
$("#add-chapter").addEventListener("click", () => {
  commitBookEditor();
  const title = prompt("New chapter title:");
  if (!title?.trim()) return;
  const book = getBook();
  book.chapters.push({ id: `chapter-${Date.now()}`, title: title.trim(), pages: [createBookPage()] });
  saveBook(book);
  currentBookPage = 0;
  loadBookChapter(book.chapters.length - 1, 0, false);
});
$("#import-book").addEventListener("click", () => $("#book-file-input").click());
$("#book-file-input").addEventListener("change", (event) => { importBookFile(event.target.files[0]); event.target.value = ""; });
$("#export-book-json").addEventListener("click", exportBookJson);
$("#export-book-markdown").addEventListener("click", exportBookMarkdown);
$("#send-to-assistant").addEventListener("click", sendChapterToAssistant);
$("#quick-ai-toggle").addEventListener("click", () => toggleQuickAi());
$("#quick-ai-close").addEventListener("click", () => toggleQuickAi(false));
$("#quick-ai-form").addEventListener("submit", askQuickAi);
$("#quick-ai-input").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  event.currentTarget.form.requestSubmit();
});

$("#new-playlist").addEventListener("click", createPlaylist);
$("#assign-selected-tracks").addEventListener("click", assignSelectedTracks);
$("#bulk-playlist-select").addEventListener("change", updateTrackSelectionControls);
$("#delete-selected-tracks").addEventListener("click", deleteSelectedTracks);
$("#select-all-tracks").addEventListener("change", (event) => {
  visibleTracks.forEach((track) => event.target.checked ? selectedTrackIds.add(String(track.id)) : selectedTrackIds.delete(String(track.id)));
  $$('[data-select-track]').forEach((checkbox) => { checkbox.checked = event.target.checked; });
  updateTrackSelectionControls();
});
$("#add-music").addEventListener("click", async () => { if (await ensureAdmin()) $("#music-file-input").click(); });
$("#choose-music-files").addEventListener("click", async (event) => { event.stopPropagation(); if (await ensureAdmin()) $("#music-file-input").click(); });
$("#music-file-input").addEventListener("change", (event) => { addMusicFiles([...event.target.files]); event.target.value = ""; });
const musicDropZone = $("#music-drop-zone");
musicDropZone.addEventListener("click", async (event) => { if (event.target.closest("button")) return; if (await ensureAdmin()) $("#music-file-input").click(); });
musicDropZone.addEventListener("keydown", async (event) => { if (!["Enter", " "].includes(event.key)) return; event.preventDefault(); if (await ensureAdmin()) $("#music-file-input").click(); });
["dragenter", "dragover"].forEach((eventName) => musicDropZone.addEventListener(eventName, (event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; musicDropZone.classList.add("is-dragging"); }));
["dragleave", "dragend"].forEach((eventName) => musicDropZone.addEventListener(eventName, (event) => { event.preventDefault(); if (eventName === "dragleave" && musicDropZone.contains(event.relatedTarget)) return; musicDropZone.classList.remove("is-dragging"); }));
musicDropZone.addEventListener("drop", (event) => { event.preventDefault(); musicDropZone.classList.remove("is-dragging"); addMusicFiles([...event.dataTransfer.files]); });
$("#page-music").addEventListener("click", (event) => {
  const playlist = event.target.closest("[data-playlist]");
  const play = event.target.closest("[data-play-track]");
  const remove = event.target.closest("[data-delete-track]");
  if (playlist) { selectedTrackIds.clear(); currentPlaylist = playlist.dataset.playlist; renderMusic(); }
  if (play) playTrack(play.dataset.playTrack);
  if (remove) deleteTrack(remove.dataset.deleteTrack);
});
$("#page-music").addEventListener("change", (event) => {
  const select = event.target.closest("[data-assign-track]");
  const checkbox = event.target.closest("[data-select-track]");
  if (select) assignTrack(select.dataset.assignTrack, select.value);
  if (checkbox) {
    if (checkbox.checked) selectedTrackIds.add(String(checkbox.dataset.selectTrack));
    else selectedTrackIds.delete(String(checkbox.dataset.selectTrack));
    updateTrackSelectionControls();
  }
});
$("#dock-toggle").addEventListener("click", () => { const expanded = $("#dock-expanded"); expanded.hidden = !expanded.hidden; $("#dock-toggle").setAttribute("aria-expanded", String(!expanded.hidden)); });
$("#dock-play").addEventListener("click", () => { const audio = $("#audio-player"); if (!audio.src && tracks.length) return playTrack(tracks[0].id); if (audio.paused) audio.play(); else audio.pause(); });
$("#dock-previous").addEventListener("click", () => stepTrack(-1));
$("#dock-next").addEventListener("click", () => stepTrack(1));
$("#dock-track-select").addEventListener("change", (event) => { if (event.target.value) playTrack(event.target.value); });
$("#audio-player").addEventListener("play", () => { updatePlayButton(); saveMusicPlayerState(); });
$("#audio-player").addEventListener("pause", () => { updatePlayButton(); saveMusicPlayerState(); });
$("#audio-player").addEventListener("ended", () => stepTrack(1));
window.addEventListener("pagehide", () => {
  if (bookEditorReady) commitBookEditor(false);
  saveMusicPlayerState();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!$("#quick-ai-popover").hidden) toggleQuickAi(false);
  else if (!$("#app-modal").hidden) closeStudyApp();
  else if (!$("#book-modal").hidden) closeBookStudio();
  else if (!$("#admin-modal").hidden) closeAdminModal(false);
});

/* Initial state */
applyTheme(localStorage.getItem(KEYS.theme) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
renderResume();
renderMusic();
refreshDashboard();
const initialRoute = portalRouteFromUrl();
routeTo(initialRoute);
if (sessionStorage.getItem("anthony_visitor_unlocked") === "1") showPortal();
if (musicCloud.isSignedIn()) syncStudyHistoryFromCloud();
