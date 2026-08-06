(() => {
  const VOICE_KEY = "anthony_mandarin_voice_v1";
  const RATE_KEY = "anthony_mandarin_voice_rate_v1";
  const DEFAULT_RATE = 0.82;
  const TEST_PHRASE = "你好，我正在学习中文。";
  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;

  let mandarinVoices = [];
  let voiceSelect;
  let rateInput;
  let rateOutput;
  let testButton;

  function voiceId(voice) {
    return voice.voiceURI || `${voice.name}|${voice.lang}`;
  }

  function savedRate() {
    const value = Number(localStorage.getItem(RATE_KEY));
    return Number.isFinite(value) && value >= 0.6 && value <= 1.2 ? value : DEFAULT_RATE;
  }

  function scoreVoice(voice) {
    const name = voice.name.toLowerCase();
    let score = 0;
    if (/^zh[-_]cn$/i.test(voice.lang)) score += 40;
    if (voice.localService) score += 20;
    if (voice.default) score += 10;
    if (/premium|enhanced|natural|neural|tingting|xiaoxiao|yating|meijia/i.test(name)) score += 30;
    return score;
  }

  function refreshVoices() {
    if (!synth) return;
    mandarinVoices = synth
      .getVoices()
      .filter((voice) => /^zh(?:-|_)/i.test(voice.lang))
      .sort((left, right) => scoreVoice(right) - scoreVoice(left) || left.name.localeCompare(right.name));

    if (!voiceSelect) return;
    const savedVoice = localStorage.getItem(VOICE_KEY) || "";
    voiceSelect.replaceChildren(new Option("Automatic", ""));
    mandarinVoices.forEach((voice) => {
      voiceSelect.add(new Option(`${voice.name} · ${voice.lang.replace("_", "-")}`, voiceId(voice)));
    });
    voiceSelect.value = mandarinVoices.some((voice) => voiceId(voice) === savedVoice) ? savedVoice : "";
  }

  function selectedVoice() {
    const savedVoice = localStorage.getItem(VOICE_KEY) || "";
    return mandarinVoices.find((voice) => voiceId(voice) === savedVoice) || mandarinVoices[0] || null;
  }

  function speak(text) {
    const cleanText = String(text || "").trim();
    if (!synth || !cleanText) return false;
    refreshVoices();
    const voice = selectedVoice();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voice?.lang || "zh-CN";
    utterance.voice = voice;
    utterance.rate = savedRate();
    utterance.pitch = 1;
    utterance.volume = 1;
    synth.cancel();
    synth.speak(utterance);
    return true;
  }

  function updateRate(value) {
    const rate = Math.min(1.2, Math.max(0.6, Number(value) || DEFAULT_RATE));
    localStorage.setItem(RATE_KEY, String(rate));
    if (rateInput) rateInput.value = String(rate);
    if (rateOutput) rateOutput.value = `${rate.toFixed(2)}×`;
  }

  function buildSettings() {
    const menu = document.querySelector(".mandarin-section-menu");
    if (!menu || document.querySelector("[data-mandarin-speech-settings]")) return;

    const trigger = document.createElement("button");
    trigger.className = "mandarin-voice-settings-trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "mandarin-voice-settings");
    trigger.innerHTML = '<span aria-hidden="true">🔊</span> Voice';

    const panel = document.createElement("section");
    panel.id = "mandarin-voice-settings";
    panel.className = "mandarin-speech-settings";
    panel.dataset.mandarinSpeechSettings = "";
    panel.hidden = true;
    panel.innerHTML = `
      <label class="mandarin-voice-field">
        <span>Voice</span>
        <select data-mandarin-voice aria-label="Mandarin voice"></select>
      </label>
      <label class="mandarin-rate-field">
        <span>Speed <output data-mandarin-rate-output></output></span>
        <input data-mandarin-rate type="range" min="0.6" max="1.2" step="0.01" aria-label="Mandarin voice speed" />
      </label>
      <button class="mandarin-voice-test" type="button">Test</button>
    `;

    menu.append(trigger);
    menu.after(panel);
    voiceSelect = panel.querySelector("[data-mandarin-voice]");
    rateInput = panel.querySelector("[data-mandarin-rate]");
    rateOutput = panel.querySelector("[data-mandarin-rate-output]");
    testButton = panel.querySelector(".mandarin-voice-test");

    updateRate(savedRate());
    refreshVoices();

    if (!synth) {
      voiceSelect.replaceChildren(new Option("Unavailable", ""));
      voiceSelect.disabled = true;
      testButton.disabled = true;
    }

    trigger.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      trigger.setAttribute("aria-expanded", String(!panel.hidden));
      if (!panel.hidden) refreshVoices();
    });
    voiceSelect.addEventListener("change", () => {
      if (voiceSelect.value) localStorage.setItem(VOICE_KEY, voiceSelect.value);
      else localStorage.removeItem(VOICE_KEY);
    });
    rateInput.addEventListener("input", () => updateRate(rateInput.value));
    testButton.addEventListener("click", () => speak(TEST_PHRASE));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });
  }

  window.MandarinSpeech = { speak, refreshVoices, getRate: savedRate };
  if (synth) {
    if (synth.addEventListener) synth.addEventListener("voiceschanged", refreshVoices);
    else synth.onvoiceschanged = refreshVoices;
    refreshVoices();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildSettings, { once: true });
  else buildSettings();
})();
