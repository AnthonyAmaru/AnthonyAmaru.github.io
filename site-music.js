(() => {
  const bar = document.querySelector("[data-site-music-bar]");
  if (!bar || !window.musicCloud) return;

  const stateKey = "anthony_music_player_state_v1";
  const title = bar.querySelector("[data-site-music-title]");
  const songSelect = bar.querySelector("[data-site-music-select]");
  const playlistSelect = document.createElement("select");
  const queueButton = document.createElement("button");
  const menu = document.createElement("div");
  const audio = bar.querySelector("audio");
  const playButton = bar.querySelector("[data-site-music-play]");
  let playlists = [];
  let tracks = [];
  let activePlaylistId = "all";
  let currentTrackId = null;
  let lastSavedSecond = -1;

  playlistSelect.dataset.siteMusicPlaylist = "";
  playlistSelect.setAttribute("aria-label", "Choose and play a playlist");
  queueButton.type = "button";
  queueButton.dataset.siteMusicQueue = "";
  queueButton.setAttribute("aria-label", "Choose a playlist or song");
  queueButton.setAttribute("aria-expanded", "false");
  queueButton.setAttribute("aria-controls", "site-music-menu");
  queueButton.textContent = "♫";
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
  bar.append(queueButton, menu);

  function readState() {
    try { return JSON.parse(sessionStorage.getItem(stateKey)) || null; } catch { return null; }
  }

  function queueTracks() {
    return activePlaylistId === "all"
      ? tracks
      : tracks.filter((track) => String(track.playlist_id) === activePlaylistId);
  }

  function saveState() {
    const track = tracks.find((item) => String(item.id) === String(currentTrackId));
    sessionStorage.setItem(stateKey, JSON.stringify({
      playlistId: activePlaylistId,
      trackId: track ? String(track.id) : null,
      title: track?.title || title.textContent,
      currentTime: track ? Number(audio.currentTime || 0) : 0,
      playing: Boolean(track && !audio.paused),
    }));
  }

  function updatePlayButton() { playButton.textContent = audio.paused ? "▶" : "❚❚"; }

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
  }

  async function loadTrack(id, options = {}) {
    const track = queueTracks().find((item) => String(item.id) === String(id));
    if (!track) return;
    currentTrackId = String(track.id);
    title.textContent = track.title;
    songSelect.value = currentTrackId;
    if (audio.src !== track.url) audio.src = track.url;
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
    const nextIndex = index < 0 ? 0 : (index + direction + queue.length) % queue.length;
    loadTrack(queue[nextIndex].id, { play: true });
  }

  async function initialize() {
    let library;
    try {
      library = await musicCloud.list("anthony");
      tracks = Array.isArray(library) ? library : library.tracks || [];
      playlists = Array.isArray(library) ? [] : library.playlists || [];
    } catch {
      title.textContent = "Music unavailable";
      return;
    }

    const saved = readState();
    activePlaylistId = saved?.playlistId || "all";
    if (saved?.trackId && !queueTracks().some((track) => String(track.id) === String(saved.trackId))) activePlaylistId = "all";
    renderMenus();
    if (saved?.trackId && queueTracks().some((track) => String(track.id) === String(saved.trackId))) {
      await loadTrack(saved.trackId, { currentTime: saved.currentTime, play: saved.playing });
    }
  }

  playButton.addEventListener("click", () => {
    if (!audio.src && queueTracks().length) return loadTrack(queueTracks()[0].id, { play: true });
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  bar.querySelector("[data-site-music-previous]").addEventListener("click", () => step(-1));
  bar.querySelector("[data-site-music-next]").addEventListener("click", () => step(1));
  queueButton.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    queueButton.setAttribute("aria-expanded", String(!menu.hidden));
  });
  playlistSelect.addEventListener("change", () => playPlaylist(playlistSelect.value));
  songSelect.addEventListener("change", () => { if (songSelect.value) loadTrack(songSelect.value, { play: true }); });
  audio.addEventListener("play", () => { updatePlayButton(); saveState(); });
  audio.addEventListener("pause", () => { updatePlayButton(); saveState(); });
  audio.addEventListener("ended", () => step(1));
  audio.addEventListener("timeupdate", () => {
    const second = Math.floor(audio.currentTime);
    if (second !== lastSavedSecond && second % 3 === 0) { lastSavedSecond = second; saveState(); }
  });
  window.addEventListener("pagehide", saveState);
  document.addEventListener("click", (event) => {
    if (menu.hidden || event.target.closest(".site-music-menu") || event.target.closest("[data-site-music-queue]")) return;
    menu.hidden = true;
    queueButton.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menu.hidden) return;
    menu.hidden = true;
    queueButton.setAttribute("aria-expanded", "false");
    queueButton.focus();
  });
  initialize();
})();
