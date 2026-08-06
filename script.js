const VISITOR_HASH = "5723360ef11043a879520412e9ad897e0ebcb99cc820ec363bfecc9d751a1a99";
const ADMIN_HASH = "1e67aef3b01e797309c5588def71607f40a4facc6b8993af9a62306f727a2e5a";
const CLOUD_ADMIN_EMAIL = "anthonyamaru93@gmail.com";
const MUSIC_PLAYER_STATE_KEY = "anthony_music_player_state_v1";
const BOOK_CHAPTER_SIDEBAR_KEY = "anthony_book_chapter_sidebar_hidden";
const BOOK_SPLIT_PAGES_KEY = "anthony_book_split_pages";
const MANDARIN_WRITING_KEY = "anthony_mandarin_written_words_v1";
const MANDARIN_WRITING_CLOUD_KEY = "mandarin_written_words_v1";
const DETAIL_PAGES = {
  aviation: "aviation/index.html",
  mandarin: "mandarin/index.html",
  mycology: "mycology.html",
  books: "books.html",
  ai: "ai.html",
  fatherhood: "fatherhood.html",
  gym: "gym.html",
  taxes: "taxes.html",
  health: "health.html",
  blockchain: "blockchain.html",
};
const KEYS = {
  theme: "anthony_portal_theme",
  resume: "anthony_resume_v1",
  book: "anthony_book_workbook_v1",
  playlists: "anthony_music_playlists_v1",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function keepFirst(selector, root = document) {
  $$(selector, root).slice(1).forEach((element) => element.remove());
}

function normalizePortalShell() {
  keepFirst("#entry-gate");
  keepFirst("#portal");
  keepFirst(".skip-link");
  const portal = $("#portal");
  if (!portal) return;
  keepFirst(".site-header", portal);
  keepFirst("#music-dock", portal);
  keepFirst("#main-content", portal);
  keepFirst(".site-footer", portal);
}

normalizePortalShell();
window.addEventListener("pageshow", normalizePortalShell);

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
let musicLibraryOpen = false;
const currentArtists = new Set();
let currentSongQuery = "";
let musicSortColumn = "song";
let musicSortDirection = "asc";
let editingTrackId = null;
let musicPlaylists = [];
let musicCloudError = "";
let tracks = [];
let visibleTracks = [];
let playerPlaylist = "all";
let currentTrackId = null;
let playerStateRestored = false;
let shuffleEnabled = false;
let shuffledTrackIds = [];
let musicNavigationHandoff = false;
let bookSplitPages = false;
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
const BOOK_SCHEMA_VERSION = 3;
const bookDefaults = window.HYPOTHESIS_BOOK_DEFAULTS || {
  version: BOOK_SCHEMA_VERSION,
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
  closeDetailPage();
  const page = $("[data-page='" + route + "']");
  if (!page) return;
  $$(".page-panel").forEach((panel) => panel.classList.toggle("active", panel === page));
  $$('[data-page-link]').forEach((link) => {
    const active = link.dataset.pageLink === route;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  $("#primary-nav").classList.remove("open");
  $("#mobile-menu-button").setAttribute("aria-expanded", "false");
  if (route === "music") { musicLibraryOpen = false; renderMusic(); }
  if (route === "resume") renderResume();
  if (route === "interests") refreshDashboard();
}

function detailRouteFromUrl(url = new URL(location.href)) {
  const detail = url.searchParams.get("detail");
  return Object.hasOwn(DETAIL_PAGES, detail) ? detail : null;
}

function setPrimaryNavActive(route) {
  $$('[data-page-link]').forEach((link) => {
    const active = link.dataset.pageLink === route;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
}

function closeDetailPage() {
  const shell = $("#detail-page-shell");
  if (!shell || shell.hidden) return;
  shell.hidden = true;
  $("#main-content").hidden = false;
  $(".site-footer").hidden = false;
}

function showDetailPage(detail) {
  const path = DETAIL_PAGES[detail];
  if (!path) return false;
  $$(".page-panel").forEach((panel) => panel.classList.remove("active"));
  $("#main-content").hidden = true;
  $(".site-footer").hidden = true;
  const shell = $("#detail-page-shell");
  const frame = $("#detail-page-frame");
  shell.hidden = false;
  const target = new URL(path, location.href);
  target.searchParams.set("embedded", "1");
  if (frame.dataset.detail !== detail) {
    frame.dataset.detail = detail;
    frame.src = target.href;
  }
  setPrimaryNavActive("interests");
  $("#primary-nav").classList.remove("open");
  $("#mobile-menu-button").setAttribute("aria-expanded", "false");
  return true;
}

function syncPortalUrl() {
  const detail = detailRouteFromUrl();
  if (detail) showDetailPage(detail); else routeTo(portalRouteFromUrl());
}

function portalRouteFromUrl(url = new URL(location.href)) {
  const requested = url.searchParams.get("page");
  return ["resume", "interests", "music"].includes(requested) ? requested : "home";
}

function navigatePortal(route, replace = false) {
  routeTo(route);
  const url = new URL(location.href);
  url.searchParams.delete("detail");
  if (route === "home") url.searchParams.delete("page");
  else url.searchParams.set("page", route);
  url.searchParams.delete("v");
  history[replace ? "replaceState" : "pushState"]({ portalRoute: route }, "", url);
  window.scrollTo({ top: 0, behavior: "auto" });
}

function navigateDetail(detail) {
  if (!showDetailPage(detail)) return;
  const url = new URL(location.href);
  url.searchParams.delete("page");
  url.searchParams.delete("v");
  url.searchParams.set("detail", detail);
  history.pushState({ detail }, "", url);
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
  if (organization.includes("healthcare products florida")) return { src: "assets/medical-cargo-plane-logo.png?v=1", className: "medical" };
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
      pages = chapter.pages.map((page, pageIndex) => {
        const fallbackPage = fallback?.pages?.[pageIndex] || fallback?.pages?.[0];
        const savedContent = typeof page.content === "string" ? page.content : "";
        const useImportedNotes = sourceVersion < BOOK_SCHEMA_VERSION && !savedContent.trim() && fallbackPage?.content;
        const image = page.image || (sourceVersion < BOOK_SCHEMA_VERSION ? fallbackPage?.image : "");
        return {
          id: page.id || `${chapter.id || `chapter-${index + 1}`}-page-${pageIndex + 1}`,
          content: useImportedNotes ? fallbackPage.content : savedContent,
          ...(image ? { image, imageAlt: page.imageAlt || fallbackPage?.imageAlt || "Chapter figure" } : {}),
        };
      });
    } else {
      const legacyContent = typeof chapter.content === "string" ? chapter.content : "";
      const fallbackPage = fallback?.pages?.[0];
      const useImportedNotes = sourceVersion < BOOK_SCHEMA_VERSION && !legacyContent.trim() && fallbackPage;
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
    version: BOOK_SCHEMA_VERSION,
    title: rawBook.title || defaults.title,
    updatedAt: rawBook.updatedAt || null,
    chapters,
  };
}

function getBook() {
  const rawBook = readJson(KEYS.book, null);
  const book = normalizeBook(rawBook);
  if (!rawBook || Number(rawBook.version || 1) < BOOK_SCHEMA_VERSION || rawBook.chapters?.some((chapter) => !Array.isArray(chapter.pages))) {
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
  book.version = BOOK_SCHEMA_VERSION;
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
    const cloudNeedsUpgrade = Number(row.value.version || 1) < BOOK_SCHEMA_VERSION;
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
    if (cloudNeedsUpgrade) await musicCloud.saveContent("anthony", BOOK_CLOUD_KEY, cloudBook);
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
  const hasSecondPage = bookSplitPages && currentBookPage + 1 < total;
  $("#book-page-position").textContent = hasSecondPage ? `Pages ${currentBookPage + 1}–${currentBookPage + 2} of ${total}` : `Page ${currentBookPage + 1} of ${total}`;
  $("#book-prev-page").disabled = currentBookPage === 0;
  $("#book-next-page").disabled = bookSplitPages ? currentBookPage + 1 >= total - 1 : currentBookPage >= total - 1;
  $("#book-primary-page-label").textContent = `Page ${currentBookPage + 1}`;
  $("#book-secondary-page-label").textContent = `Page ${currentBookPage + 2}`;
  $("#book-secondary-page").hidden = !hasSecondPage;
  $("#book-page-spread").classList.toggle("split", hasSecondPage);
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
  if (bookSplitPages && chapter.pages[currentBookPage + 1]) chapter.pages[currentBookPage + 1].content = $("#book-chapter-content-secondary").value;
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
  $("#book-chapter-content-secondary").value = chapter.pages[currentBookPage + 1]?.content || "";
  bookEditorReady = true;
  updateBookCounts();
  updateBookPageControls(chapter);
  setBookUpdatedTime(book);
  renderChapterList();
  $(".chapter-rail").classList.remove("open");
  $("#chapter-menu").setAttribute("aria-expanded", "false");
}

function setChapterSidebarHidden(hidden, persist = true) {
  const workspace = $(".book-workspace");
  const toggle = $("#chapter-sidebar-toggle");
  workspace.classList.toggle("chapters-hidden", hidden);
  toggle.textContent = hidden ? "Show chapters" : "Hide chapters";
  toggle.setAttribute("aria-expanded", String(!hidden));
  if (persist) localStorage.setItem(BOOK_CHAPTER_SIDEBAR_KEY, hidden ? "true" : "false");
  if (hidden) $("#book-chapter-content").focus();
}

function setBookSplitPages(enabled, persist = true) {
  if (bookEditorReady) commitBookEditor();
  bookSplitPages = Boolean(enabled);
  const button = $("#book-split-pages");
  button.setAttribute("aria-pressed", String(bookSplitPages));
  button.textContent = bookSplitPages ? "Single page" : "Two pages";
  if (persist) localStorage.setItem(BOOK_SPLIT_PAGES_KEY, bookSplitPages ? "true" : "false");
  if (bookEditorReady) loadBookChapter(currentBookChapter, currentBookPage, false);
}

function updateBookCounts() {
  const secondary = bookSplitPages && !$("#book-secondary-page").hidden ? ` ${$("#book-chapter-content-secondary").value}` : "";
  const content = `${$("#book-chapter-content").value}${secondary}`.trim();
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
  setChapterSidebarHidden(localStorage.getItem(BOOK_CHAPTER_SIDEBAR_KEY) === "true", false);
  setBookSplitPages(localStorage.getItem(BOOK_SPLIT_PAGES_KEY) === "true", false);
  renderChapterList();
  loadBookChapter(0, 0, false);
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
      imported = normalizeBook({ version: BOOK_SCHEMA_VERSION, title: "A Hypothesis of Man", updatedAt: null, chapters: parseMarkdownBook(text) });
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

function xmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
}

function zipCrc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pushZipNumber(target, value, byteCount) {
  for (let index = 0; index < byteCount; index += 1) target.push((value >>> (index * 8)) & 0xff);
}

function createStoredZip(entries) {
  const encoder = new TextEncoder();
  const body = [];
  const directory = [];
  entries.forEach(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const data = encoder.encode(content);
    const crc = zipCrc32(data);
    const offset = body.length;
    pushZipNumber(body, 0x04034b50, 4);
    pushZipNumber(body, 20, 2); pushZipNumber(body, 0, 2); pushZipNumber(body, 0, 2);
    pushZipNumber(body, 0, 2); pushZipNumber(body, 0, 2); pushZipNumber(body, crc, 4);
    pushZipNumber(body, data.length, 4); pushZipNumber(body, data.length, 4);
    pushZipNumber(body, nameBytes.length, 2); pushZipNumber(body, 0, 2);
    body.push(...nameBytes, ...data);

    pushZipNumber(directory, 0x02014b50, 4);
    pushZipNumber(directory, 20, 2); pushZipNumber(directory, 20, 2);
    pushZipNumber(directory, 0, 2); pushZipNumber(directory, 0, 2);
    pushZipNumber(directory, 0, 2); pushZipNumber(directory, 0, 2); pushZipNumber(directory, crc, 4);
    pushZipNumber(directory, data.length, 4); pushZipNumber(directory, data.length, 4);
    pushZipNumber(directory, nameBytes.length, 2); pushZipNumber(directory, 0, 2); pushZipNumber(directory, 0, 2);
    pushZipNumber(directory, 0, 2); pushZipNumber(directory, 0, 2); pushZipNumber(directory, 0, 4);
    pushZipNumber(directory, offset, 4); directory.push(...nameBytes);
  });
  const directoryOffset = body.length;
  body.push(...directory);
  pushZipNumber(body, 0x06054b50, 4); pushZipNumber(body, 0, 2); pushZipNumber(body, 0, 2);
  pushZipNumber(body, entries.length, 2); pushZipNumber(body, entries.length, 2);
  pushZipNumber(body, directory.length, 4); pushZipNumber(body, directoryOffset, 4); pushZipNumber(body, 0, 2);
  return new Uint8Array(body);
}

function wordParagraph(text, options = {}) {
  const properties = options.heading ? `<w:pPr><w:keepNext/><w:spacing w:before="${options.heading === 1 ? 240 : 160}" w:after="120"/></w:pPr>` : "";
  const runProperties = options.heading ? `<w:rPr><w:b/><w:sz w:val="${options.heading === 1 ? 38 : 28}"/></w:rPr>` : "";
  return `<w:p>${properties}<w:r>${runProperties}<w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;
}

function createBookWordBytes(book) {
  const documentParts = [wordParagraph(book.title, { heading: 1 })];
  book.chapters.forEach((chapter, chapterIndex) => {
    documentParts.push(wordParagraph(chapter.title, { heading: 2 }));
    chapter.pages.forEach((page, pageIndex) => {
      String(page.content || "").split(/\r?\n/).forEach((line) => documentParts.push(wordParagraph(line)));
      const lastPage = chapterIndex === book.chapters.length - 1 && pageIndex === chapter.pages.length - 1;
      if (!lastPage) documentParts.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
    });
  });
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${documentParts.join("")}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/></w:sectPr></w:body></w:document>`;
  const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>';
  const relationships = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
  return createStoredZip([["[Content_Types].xml", contentTypes], ["_rels/.rels", relationships], ["word/document.xml", documentXml]]);
}

function exportBookWord() {
  commitBookEditor();
  const bytes = createBookWordBytes(getBook());
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "A_Hypothesis_of_Man.docx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Word manuscript downloaded.");
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
  try {
    const library = await musicCloud.list("anthony");
    tracks = library.tracks;
    musicPlaylists = library.playlists;
    musicCloudError = "";
  } catch (error) {
    tracks = [];
    musicPlaylists = [];
    musicCloudError = error.message;
  }
  $("#all-track-count").textContent = tracks.length;
  $("#playlist-list").innerHTML = musicPlaylists.map((playlist) => {
    const count = tracks.filter((track) => String(track.playlist_id) === String(playlist.id)).length;
    return `<button class="playlist-tile" type="button" data-playlist="${playlist.id}"><span aria-hidden="true">♬</span><strong>${escapeHtml(playlist.name)}</strong><small><b>${count}</b> ${count === 1 ? "song" : "songs"}</small></button>`;
  }).join("");
  const artists = [...new Set(tracks.map(trackArtist))].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  [...currentArtists].forEach((artist) => { if (!artists.includes(artist)) currentArtists.delete(artist); });
  $("#artist-filter-options").innerHTML = `<button id="clear-artist-filter" class="artist-filter-all" type="button">All artists</button>${artists.map((artist) => `<label class="artist-filter-option"><input type="checkbox" data-artist-filter value="${escapeHtml(artist)}" ${currentArtists.has(artist) ? "checked" : ""} /><span>${escapeHtml(artist)}</span></label>`).join("")}`;
  syncArtistFilterUi();
  const playlistOptions = musicPlaylists.map((playlist) => `<option value="${playlist.id}">${escapeHtml(playlist.name)}</option>`).join("");
  if (currentPlaylist !== "all" && currentPlaylist !== "none" && !musicPlaylists.some((playlist) => String(playlist.id) === currentPlaylist)) currentPlaylist = "all";
  $("#playlist-filter").innerHTML = `<option value="all">All playlists</option><option value="none">No playlist</option>${playlistOptions}`;
  $("#playlist-filter").value = currentPlaylist;
  $("#bulk-playlist-select").innerHTML = `<option value="">Playlist</option>${playlistOptions}`;
  if (musicPlaylists.some((playlist) => String(playlist.id) === previousBulkPlaylist)) $("#bulk-playlist-select").value = previousBulkPlaylist;
  applyMusicFilters();
  renderDock();
  restoreMusicPlayerState();
}

function applyMusicFilters() {
  const selectedPlaylist = musicPlaylists.find((playlist) => String(playlist.id) === currentPlaylist);
  const normalizedQuery = currentSongQuery.trim().toLocaleLowerCase();
  visibleTracks = tracks.filter((track) => {
    const matchesSong = !normalizedQuery || String(track.title || "").toLocaleLowerCase().includes(normalizedQuery);
    const matchesArtist = !currentArtists.size || currentArtists.has(trackArtist(track));
    const matchesPlaylist = currentPlaylist === "all" || (currentPlaylist === "none" ? !track.playlist_id : String(track.playlist_id) === currentPlaylist);
    return matchesSong && matchesArtist && matchesPlaylist;
  });
  const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
  const sortValue = (track) => musicSortColumn === "artist" ? trackArtist(track) : musicSortColumn === "playlist" ? trackPlaylistName(track) : String(track.title || "");
  visibleTracks.sort((left, right) => {
    const compared = collator.compare(sortValue(left), sortValue(right));
    return (compared || collator.compare(String(left.title || ""), String(right.title || ""))) * (musicSortDirection === "asc" ? 1 : -1);
  });
  const availableIds = new Set(tracks.map((track) => String(track.id)));
  [...selectedTrackIds].forEach((id) => { if (!availableIds.has(id)) selectedTrackIds.delete(id); });
  $$(".playlist-tile[data-playlist]").forEach((button) => button.classList.toggle("active", button.dataset.playlist === currentPlaylist));
  syncArtistFilterUi();
  $("#playlist-filter").value = currentPlaylist;
  $("#library-title").textContent = currentPlaylist === "all" ? "All songs" : currentPlaylist === "none" ? "No playlist" : selectedPlaylist?.name || "Playlist";
  const playlistOptions = musicPlaylists.map((playlist) => `<option value="${playlist.id}">${escapeHtml(playlist.name)}</option>`).join("");
  $("#track-list").innerHTML = musicCloudError ? `<div class="library-empty"><p>Cloud library unavailable.</p><small>${escapeHtml(musicCloudError)}</small></div>` : visibleTracks.length ? visibleTracks.map((track) => {
    const editing = editingTrackId === String(track.id);
    const songCell = editing
      ? `<input class="track-edit-input" data-edit-title type="text" maxlength="200" value="${escapeHtml(track.title)}" aria-label="Song title" />`
      : `<div class="track-song"><strong>${escapeHtml(track.title)}</strong><small>${formatBytes(track.size_bytes)}</small></div>`;
    const artistCell = editing
      ? `<input class="track-edit-input" data-edit-artist type="text" maxlength="200" value="${escapeHtml(trackArtist(track))}" aria-label="Artist name" />`
      : `<div class="track-artist" title="${escapeHtml(trackArtist(track))}">${escapeHtml(trackArtist(track))}</div>`;
    const actions = editing
      ? `<div class="track-row-actions"><button class="track-save" type="button" data-save-track="${track.id}">Save</button><button class="track-cancel" type="button" data-cancel-track="${track.id}" aria-label="Cancel editing">×</button></div>`
      : `<div class="track-row-actions"><button class="track-edit" type="button" data-edit-track="${track.id}" aria-label="Edit ${escapeHtml(track.title)}">✎</button><button class="track-delete" type="button" data-delete-track="${track.id}" aria-label="Delete ${escapeHtml(track.title)}">×</button></div>`;
    const playing = String(track.id) === String(currentTrackId);
    return `<article class="track-row${editing ? " editing" : ""}${playing ? " playing" : ""}" data-track-row="${track.id}"><input class="track-select" type="checkbox" data-select-track="${track.id}" aria-label="Select ${escapeHtml(track.title)}" ${selectedTrackIds.has(String(track.id)) ? "checked" : ""} /><button class="track-play" type="button" data-play-track="${track.id}" aria-label="Play ${escapeHtml(track.title)}">${playing && !$("#audio-player").paused ? "❚❚" : "▶"}</button>${songCell}${artistCell}<select class="track-playlist-select" data-assign-track="${track.id}" aria-label="Playlist for ${escapeHtml(track.title)}"><option value="">No playlist</option>${playlistOptions}</select>${actions}</article>`;
  }).join("") : `<div class="library-empty"><p>${tracks.length ? "No songs match these filters." : "No songs here yet."}</p></div>`;
  $$('[data-assign-track]').forEach((select) => { const track = tracks.find((item) => String(item.id) === select.dataset.assignTrack); select.value = track?.playlist_id || ""; });
  updateMusicSortControls();
  updateTrackSelectionControls();
  syncMusicCollectionView();
}

function syncMusicCollectionView() {
  $("#playlist-browser").hidden = musicLibraryOpen;
  $("#music-library-view").hidden = !musicLibraryOpen;
}

function closeMusicLibrary() {
  musicLibraryOpen = false;
  selectedTrackIds.clear();
  editingTrackId = null;
  syncMusicCollectionView();
  $("#playlist-browser").scrollIntoView({ block: "start", behavior: "auto" });
}

function syncArtistFilterUi() {
  const artists = [...currentArtists];
  const label = $("#artist-filter-label");
  if (label) {
    label.textContent = artists.length === 0 ? "All artists" : artists.length === 1 ? artists[0] : `${artists.length} artists`;
    label.closest("summary")?.setAttribute("title", artists.length ? artists.join(", ") : "All artists");
  }
  $$('[data-artist-filter]').forEach((checkbox) => { checkbox.checked = currentArtists.has(checkbox.value); });
  $("#clear-artist-filter")?.classList.toggle("active", artists.length === 0);
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
  const playlistSelect = $("#dock-playlist-select");
  const songSelect = $("#dock-track-select");
  if (playerPlaylist !== "all" && !musicPlaylists.some((playlist) => String(playlist.id) === playerPlaylist)) playerPlaylist = "all";
  playlistSelect.innerHTML = `<option value="all">All songs (${tracks.length})</option>${musicPlaylists.map((playlist) => {
    const count = tracks.filter((track) => String(track.playlist_id) === String(playlist.id)).length;
    return `<option value="${playlist.id}">${escapeHtml(playlist.name)} (${count})</option>`;
  }).join("")}`;
  playlistSelect.value = playerPlaylist;
  const queue = playerQueue();
  songSelect.innerHTML = queue.length ? '<option value="">Choose a song</option>' + queue.map((track) => `<option value="${track.id}">${escapeHtml(track.title)}</option>`).join("") : '<option value="">No songs in this playlist</option>';
  if (currentTrackId && queue.some((track) => String(track.id) === String(currentTrackId))) songSelect.value = String(currentTrackId);
  $("#dock-shuffle").setAttribute("aria-pressed", String(shuffleEnabled));
}

function basePlayerQueue() {
  return playerPlaylist === "all" ? tracks : tracks.filter((track) => String(track.playlist_id) === playerPlaylist);
}

function refreshShuffledQueue() {
  shuffledTrackIds = basePlayerQueue().map((track) => String(track.id));
  for (let index = shuffledTrackIds.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffledTrackIds[index], shuffledTrackIds[other]] = [shuffledTrackIds[other], shuffledTrackIds[index]];
  }
}

function playerQueue() {
  const base = basePlayerQueue();
  if (!shuffleEnabled) return base;
  const byId = new Map(base.map((track) => [String(track.id), track]));
  shuffledTrackIds = shuffledTrackIds.filter((id) => byId.has(id));
  base.forEach((track) => { if (!shuffledTrackIds.includes(String(track.id))) shuffledTrackIds.push(String(track.id)); });
  return shuffledTrackIds.map((id) => byId.get(id)).filter(Boolean);
}

function setShuffle(enabled, refresh = true) {
  shuffleEnabled = Boolean(enabled);
  if (shuffleEnabled && refresh) refreshShuffledQueue();
  $("#dock-shuffle").setAttribute("aria-pressed", String(shuffleEnabled));
  renderDock();
  saveMusicPlayerState();
}

function readMusicPlayerState() {
  try { return JSON.parse(sessionStorage.getItem(MUSIC_PLAYER_STATE_KEY)) || null; } catch { return null; }
}

function saveMusicPlayerState(options = {}) {
  const track = tracks.find((item) => String(item.id) === String(currentTrackId));
  const audio = $("#audio-player");
  const previous = readMusicPlayerState();
  const playing = Boolean(track && (options.keepPlaying ? (!audio.paused || previous?.playing) : !audio.paused));
  sessionStorage.setItem(MUSIC_PLAYER_STATE_KEY, JSON.stringify({ playlistId: playerPlaylist, trackId: track ? String(track.id) : null, title: track?.title || $("#dock-title").textContent, currentTime: track ? Number(audio.currentTime || 0) : 0, playing, shuffle: shuffleEnabled }));
}

function restoreMusicPlayerState() {
  if (playerStateRestored) return;
  playerStateRestored = true;
  const saved = readMusicPlayerState();
  playerPlaylist = saved?.playlistId || "all";
  shuffleEnabled = Boolean(saved?.shuffle);
  if (playerPlaylist !== "all" && !musicPlaylists.some((playlist) => String(playlist.id) === playerPlaylist)) playerPlaylist = "all";
  if (shuffleEnabled) refreshShuffledQueue();
  const track = tracks.find((item) => String(item.id) === String(saved?.trackId));
  if (track && !playerQueue().some((item) => String(item.id) === String(track.id))) {
    playerPlaylist = "all";
    if (shuffleEnabled) refreshShuffledQueue();
  }
  renderDock();
  if (!track) return;
  currentTrackId = String(track.id);
  const audio = $("#audio-player");
  audio.src = track.url;
  $("#dock-title").textContent = playerTrackLabel(track);
  $("#dock-track-select").value = String(track.id);
  if (Number(saved.currentTime) > 0) {
    const seek = () => { audio.currentTime = Math.min(Number(saved.currentTime), Number.isFinite(audio.duration) ? audio.duration : Number(saved.currentTime)); };
    if (audio.readyState >= 1) seek(); else audio.addEventListener("loadedmetadata", seek, { once: true });
  }
  if (saved.playing) audio.play().catch(() => {});
  updatePlayButton();
  updateMediaSession(track);
  updateNowPlayingRows();
}

async function playTrack(id, options = {}) {
  const track = tracks.find((item) => String(item.id) === String(id));
  if (!track) return;
  if (options.playlistId && (options.playlistId === "all" || musicPlaylists.some((playlist) => String(playlist.id) === String(options.playlistId)))) playerPlaylist = String(options.playlistId);
  if (!playerQueue().some((item) => String(item.id) === String(track.id))) {
    playerPlaylist = "all";
    if (shuffleEnabled) refreshShuffledQueue();
  }
  const audio = $("#audio-player");
  const sameTrack = String(currentTrackId) === String(track.id) && Boolean(audio.src);
  currentTrackId = track.id;
  if (!sameTrack) audio.src = track.url;
  $("#dock-title").textContent = playerTrackLabel(track);
  renderDock();
  updateMediaSession(track);
  try { await audio.play(); } catch { toast("Tap play to start this song."); }
  updatePlayButton();
  updateNowPlayingRows();
  saveMusicPlayerState();
}

async function toggleTrackPlayback(id, options = {}) {
  const audio = $("#audio-player");
  if (String(currentTrackId) !== String(id) || !audio.src) return playTrack(id, options);
  if (audio.paused) {
    try { await audio.play(); } catch { toast("Tap play to resume this song."); }
  } else {
    audio.pause();
  }
  updatePlayButton();
  saveMusicPlayerState();
}

function updatePlayButton() {
  const paused = $("#audio-player").paused;
  $("#dock-play").textContent = paused ? "▶" : "❚❚";
  $("#dock-play").setAttribute("aria-label", paused ? "Play" : "Pause");
  $("[data-music-page-play]")?.setAttribute("aria-label", paused ? "Play" : "Pause");
  if ("mediaSession" in navigator) navigator.mediaSession.playbackState = currentTrackId ? (paused ? "paused" : "playing") : "none";
  updateNowPlayingRows();
  syncMusicProgress();
}

function updateNowPlayingRows() {
  $$('[data-track-row]').forEach((row) => {
    const playing = String(row.dataset.trackRow) === String(currentTrackId);
    row.classList.toggle("playing", playing);
    const button = $("[data-play-track]", row);
    if (button) {
      const paused = $("#audio-player").paused;
      const title = tracks.find((track) => String(track.id) === String(row.dataset.trackRow))?.title || "song";
      button.textContent = playing && !paused ? "❚❚" : "▶";
      button.setAttribute("aria-label", playing && !paused ? `Pause ${title}` : `Play ${title}`);
    }
  });
}

function formatPlaybackTime(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function musicTimelineMarkup(label) {
  return `<div class="music-timeline"><span data-music-current-time>0:00</span><input data-music-progress type="range" min="0" max="0" value="0" step="0.1" aria-label="${label}" disabled /><span data-music-duration>0:00</span></div>`;
}

function installMusicProgressControls() {
  const dockCopy = $(".dock-copy");
  if (dockCopy && !$("[data-music-progress]", dockCopy)) dockCopy.insertAdjacentHTML("beforeend", musicTimelineMarkup("Song position in music bar"));
  const libraryHeading = $("#music-library-view .library-heading");
  if (libraryHeading && !$("[data-music-page-player]")) {
    libraryHeading.insertAdjacentHTML("afterend", `<div class="library-player" data-music-page-player><button type="button" data-music-page-play aria-label="Play" disabled>▶</button><div class="library-player-copy"><small>Now playing</small><strong data-music-page-title>Nothing selected</strong>${musicTimelineMarkup("Song position on Music page")}</div></div>`);
  }
  $$('[data-music-progress]').forEach((range) => {
    range.addEventListener("input", () => {
      const audio = $("#audio-player");
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = Math.min(audio.duration, Math.max(0, Number(range.value)));
      syncMusicProgress();
    });
    range.addEventListener("change", saveMusicPlayerState);
  });
  $("[data-music-page-play]")?.addEventListener("click", () => {
    const audio = $("#audio-player");
    if (!audio.src && playerQueue().length) return playTrack(playerQueue()[0].id);
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  syncMusicProgress();
}

function syncMusicProgress() {
  const audio = $("#audio-player");
  if (!audio) return;
  const hasTrack = currentTrackId !== null && currentTrackId !== undefined && Boolean(audio.src);
  const duration = hasTrack && Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
  const current = duration ? Math.min(duration, Math.max(0, audio.currentTime || 0)) : 0;
  $$('[data-music-progress]').forEach((range) => {
    range.max = String(duration || 0);
    range.value = String(current);
    range.disabled = !duration;
    range.style.setProperty("--music-progress", `${duration ? (current / duration) * 100 : 0}%`);
  });
  $$('[data-music-current-time]').forEach((node) => { node.textContent = formatPlaybackTime(current); });
  $$('[data-music-duration]').forEach((node) => { node.textContent = formatPlaybackTime(duration); });
  const track = tracks.find((item) => String(item.id) === String(currentTrackId));
  const pageTitle = $("[data-music-page-title]");
  if (pageTitle) pageTitle.textContent = track?.title || "Nothing selected";
  const pagePlay = $("[data-music-page-play]");
  if (pagePlay) {
    pagePlay.disabled = !track;
    pagePlay.textContent = track && !audio.paused ? "❚❚" : "▶";
  }
}

function updateMediaSession(track) {
  if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined" || !track) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: trackArtist(track),
    album: "Anthony Amaru",
    artwork: [{ src: new URL("anthony-icon-512.png", location.href).href, sizes: "512x512", type: "image/png" }],
  });
}

function updateMediaPosition() {
  const audio = $("#audio-player");
  syncMusicProgress();
  if (!("mediaSession" in navigator) || typeof navigator.mediaSession.setPositionState !== "function" || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
  try { navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate, position: Math.min(audio.currentTime, audio.duration) }); } catch {}
}

function installMediaSession() {
  if (!("mediaSession" in navigator)) return;
  const audio = $("#audio-player");
  const handlers = {
    play: () => audio.play().catch(() => {}),
    pause: () => audio.pause(),
    previoustrack: () => stepTrack(-1),
    nexttrack: () => stepTrack(1),
    seekbackward: (details) => { audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10)); },
    seekforward: (details) => { audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10)); },
    seekto: (details) => { if (Number.isFinite(details.seekTime)) audio.currentTime = details.seekTime; },
  };
  Object.entries(handlers).forEach(([action, handler]) => { try { navigator.mediaSession.setActionHandler(action, handler); } catch {} });
}

function stepTrack(direction) {
  const pool = playerQueue();
  if (!pool.length) return;
  const index = pool.findIndex((track) => track.id === currentTrackId);
  playTrack(pool[index < 0 ? 0 : (index + direction + pool.length) % pool.length].id);
}

async function playDockPlaylist(id) {
  playerPlaylist = id === "all" || musicPlaylists.some((playlist) => String(playlist.id) === String(id)) ? String(id) : "all";
  currentTrackId = null;
  if (shuffleEnabled) refreshShuffledQueue();
  renderDock();
  const queue = playerQueue();
  if (queue.length) return playTrack(queue[0].id);
  const audio = $("#audio-player");
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  const playlist = musicPlaylists.find((item) => String(item.id) === playerPlaylist);
  $("#dock-title").textContent = playlist ? `${playlist.name} is empty` : "No music added yet";
  updatePlayButton();
  saveMusicPlayerState();
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

async function saveTrackEdits(button) {
  const row = button.closest("[data-track-row]");
  const track = tracks.find((item) => String(item.id) === String(row?.dataset.trackRow));
  if (!row || !track) return;
  const title = $("[data-edit-title]", row)?.value.trim() || "";
  const artist = $("[data-edit-artist]", row)?.value.trim() || "";
  if (!title || !artist) return toast("Song and artist names cannot be empty.");
  if (!(await ensureCloudMusicAdmin())) return;
  button.disabled = true;
  button.textContent = "Saving…";
  try {
    await musicCloud.updateTrackMetadata(track, title, artist);
    editingTrackId = null;
    await renderMusic();
    if (String(currentTrackId) === String(track.id)) $("#dock-title").textContent = playerTrackLabel(tracks.find((item) => String(item.id) === String(track.id)) || track);
    toast("Song details saved to the cloud.");
  } catch (error) {
    button.disabled = false;
    button.textContent = "Save";
    toast(error.message);
  }
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

function trackArtist(track) {
  const stored = String(track?.source_metadata?.artist || "").trim();
  if (stored) return stored;
  const base = String(track?.file_name || track?.title || "").replace(/\.[^.]+$/, "").replace(/\s*\[[\w-]{6,}\]\s*$/, "").trim();
  return base.match(/^(.+?)\s[-–—]\s.+$/)?.[1]?.trim() || "Unknown artist";
}

function playerTrackLabel(track) {
  const artist = trackArtist(track);
  return artist && artist !== "Unknown artist" ? `${track.title} · ${artist}` : track.title;
}

function trackPlaylistName(track) {
  return musicPlaylists.find((playlist) => String(playlist.id) === String(track.playlist_id))?.name || "No playlist";
}

function updateMusicSortControls() {
  $$('[data-sort-column]').forEach((button) => {
    const active = button.dataset.sortColumn === musicSortColumn;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    const indicator = $("[data-sort-indicator]", button);
    if (indicator) indicator.textContent = active ? (musicSortDirection === "asc" ? "A→Z" : "Z→A") : "↕";
  });
}

function setMusicSort(column) {
  if (!['song', 'artist', 'playlist'].includes(column)) return;
  if (musicSortColumn === column) musicSortDirection = musicSortDirection === "asc" ? "desc" : "asc";
  else {
    musicSortColumn = column;
    musicSortDirection = "asc";
  }
  applyMusicFilters();
}

function refreshDashboard() {
  const aviation = readJson("anthony_aviation_history_v1", []);
  const mandarin = readJson("anthony_mandarin_history_v1", []);
  const writingWords = readJson(MANDARIN_WRITING_KEY, []);
  $("#aviation-last-score").textContent = aviation.length ? `${aviation[0].percent}%` : "—";
  $("#aviation-test-count").textContent = aviation.length;
  $("#mandarin-last-score").textContent = mandarin.length ? `${mandarin[0].percent}%` : "—";
  $("#mandarin-written-count").textContent = String(new Set(writingWords.map((word) => String(word || "").trim()).filter(Boolean)).size);
  $("#home-aviation-score").textContent = aviation.length ? `${aviation[0].percent}% · ${aviation[0].correct}/${aviation[0].total}` : "No aviation score yet";
  $("#home-mandarin-score").textContent = mandarin.length ? `${mandarin[0].percent}% · ${mandarin[0].correct}/${mandarin[0].total}` : "No Mandarin score yet";
  const rawBook = localStorage.getItem(KEYS.book);
  const book = getBook();
  const pageCount = book.chapters.reduce((total, chapter) => total + chapter.pages.length, 0);
  $("#home-book-status").textContent = rawBook ? `${book.chapters.length} sections · ${pageCount} pages` : "Book ready";
  updateAdminStatus();
}

async function syncStudyHistoryFromCloud() {
  if (!window.musicCloud?.isSignedIn()) return;
  try {
    const [aviationRows, mandarinRows, writingRow] = await Promise.all([
      musicCloud.listTestAttempts("aviation"),
      musicCloud.listTestAttempts("mandarin"),
      musicCloud.getContent("anthony", MANDARIN_WRITING_CLOUD_KEY),
    ]);
    writeJson("anthony_aviation_history_v1", aviationRows.map((row) => ({ id: row.id, date: row.completed_at, book: row.mode || "aviation", chapter: row.section || "all", correct: row.correct, total: row.total, percent: row.percent, wrong: row.wrong_answers || [] })));
    writeJson("anthony_mandarin_history_v1", mandarinRows.map((row) => ({ id: row.id, date: row.completed_at, type: row.mode || "mixed", section: row.section || null, correct: row.correct, total: row.total, percent: row.percent, wrong: row.wrong_answers || [] })));
    if (Array.isArray(writingRow?.value)) writeJson(MANDARIN_WRITING_KEY, writingRow.value);
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
  const detail = Object.entries(DETAIL_PAGES).find(([, path]) => url.pathname.endsWith(`/${path}`))?.[0];
  if (url.origin === location.origin && detail) {
    event.preventDefault();
    navigateDetail(detail);
    return;
  }
  const rootPath = location.pathname.replace(/index\.html$/, "");
  if (url.origin !== location.origin || url.pathname.replace(/index\.html$/, "") !== rootPath) return;
  event.preventDefault();
  if (!$("#book-modal").hidden) closeBookStudio();
  navigatePortal(portalRouteFromUrl(url));
});

window.addEventListener("popstate", syncPortalUrl);
window.addEventListener("message", (event) => {
  const frame = $("#detail-page-frame");
  if (event.origin !== location.origin || event.source !== frame?.contentWindow || event.data?.type !== "anthony-portal-nav") return;
  const route = ["resume", "interests", "music"].includes(event.data.route) ? event.data.route : "home";
  navigatePortal(route);
});

$("#theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
$("#mobile-menu-button").addEventListener("click", () => {
  const nav = $("#primary-nav");
  const open = nav.classList.toggle("open");
  $("#mobile-menu-button").setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (event) => {
  const popover = $("#quick-ai-popover");
  if (!popover.hidden && !event.target.closest("#quick-ai-popover") && !event.target.closest("#quick-ai-toggle") && !event.target.closest("[data-open-quick-ai]")) toggleQuickAi(false);
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

$$('[data-open-quick-ai]').forEach((button) => button.addEventListener("click", () => {
  const topic = $("#quick-ai-topic");
  if (topic) topic.value = "General";
  toggleQuickAi(true);
}));

$("#open-book-studio").addEventListener("click", (event) => { event.preventDefault(); openBookStudio(); });
$("#chapter-sidebar-toggle").addEventListener("click", () => setChapterSidebarHidden(!$(".book-workspace").classList.contains("chapters-hidden")));
$("#chapter-menu").addEventListener("click", () => {
  const rail = $(".chapter-rail");
  rail.classList.toggle("open");
  $("#chapter-menu").setAttribute("aria-expanded", String(rail.classList.contains("open")));
});
$("#chapter-list").addEventListener("click", (event) => { const button = event.target.closest("[data-chapter-index]"); if (button) loadBookChapter(Number(button.dataset.chapterIndex), 0); });
$("#book-chapter-title").addEventListener("input", queueBookSave);
$("#book-chapter-content").addEventListener("input", queueBookSave);
$("#book-chapter-content-secondary").addEventListener("input", queueBookSave);
$("#book-prev-page").addEventListener("click", () => loadBookChapter(currentBookChapter, currentBookPage - (bookSplitPages ? 2 : 1)));
$("#book-next-page").addEventListener("click", () => loadBookChapter(currentBookChapter, currentBookPage + (bookSplitPages ? 2 : 1)));
$("#book-split-pages").addEventListener("click", () => setBookSplitPages(!bookSplitPages));
$("#export-book-word").addEventListener("click", exportBookWord);
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
$("#quick-ai-toggle").addEventListener("click", () => toggleQuickAi());
$("#quick-ai-close").addEventListener("click", () => toggleQuickAi(false));
$("#quick-ai-form").addEventListener("submit", askQuickAi);
$("#quick-ai-input").addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  event.currentTarget.form.requestSubmit();
});

$("#new-playlist").addEventListener("click", createPlaylist);
$("#close-music-library").addEventListener("click", closeMusicLibrary);
$("#assign-selected-tracks").addEventListener("click", assignSelectedTracks);
$("#bulk-playlist-select").addEventListener("change", updateTrackSelectionControls);
$("#song-filter").addEventListener("input", (event) => { selectedTrackIds.clear(); currentSongQuery = event.target.value; applyMusicFilters(); });
$("#artist-filter-options").addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-artist-filter]");
  if (!checkbox) return;
  selectedTrackIds.clear();
  if (checkbox.checked) currentArtists.add(checkbox.value);
  else currentArtists.delete(checkbox.value);
  applyMusicFilters();
});
$("#artist-filter-options").addEventListener("click", (event) => {
  if (!event.target.closest("#clear-artist-filter")) return;
  selectedTrackIds.clear();
  currentArtists.clear();
  applyMusicFilters();
});
$("#playlist-filter").addEventListener("change", (event) => { selectedTrackIds.clear(); currentPlaylist = event.target.value; applyMusicFilters(); });
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
  const sort = event.target.closest("[data-sort-column]");
  const edit = event.target.closest("[data-edit-track]");
  const save = event.target.closest("[data-save-track]");
  const cancel = event.target.closest("[data-cancel-track]");
  const playlist = event.target.closest("[data-playlist]");
  const play = event.target.closest("[data-play-track]");
  const remove = event.target.closest("[data-delete-track]");
  if (sort) return setMusicSort(sort.dataset.sortColumn);
  if (edit) {
    editingTrackId = String(edit.dataset.editTrack);
    applyMusicFilters();
    return requestAnimationFrame(() => document.querySelector(`[data-track-row='${editingTrackId}'] [data-edit-title]`)?.focus());
  }
  if (save) return saveTrackEdits(save);
  if (cancel) { editingTrackId = null; return applyMusicFilters(); }
  if (playlist) {
    selectedTrackIds.clear();
    currentArtists.clear();
    currentSongQuery = "";
    $("#song-filter").value = "";
    currentPlaylist = playlist.dataset.playlist;
    musicLibraryOpen = true;
    applyMusicFilters();
  }
  if (play) toggleTrackPlayback(play.dataset.playTrack, { playlistId: currentPlaylist === "none" ? "all" : currentPlaylist });
  if (remove) deleteTrack(remove.dataset.deleteTrack);
});
$("#page-music").addEventListener("keydown", (event) => {
  if (!event.target.matches("[data-edit-title], [data-edit-artist]")) return;
  const row = event.target.closest("[data-track-row]");
  if (event.key === "Enter") { event.preventDefault(); $("[data-save-track]", row)?.click(); }
  if (event.key === "Escape") { event.preventDefault(); editingTrackId = null; applyMusicFilters(); }
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
$("#dock-shuffle").addEventListener("click", () => setShuffle(!shuffleEnabled));
$("#dock-play").addEventListener("click", () => { const audio = $("#audio-player"); if (!audio.src && playerQueue().length) return playTrack(playerQueue()[0].id); if (audio.paused) audio.play(); else audio.pause(); });
$("#dock-previous").addEventListener("click", () => stepTrack(-1));
$("#dock-next").addEventListener("click", () => stepTrack(1));
$("#dock-playlist-select").addEventListener("change", (event) => playDockPlaylist(event.target.value));
$("#dock-track-select").addEventListener("change", (event) => { if (event.target.value) playTrack(event.target.value); });
$("#audio-player").addEventListener("play", () => { updatePlayButton(); saveMusicPlayerState(); });
$("#audio-player").addEventListener("pause", () => { updatePlayButton(); if (!musicNavigationHandoff) saveMusicPlayerState(); });
$("#audio-player").addEventListener("ended", () => stepTrack(1));
$("#audio-player").addEventListener("loadedmetadata", updateMediaPosition);
$("#audio-player").addEventListener("durationchange", updateMediaPosition);
$("#audio-player").addEventListener("timeupdate", updateMediaPosition);
window.addEventListener("beforeunload", () => {
  const audio = $("#audio-player");
  musicNavigationHandoff = Boolean(currentTrackId && !audio.paused);
  saveMusicPlayerState({ keepPlaying: musicNavigationHandoff });
});
window.addEventListener("pagehide", () => {
  if (bookEditorReady) commitBookEditor(false);
  saveMusicPlayerState({ keepPlaying: musicNavigationHandoff });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!$("#quick-ai-popover").hidden) toggleQuickAi(false);
  else if (!$("#book-modal").hidden) closeBookStudio();
  else if (musicLibraryOpen) closeMusicLibrary();
  else if (!$("#admin-modal").hidden) closeAdminModal(false);
});

/* Initial state */
installMusicProgressControls();
applyTheme(localStorage.getItem(KEYS.theme) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
renderResume();
renderMusic();
refreshDashboard();
const initialRoute = portalRouteFromUrl();
if (!showDetailPage(detailRouteFromUrl())) routeTo(initialRoute);
installMediaSession();
if (sessionStorage.getItem("anthony_visitor_unlocked") === "1") showPortal();
if (musicCloud.isSignedIn()) syncStudyHistoryFromCloud();
