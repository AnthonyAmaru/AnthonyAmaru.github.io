(() => {
  if (document.documentElement.dataset.embedded === "true") return;
  const bar = document.querySelector("[data-site-music-bar]");
  if (!bar || !window.musicCloud) return;

  const stateKey = "anthony_music_player_state_v1";
  const librarySite = "shared";
  const title = bar.querySelector("[data-site-music-title]");
  const songSelect = bar.querySelector("[data-site-music-select]");
  const playlistSelect = document.createElement("select");
  const queueButton = document.createElement("button");
  const shuffleButton = document.createElement("button");
  const menu = document.createElement("div");
  const audio = bar.querySelector("audio");
  const playButton = bar.querySelector("[data-site-music-play]");
  let playlists = [];
  let tracks = [];
  let activePlaylistId = "all";
  let currentTrackId = null;
  let shuffleEnabled = false;
  let shuffledTrackIds = [];
  let lastSavedSecond = -1;
  let navigationHandoff = false;

  playlistSelect.dataset.siteMusicPlaylist = "";
  playlistSelect.setAttribute("aria-label", "Choose and play a playlist");
  queueButton.type = "button";
  queueButton.dataset.siteMusicQueue = "";
  queueButton.setAttribute("aria-label", "Choose a playlist or song");
  queueButton.setAttribute("aria-expanded", "false");
  queueButton.setAttribute("aria-controls", "site-music-menu");
  queueButton.textContent = "♫";
  shuffleButton.type = "button";
  shuffleButton.dataset.siteMusicShuffle = "";
  shuffleButton.setAttribute("aria-label", "Shuffle songs");
  shuffleButton.setAttribute("aria-pressed", "false");
  shuffleButton.textContent = "Shuffle";
  menu.id = "site-music-menu";
  menu.className = "site-music-menu";
  menu.hidden = true;
  const playlistLabel = document.createElement("label");
  playlistLabel.textContent = "Play a playlist";
  playlistLabel.append(playlistSelect);
  const songLabel = document.createElement("label");
  songLabel.textContent = "Choose a song";
  songLabel.append(songSelect);
  menu.append(playlistLabel, songLabel);
  bar.insertBefore(queueButton, bar.firstElementChild);
  bar.insertBefore(shuffleButton, bar.querySelector("[data-site-music-previous]"));
  bar.append(menu);
  const copy = bar.querySelector(".site-music-copy");
  const timeline = document.createElement("div");
  timeline.className = "site-music-timeline";
  timeline.innerHTML = '<span data-site-music-current>0:00</span><input data-site-music-progress type="range" min="0" max="0" value="0" step="0.1" aria-label="Song position in music bar" disabled /><span data-site-music-duration>0:00</span>';
  copy?.append(timeline);
  const progress = timeline.querySelector("[data-site-music-progress]");

  function formatPlaybackTime(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  }

  function syncProgress() {
    const hasTrack = currentTrackId !== null && Boolean(audio.src);
    const duration = hasTrack && Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    const current = duration ? Math.min(duration, Math.max(0, audio.currentTime || 0)) : 0;
    progress.max = String(duration || 0);
    progress.value = String(current);
    progress.disabled = !duration;
    progress.style.setProperty("--music-progress", `${duration ? (current / duration) * 100 : 0}%`);
    timeline.querySelector("[data-site-music-current]").textContent = formatPlaybackTime(current);
    timeline.querySelector("[data-site-music-duration]").textContent = formatPlaybackTime(duration);
  }

  function readState() {
    try { return JSON.parse(sessionStorage.getItem(stateKey)) || null; } catch { return null; }
  }

  function baseQueue() {
    return activePlaylistId === "all" ? tracks : tracks.filter((track) => String(track.playlist_id) === activePlaylistId);
  }

  function refreshShuffle() {
    shuffledTrackIds = baseQueue().map((track) => String(track.id));
    for (let index = shuffledTrackIds.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [shuffledTrackIds[index], shuffledTrackIds[other]] = [shuffledTrackIds[other], shuffledTrackIds[index]];
    }
  }

  function queueTracks() {
    const base = baseQueue();
    if (!shuffleEnabled) return base;
    const byId = new Map(base.map((track) => [String(track.id), track]));
    shuffledTrackIds = shuffledTrackIds.filter((id) => byId.has(id));
    base.forEach((track) => { if (!shuffledTrackIds.includes(String(track.id))) shuffledTrackIds.push(String(track.id)); });
    return shuffledTrackIds.map((id) => byId.get(id)).filter(Boolean);
  }

  function saveState(options = {}) {
    const track = tracks.find((item) => String(item.id) === String(currentTrackId));
    const previous = readState();
    const playing = Boolean(track && (options.keepPlaying ? (!audio.paused || previous?.playing) : !audio.paused));
    sessionStorage.setItem(stateKey, JSON.stringify({
      playlistId: activePlaylistId,
      trackId: track ? String(track.id) : null,
      title: track?.title || title.textContent,
      currentTime: track ? Number(audio.currentTime || 0) : 0,
      playing,
      shuffle: shuffleEnabled,
    }));
  }

  function updatePlayButton() {
    playButton.textContent = audio.paused ? "▶" : "❚❚";
    playButton.setAttribute("aria-label", audio.paused ? "Play" : "Pause");
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = currentTrackId ? (audio.paused ? "paused" : "playing") : "none";
    syncProgress();
  }

  function trackArtist(track) {
    return String(track?.source_metadata?.artist || "").trim() || "Unknown artist";
  }

  function playerTrackLabel(track) {
    const artist = trackArtist(track);
    return artist && artist !== "Unknown artist" ? `${track.title} · ${artist}` : track.title;
  }

  function updateMediaSession(track) {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined" || !track) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: trackArtist(track),
      album: "Anthony Amaru",
      artwork: [{ src: new URL("/anthony-icon-512.png", location.href).href, sizes: "512x512", type: "image/png" }],
    });
  }

  function updateMediaPosition() {
    syncProgress();
    if (!("mediaSession" in navigator) || typeof navigator.mediaSession.setPositionState !== "function" || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    try { navigator.mediaSession.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate, position: Math.min(audio.currentTime, audio.duration) }); } catch {}
  }

  function renderMenus() {
    const validPlaylist = activePlaylistId === "all" || playlists.some((playlist) => String(playlist.id) === activePlaylistId);
    if (!validPlaylist) activePlaylistId = "all";
    playlistSelect.replaceChildren(new Option(`All songs (${tracks.length})`, "all"));
    playlists.forEach((playlist) => {
      const count = tracks.filter((track) => String(track.playlist_id) === String(playlist.id)).length;
      playlistSelect.add(new Option(`${playlist.name} (${count})`, String(playlist.id)));
    });
    playlistSelect.value = activePlaylistId;
    const queue = queueTracks();
    songSelect.replaceChildren(new Option(queue.length ? "Choose a song" : "No songs in this playlist", ""));
    queue.forEach((track) => songSelect.add(new Option(track.title, String(track.id))));
    songSelect.value = queue.some((track) => String(track.id) === String(currentTrackId)) ? String(currentTrackId) : "";
    shuffleButton.setAttribute("aria-pressed", String(shuffleEnabled));
  }

  async function loadTrack(id, options = {}) {
    const track = tracks.find((item) => String(item.id) === String(id));
    if (!track) return;
    if (!queueTracks().some((item) => String(item.id) === String(track.id))) {
      activePlaylistId = "all";
      if (shuffleEnabled) refreshShuffle();
    }
    const sameTrack = String(currentTrackId) === String(track.id) && Boolean(audio.src);
    currentTrackId = String(track.id);
    title.textContent = playerTrackLabel(track);
    if (!sameTrack) audio.src = track.url;
    renderMenus();
    updateMediaSession(track);
    if (Number(options.currentTime) > 0) {
      const seek = () => { audio.currentTime = Math.min(Number(options.currentTime), Number.isFinite(audio.duration) ? audio.duration : Number(options.currentTime)); };
      if (audio.readyState >= 1) seek(); else audio.addEventListener("loadedmetadata", seek, { once: true });
    }
    if (options.play) await audio.play().catch(() => {});
    updatePlayButton();
    saveState();
  }

  async function playPlaylist(id) {
    activePlaylistId = id === "all" || playlists.some((playlist) => String(playlist.id) === String(id)) ? String(id) : "all";
    currentTrackId = null;
    if (shuffleEnabled) refreshShuffle();
    renderMenus();
    const queue = queueTracks();
    if (queue.length) return loadTrack(queue[0].id, { play: true });
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    const playlist = playlists.find((item) => String(item.id) === activePlaylistId);
    title.textContent = playlist ? `${playlist.name} is empty` : "No music added yet";
    updatePlayButton();
    saveState();
  }

  function step(direction) {
    const queue = queueTracks();
    if (!queue.length) return;
    const index = queue.findIndex((track) => String(track.id) === String(currentTrackId));
    loadTrack(queue[index < 0 ? 0 : (index + direction + queue.length) % queue.length].id, { play: true });
  }

  function installMediaSession() {
    if (!("mediaSession" in navigator)) return;
    const handlers = {
      play: () => audio.play().catch(() => {}), pause: () => audio.pause(),
      previoustrack: () => step(-1), nexttrack: () => step(1),
      seekbackward: (details) => { audio.currentTime = Math.max(0, audio.currentTime - (details.seekOffset || 10)); },
      seekforward: (details) => { audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + (details.seekOffset || 10)); },
      seekto: (details) => { if (Number.isFinite(details.seekTime)) audio.currentTime = details.seekTime; },
    };
    Object.entries(handlers).forEach(([action, handler]) => { try { navigator.mediaSession.setActionHandler(action, handler); } catch {} });
  }

  async function initialize() {
    let library;
    try {
      library = await musicCloud.list(librarySite);
      tracks = Array.isArray(library) ? library : library.tracks || [];
      playlists = Array.isArray(library) ? [] : library.playlists || [];
    } catch {
      title.textContent = "Music unavailable";
      return;
    }
    const saved = readState();
    activePlaylistId = saved?.playlistId || "all";
    if (activePlaylistId !== "all" && !playlists.some((playlist) => String(playlist.id) === String(activePlaylistId))) activePlaylistId = "all";
    shuffleEnabled = Boolean(saved?.shuffle);
    if (shuffleEnabled) refreshShuffle();
    if (saved?.trackId && !queueTracks().some((track) => String(track.id) === String(saved.trackId))) {
      activePlaylistId = "all";
      if (shuffleEnabled) refreshShuffle();
    }
    renderMenus();
    if (saved?.trackId && tracks.some((track) => String(track.id) === String(saved.trackId))) await loadTrack(saved.trackId, { currentTime: saved.currentTime, play: saved.playing });
  }

  playButton.addEventListener("click", () => {
    if (!audio.src && queueTracks().length) return loadTrack(queueTracks()[0].id, { play: true });
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  bar.querySelector("[data-site-music-previous]").addEventListener("click", () => step(-1));
  bar.querySelector("[data-site-music-next]").addEventListener("click", () => step(1));
  shuffleButton.addEventListener("click", () => { shuffleEnabled = !shuffleEnabled; if (shuffleEnabled) refreshShuffle(); renderMenus(); saveState(); });
  queueButton.addEventListener("click", () => { menu.hidden = !menu.hidden; queueButton.setAttribute("aria-expanded", String(!menu.hidden)); });
  playlistSelect.addEventListener("change", () => playPlaylist(playlistSelect.value));
  songSelect.addEventListener("change", () => { if (songSelect.value) loadTrack(songSelect.value, { play: true }); });
  progress.addEventListener("input", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    audio.currentTime = Math.min(audio.duration, Math.max(0, Number(progress.value)));
    syncProgress();
  });
  progress.addEventListener("change", saveState);
  audio.addEventListener("play", () => { updatePlayButton(); saveState(); });
  audio.addEventListener("pause", () => { updatePlayButton(); if (!navigationHandoff) saveState(); });
  audio.addEventListener("ended", () => step(1));
  audio.addEventListener("loadedmetadata", updateMediaPosition);
  audio.addEventListener("durationchange", updateMediaPosition);
  audio.addEventListener("timeupdate", () => {
    updateMediaPosition();
    const second = Math.floor(audio.currentTime);
    if (second !== lastSavedSecond && second % 3 === 0) { lastSavedSecond = second; saveState(); }
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !currentTrackId || audio.paused) return;
    navigationHandoff = true;
    saveState({ keepPlaying: true });
  }, true);
  window.addEventListener("beforeunload", () => {
    navigationHandoff = Boolean(currentTrackId && !audio.paused) || navigationHandoff;
    saveState({ keepPlaying: navigationHandoff });
  });
  window.addEventListener("pagehide", () => saveState({ keepPlaying: navigationHandoff }));
  document.addEventListener("click", (event) => {
    if (menu.hidden || event.target.closest(".site-music-menu") || event.target.closest("[data-site-music-queue]")) return;
    menu.hidden = true; queueButton.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menu.hidden) return;
    menu.hidden = true; queueButton.setAttribute("aria-expanded", "false"); queueButton.focus();
  });
  installMediaSession();
  initialize();
})();
