(() => {
  const bar = document.querySelector("[data-site-music-bar]");
  if (!bar || !window.musicCloud) return;

  const stateKey = "anthony_music_player_state_v1";
  const title = bar.querySelector("[data-site-music-title]");
  const select = bar.querySelector("[data-site-music-select]");
  const audio = bar.querySelector("audio");
  const playButton = bar.querySelector("[data-site-music-play]");
  let tracks = [];
  let currentTrackId = null;
  let lastSavedSecond = -1;

  function readState() {
    try { return JSON.parse(sessionStorage.getItem(stateKey)) || null; } catch { return null; }
  }

  function saveState() {
    const track = tracks.find((item) => String(item.id) === String(currentTrackId));
    if (!track) return;
    sessionStorage.setItem(stateKey, JSON.stringify({
      trackId: String(track.id),
      title: track.title,
      currentTime: Number(audio.currentTime || 0),
      playing: !audio.paused,
    }));
  }

  function updatePlayButton() { playButton.textContent = audio.paused ? "▶" : "❚❚"; }

  async function loadTrack(id, options = {}) {
    const track = tracks.find((item) => String(item.id) === String(id));
    if (!track) return;
    currentTrackId = String(track.id);
    title.textContent = track.title;
    select.value = currentTrackId;
    if (audio.src !== track.url) audio.src = track.url;
    if (Number(options.currentTime) > 0) {
      const seek = () => { audio.currentTime = Math.min(Number(options.currentTime), Number.isFinite(audio.duration) ? audio.duration : Number(options.currentTime)); };
      if (audio.readyState >= 1) seek(); else audio.addEventListener("loadedmetadata", seek, { once: true });
    }
    if (options.play) await audio.play().catch(() => {});
    updatePlayButton();
    saveState();
  }

  function step(direction) {
    if (!tracks.length) return;
    const index = Math.max(0, tracks.findIndex((track) => String(track.id) === String(currentTrackId)));
    loadTrack(tracks[(index + direction + tracks.length) % tracks.length].id, { play: true });
  }

  async function initialize() {
    try {
      const library = await musicCloud.list("anthony");
      tracks = Array.isArray(library) ? library : library.tracks || [];
    } catch {
      title.textContent = "Music unavailable";
      return;
    }

    select.replaceChildren(new Option(tracks.length ? "Choose a song" : "No music added yet", ""));
    tracks.forEach((track) => select.add(new Option(track.title, String(track.id))));
    const saved = readState();
    if (saved?.trackId && tracks.some((track) => String(track.id) === String(saved.trackId))) {
      await loadTrack(saved.trackId, { currentTime: saved.currentTime, play: saved.playing });
    }
  }

  playButton.addEventListener("click", () => {
    if (!audio.src && tracks.length) return loadTrack(tracks[0].id, { play: true });
    if (audio.paused) audio.play().catch(() => {}); else audio.pause();
  });
  bar.querySelector("[data-site-music-previous]").addEventListener("click", () => step(-1));
  bar.querySelector("[data-site-music-next]").addEventListener("click", () => step(1));
  select.addEventListener("change", () => { if (select.value) loadTrack(select.value, { play: true }); });
  audio.addEventListener("play", () => { updatePlayButton(); saveState(); });
  audio.addEventListener("pause", () => { updatePlayButton(); saveState(); });
  audio.addEventListener("ended", () => step(1));
  audio.addEventListener("timeupdate", () => {
    const second = Math.floor(audio.currentTime);
    if (second !== lastSavedSecond && second % 3 === 0) { lastSavedSecond = second; saveState(); }
  });
  window.addEventListener("pagehide", saveState);
  initialize();
})();
