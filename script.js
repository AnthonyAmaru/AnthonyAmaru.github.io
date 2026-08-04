const VISITOR_HASH = "685e365003f3413bb077e7b6d5cf3b498c51df12fc883ca818d0344231fc4cd4";
const ADMIN_HASH = "1e67aef3b01e797309c5588def71607f40a4facc6b8993af9a62306f727a2e5a";
const CLOUD_ADMIN_EMAIL = "anthonyamaru93@gmail.com";
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
let currentBookChapter = 0;
let currentPlaylist = "all";
let tracks = [];
let visibleTracks = [];
let currentTrackId = null;
const selectedTrackIds = new Set();
let mediaObjectUrls = [];

const resumeDefaults = {
  work: [
    {
      title: "Data Specialist",
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

const bookDefaults = {
  title: "A Hypothesis of Man",
  updatedAt: null,
  chapters: [
    "Chapter 1 — Genesis", "Chapter 2 — Judaism, Islam, Buddhism and Amish", "Chapter 3 — Principles",
    "Chapter 4 — Principles in Practice", "Chapter 5 — Vices We Must Avoid", "Chapter 6 — Finding a Wife",
    "Chapter 7 — Why Are We Men?", "Chapter 8 — Fatherhood", "Chapter 9 — Adapting to Modern Society vs. Standing Firm",
    "Chapter 10 — Plant the Seed", "Chapter 11 — A Warning to My Brothers and Sons", "Chapter 12 — A Hypothesis Becomes a Theory",
    "Dedication", "Back-cover Summary", "Cover Instruction",
  ].map((title, index) => ({ id: `chapter-${index + 1}`, title, content: "" })),
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
  $$(".page-panel").forEach((panel) => panel.classList.toggle("active", panel === page));
  $$(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.route === route));
  $("#primary-nav").classList.remove("open");
  $("#mobile-menu-button").setAttribute("aria-expanded", "false");
  history.replaceState(null, "", `#${route}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (route === "music") renderMusic();
  if (route === "media") renderMedia();
  if (route === "resume") renderResume();
  if (route === "interests") refreshDashboard();
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
  return data;
}

function renderResume() {
  const resume = getResume();
  $("#work-list").innerHTML = resume.work.length ? resume.work.map((entry, index) => `
    <article class="timeline-item">
      <div class="company-mark" aria-hidden="true">${escapeHtml(entry.mark || entry.organization?.slice(0, 1) || "•")}</div>
      <div class="timeline-copy"><h3>${escapeHtml(entry.title)}</h3><p class="organization">${escapeHtml(entry.organization)}</p><p class="timeline-meta">${escapeHtml(entry.dates)}${entry.location ? ` · ${escapeHtml(entry.location)}` : ""}</p>${entry.description ? `<details class="resume-details"><summary>Responsibilities</summary><ul>${String(entry.description).split("\n").filter(Boolean).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></details>` : ""}</div>
      <div class="entry-actions"><button type="button" data-edit-entry="work:${index}">Edit</button><button type="button" data-delete-entry="work:${index}">Delete</button></div>
    </article>`).join("") : '<p class="empty-state">No work experience added yet.</p>';
  $("#education-list").innerHTML = resume.education.length ? resume.education.map((entry, index) => `
    <article class="education-item">
      <div class="entry-actions"><button type="button" data-edit-entry="education:${index}">Edit</button><button type="button" data-delete-entry="education:${index}">Delete</button></div>
      <div class="company-mark" aria-hidden="true">${escapeHtml(entry.mark || entry.organization?.slice(0, 1) || "•")}</div><h3>${escapeHtml(entry.organization)}</h3><p class="organization">${escapeHtml(entry.title)}</p>${entry.dates || entry.location ? `<p class="meta">${escapeHtml(entry.dates)}${entry.location ? ` · ${escapeHtml(entry.location)}` : ""}</p>` : ""}
    </article>`).join("") : '<p class="empty-state">No education added yet.</p>';
}

async function openEntryEditor(kind, index = "") {
  if (!(await ensureAdmin())) return;
  const resume = getResume();
  const entry = index === "" ? { title: "", organization: "", dates: "", location: "", description: "" } : resume[kind][Number(index)];
  $("#entry-kind").value = kind;
  $("#entry-index").value = index;
  $("#entry-editor-title").textContent = `${index === "" ? "Add" : "Edit"} ${kind === "work" ? "work experience" : "education"}`;
  $("#entry-title").value = entry.title || "";
  $("#entry-organization").value = entry.organization || "";
  $("#entry-dates").value = entry.dates || "";
  $("#entry-location").value = entry.location || "";
  $("#entry-description").value = entry.description || "";
  $("#entry-editor-modal").hidden = false;
  setModalOpen(true);
  requestAnimationFrame(() => $("#entry-title").focus());
}

async function deleteResumeEntry(kind, index) {
  if (!(await ensureAdmin())) return;
  if (!confirm("Delete this resume entry from this device?")) return;
  const resume = getResume();
  resume[kind].splice(Number(index), 1);
  writeJson(KEYS.resume, resume);
  renderResume();
  toast("Resume entry deleted.");
}

function getBook() {
  const book = readJson(KEYS.book, bookDefaults);
  if (!Array.isArray(book.chapters) || !book.chapters.length) return structuredClone(bookDefaults);
  return book;
}

function saveBook(book, status = "Saved locally") {
  book.updatedAt = new Date().toISOString();
  writeJson(KEYS.book, book);
  $("#book-save-status").textContent = status;
  $("#book-updated").textContent = `Updated ${new Date(book.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  refreshDashboard();
}

function renderChapterList() {
  const book = getBook();
  currentBookChapter = Math.min(currentBookChapter, book.chapters.length - 1);
  $("#chapter-list").innerHTML = book.chapters.map((chapter, index) => `<button class="chapter-button ${index === currentBookChapter ? "active" : ""}" type="button" data-chapter-index="${index}">${escapeHtml(chapter.title)}</button>`).join("");
}

function loadBookChapter(index) {
  const book = getBook();
  if (!book.chapters[index]) return;
  currentBookChapter = index;
  $("#book-chapter-title").value = book.chapters[index].title;
  $("#book-chapter-content").value = book.chapters[index].content || "";
  updateBookCounts();
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
  bookSaveTimer = setTimeout(() => {
    const book = getBook();
    const chapter = book.chapters[currentBookChapter];
    if (!chapter) return;
    chapter.title = $("#book-chapter-title").value.trim() || "Untitled chapter";
    chapter.content = $("#book-chapter-content").value;
    saveBook(book);
    renderChapterList();
  }, 420);
}

async function openBookStudio() {
  if (!(await ensureAdmin())) return;
  $("#book-modal").hidden = false;
  setModalOpen(true);
  currentBookChapter = 0;
  renderChapterList();
  loadBookChapter(0);
  updateConnectorStatus();
}

function closeBookStudio() {
  clearTimeout(bookSaveTimer);
  queueBookSave();
  $("#book-modal").hidden = true;
  setModalOpen(false);
}

function parseMarkdownBook(text) {
  const matches = [...text.matchAll(/^#{1,3}\s+(.+)$/gm)];
  if (!matches.length) return [{ id: `chapter-${Date.now()}`, title: "Imported manuscript", content: text.trim() }];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    return { id: `chapter-${Date.now()}-${index}`, title: match[1].trim(), content: text.slice(start, end).trim() };
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
      imported = { title: parsed.title || "A Hypothesis of Man", updatedAt: new Date().toISOString(), chapters: parsed.chapters.map((chapter, index) => ({ id: chapter.id || `chapter-${Date.now()}-${index}`, title: chapter.title || `Chapter ${index + 1}`, content: chapter.content || "" })) };
    } else {
      imported = { title: "A Hypothesis of Man", updatedAt: new Date().toISOString(), chapters: parseMarkdownBook(text) };
    }
    writeJson(KEYS.book, imported);
    currentBookChapter = 0;
    renderChapterList();
    loadBookChapter(0);
    toast(`Imported ${imported.chapters.length} chapter${imported.chapters.length === 1 ? "" : "s"}.`);
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
  downloadFile("A_Hypothesis_of_Man_backup.json", JSON.stringify(getBook(), null, 2), "application/json");
  toast("Private book backup downloaded.");
}

function exportBookMarkdown() {
  const book = getBook();
  const markdown = `# ${book.title}\n\n${book.chapters.map((chapter) => `## ${chapter.title}\n\n${chapter.content || ""}`).join("\n\n")}`;
  downloadFile("A_Hypothesis_of_Man.md", markdown, "text/markdown");
  toast("Markdown manuscript downloaded.");
}

async function sendChapterToAssistant() {
  if (!(await ensureCloudMusicAdmin())) return;
  const book = getBook();
  const chapter = book.chapters[currentBookChapter];
  if (!confirm("Send this chapter to Big Pickle? During its free period, submitted text may be collected and used to improve the model.")) return;
  const button = $("#send-to-assistant");
  button.disabled = true;
  button.textContent = "Sending securely…";
  try {
    const result = await musicCloud.invokeFunction("big-pickle", { scope: "book", action: "edit", chapter: { title: chapter.title, content: chapter.content } });
    if (typeof result.content !== "string") throw new Error("Gateway response did not include revised content.");
    if (confirm("Big Pickle returned a revision. Replace this chapter with it?")) {
      chapter.content = result.content;
      saveBook(book, "AI revision saved locally");
      $("#book-chapter-content").value = chapter.content;
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
    send.textContent = "Send chapter to Big Pickle";
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

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("anthony_personal_portal", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("tracks")) db.createObjectStore("tracks", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("media")) db.createObjectStore("media", { keyPath: "id", autoIncrement: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbGetAll(storeName) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbAdd(storeName, value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readwrite").objectStore(storeName).add(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function dbDelete(storeName, id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readwrite").objectStore(storeName).delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function renderMusic() {
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
  $("#track-list").innerHTML = cloudError ? `<div class="library-empty"><p>Cloud library unavailable.</p><small>${escapeHtml(cloudError)}</small></div>` : visibleTracks.length ? visibleTracks.map((track) => {
    return `<article class="track-row"><input class="track-select" type="checkbox" data-select-track="${track.id}" aria-label="Select ${escapeHtml(track.title)}" ${selectedTrackIds.has(String(track.id)) ? "checked" : ""} /><button class="track-play" type="button" data-play-track="${track.id}" aria-label="Play ${escapeHtml(track.title)}">▶</button><div class="track-copy"><strong>${escapeHtml(track.title)}</strong><small>${formatBytes(track.size_bytes)}</small></div><select data-assign-track="${track.id}" aria-label="Move ${escapeHtml(track.title)} to playlist"><option value="">No playlist</option>${playlistOptions}</select><button class="track-delete" type="button" data-delete-track="${track.id}" aria-label="Delete ${escapeHtml(track.title)}">×</button></article>`;
  }).join("") : '<div class="library-empty"><p>No songs here yet.</p><small>Add audio files from your device to begin.</small></div>';
  $$('[data-assign-track]').forEach((select) => { const track = tracks.find((item) => item.id === select.dataset.assignTrack); select.value = track?.playlist_id || ""; });
  updateTrackSelectionControls();
  renderDock();
}

function updateTrackSelectionControls() {
  const selectAll = $("#select-all-tracks");
  const deleteButton = $("#delete-selected-tracks");
  const visibleIds = visibleTracks.map((track) => String(track.id));
  const selectedVisible = visibleIds.filter((id) => selectedTrackIds.has(id)).length;
  selectAll.disabled = visibleIds.length === 0;
  selectAll.checked = visibleIds.length > 0 && selectedVisible === visibleIds.length;
  selectAll.indeterminate = selectedVisible > 0 && selectedVisible < visibleIds.length;
  deleteButton.disabled = selectedTrackIds.size === 0;
  deleteButton.textContent = selectedTrackIds.size ? `Delete ${selectedTrackIds.size}` : "Delete";
}

function renderDock() {
  const select = $("#dock-track-select");
  select.innerHTML = tracks.length ? '<option value="">Choose a song</option>' + tracks.map((track) => `<option value="${track.id}">${escapeHtml(track.title)}</option>`).join("") : '<option value="">No music added yet</option>';
  if (currentTrackId) select.value = String(currentTrackId);
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

async function deleteTrack(id) {
  if (!(await ensureCloudMusicAdmin()) || !confirm("Delete this song from the cloud library?")) return;
  const track = tracks.find((item) => item.id === String(id));
  if (!track) return;
  try { await musicCloud.deleteTrack(track); } catch (error) { return toast(error.message); }
  selectedTrackIds.delete(String(id));
  if (currentTrackId === id) { $("#audio-player").pause(); currentTrackId = null; $("#dock-title").textContent = "Nothing selected"; }
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

async function renderMedia() {
  mediaObjectUrls.forEach(URL.revokeObjectURL);
  mediaObjectUrls = [];
  let items = [];
  try { items = (await dbGetAll("media")).sort((a, b) => b.createdAt - a.createdAt); } catch { /* empty */ }
  $("#media-empty").hidden = items.length > 0;
  $("#media-gallery").innerHTML = items.map((item) => {
    const url = URL.createObjectURL(item.blob);
    mediaObjectUrls.push(url);
    const visual = item.type.startsWith("video/") ? `<video src="${url}" controls preload="metadata"></video>` : `<img src="${url}" alt="${escapeHtml(item.name)}" loading="lazy" />`;
    return `<figure class="media-item">${visual}<figcaption class="media-caption"><span>${escapeHtml(item.name)}</span><button class="media-delete" type="button" data-delete-media="${item.id}" aria-label="Delete ${escapeHtml(item.name)}">×</button></figcaption></figure>`;
  }).join("");
}

async function addMediaFiles(files) {
  if (!(await ensureAdmin()) || !files.length) return;
  let added = 0;
  for (const file of files) {
    try { await dbAdd("media", { name: file.name, type: file.type, size: file.size, createdAt: Date.now() + added, blob: file }); added += 1; } catch (error) { toast(`Could not store ${file.name}: ${error.message}`); }
  }
  toast(`${added} media file${added === 1 ? "" : "s"} added.`);
  renderMedia();
}

async function deleteMedia(id) {
  if (!(await ensureAdmin()) || !confirm("Delete this media file from this browser?")) return;
  await dbDelete("media", id);
  renderMedia();
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
    aviation: { title: "Aviation practice", src: "aviation/index.html" },
    mandarin: { title: "Mandarin notebook", src: "mandarin/index.html" },
    "mandarin-quiz": { title: "Mandarin practice", src: "mandarin/quiz.html" },
  };
  const app = apps[name];
  if (!app) return;
  $("#app-modal-title").textContent = app.title;
  $("#app-frame").src = app.src;
  $("#open-app-new-tab").href = app.src;
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
  $("#home-book-status").textContent = rawBook ? `${book.chapters.length} chapters · saved locally` : "Book not imported";
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
    $("#entry-error").textContent = "That password did not match.";
  }
});

$("#theme-toggle").addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
$("#mobile-menu-button").addEventListener("click", () => {
  const nav = $("#primary-nav");
  const open = nav.classList.toggle("open");
  $("#mobile-menu-button").setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", (event) => {
  const route = event.target.closest("[data-route]");
  if (route) { event.preventDefault(); routeTo(route.dataset.route); }
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

$$('.admin-action[data-entry-type]').forEach((button) => button.addEventListener("click", () => openEntryEditor(button.dataset.entryType)));
$("#page-resume").addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit-entry]");
  const remove = event.target.closest("[data-delete-entry]");
  if (edit) { const [kind, index] = edit.dataset.editEntry.split(":"); openEntryEditor(kind, index); }
  if (remove) { const [kind, index] = remove.dataset.deleteEntry.split(":"); deleteResumeEntry(kind, index); }
});
$("#entry-editor-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const kind = $("#entry-kind").value;
  const index = $("#entry-index").value;
  const entry = { title: $("#entry-title").value.trim(), organization: $("#entry-organization").value.trim(), dates: $("#entry-dates").value.trim(), location: $("#entry-location").value.trim(), description: $("#entry-description").value.trim() };
  const resume = getResume();
  if (index === "") resume[kind].push(entry); else resume[kind][Number(index)] = entry;
  writeJson(KEYS.resume, resume);
  $("#entry-editor-modal").hidden = true;
  setModalOpen(false);
  renderResume();
  toast("Resume saved on this device.");
});

$$('.launch-app').forEach((button) => button.addEventListener("click", () => openStudyApp(button.dataset.app, button.dataset.admin === "true")));
$("#close-app").addEventListener("click", closeStudyApp);

$("#open-book-studio").addEventListener("click", openBookStudio);
$("#close-book").addEventListener("click", closeBookStudio);
$("#chapter-menu").addEventListener("click", () => $(".chapter-rail").classList.toggle("open"));
$("#chapter-list").addEventListener("click", (event) => { const button = event.target.closest("[data-chapter-index]"); if (button) loadBookChapter(Number(button.dataset.chapterIndex)); });
$("#book-chapter-title").addEventListener("input", queueBookSave);
$("#book-chapter-content").addEventListener("input", queueBookSave);
$("#add-chapter").addEventListener("click", () => {
  const title = prompt("New chapter title:");
  if (!title?.trim()) return;
  const book = getBook();
  book.chapters.push({ id: `chapter-${Date.now()}`, title: title.trim(), content: "" });
  saveBook(book);
  loadBookChapter(book.chapters.length - 1);
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
$("#audio-player").addEventListener("play", updatePlayButton);
$("#audio-player").addEventListener("pause", updatePlayButton);
$("#audio-player").addEventListener("ended", () => stepTrack(1));

$("#add-media").addEventListener("click", async () => { if (await ensureAdmin()) $("#media-file-input").click(); });
$("#media-file-input").addEventListener("change", (event) => { addMediaFiles([...event.target.files]); event.target.value = ""; });
$("#media-gallery").addEventListener("click", (event) => { const remove = event.target.closest("[data-delete-media]"); if (remove) deleteMedia(Number(remove.dataset.deleteMedia)); });

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!$("#quick-ai-popover").hidden) toggleQuickAi(false);
  else if (!$("#app-modal").hidden) closeStudyApp();
  else if (!$("#book-modal").hidden) closeBookStudio();
  else if (!$("#entry-editor-modal").hidden) { $("#entry-editor-modal").hidden = true; setModalOpen(false); }
  else if (!$("#admin-modal").hidden) closeAdminModal(false);
});

/* Initial state */
applyTheme(localStorage.getItem(KEYS.theme) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
renderResume();
renderMusic();
renderMedia();
refreshDashboard();
const initialRoute = location.hash.slice(1);
if (["home", "resume", "interests", "music", "media"].includes(initialRoute)) routeTo(initialRoute);
if (sessionStorage.getItem("anthony_visitor_unlocked") === "1") showPortal();
if (musicCloud.isSignedIn()) syncStudyHistoryFromCloud();
