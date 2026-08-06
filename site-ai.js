(() => {
  const bar = document.querySelector("[data-site-music-bar]");
  if (!bar || !window.musicCloud || bar.querySelector("[data-site-ai-toggle]")) return;

  const email = "anthonyamaru93@gmail.com";
  const context = location.pathname.includes("aviation") ? { topic: "Aviation", scope: "aviation" }
    : location.pathname.includes("mandarin") ? { topic: "Mandarin", scope: "mandarin" }
      : location.pathname.includes("fatherhood") ? { topic: "Fatherhood", scope: "anthony" }
        : { topic: "General", scope: "anthony" };
  const toggle = document.createElement("button");
  const popover = document.createElement("div");

  toggle.type = "button";
  toggle.className = "site-ai-toggle";
  toggle.dataset.siteAiToggle = "";
  toggle.setAttribute("aria-label", "Ask AI");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "site-ai-popover");
  toggle.textContent = "AI";
  popover.id = "site-ai-popover";
  popover.className = "site-ai-popover";
  popover.hidden = true;
  popover.innerHTML = `
    <div class="site-ai-heading"><strong>Ask AI</strong><button type="button" data-site-ai-close aria-label="Close AI">×</button></div>
    <form data-site-ai-auth>
      <label for="site-ai-password">Admin password</label>
      <input id="site-ai-password" type="password" autocomplete="current-password" required />
      <button type="submit">Unlock</button>
    </form>
    <form data-site-ai-form>
      <textarea rows="3" maxlength="8000" placeholder="Ask one question" aria-label="Question for AI" required></textarea>
      <button type="submit">Ask</button>
    </form>
    <div class="site-ai-answer" data-site-ai-answer role="status" aria-live="polite" hidden></div>`;
  bar.append(toggle, popover);

  const authForm = popover.querySelector("[data-site-ai-auth]");
  const askForm = popover.querySelector("[data-site-ai-form]");
  const password = popover.querySelector("#site-ai-password");
  const input = askForm.querySelector("textarea");
  const answer = popover.querySelector("[data-site-ai-answer]");

  function syncAuth() {
    const connected = musicCloud.isSignedIn();
    authForm.hidden = connected;
    askForm.hidden = !connected;
    window.dispatchEvent(new CustomEvent("site-cloud-change"));
    return connected;
  }

  function setOpen(open) {
    popover.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) return;
    document.querySelector("#site-music-menu")?.setAttribute("hidden", "");
    document.querySelector("[data-site-music-queue]")?.setAttribute("aria-expanded", "false");
    syncAuth();
    requestAnimationFrame(() => (musicCloud.isSignedIn() ? input : password).focus());
  }

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = authForm.querySelector("button");
    submit.disabled = true;
    answer.hidden = false;
    answer.textContent = "Unlocking…";
    try {
      await musicCloud.signIn(email, password.value);
      sessionStorage.setItem("anthony_admin_unlocked", "1");
      password.value = "";
      answer.hidden = true;
      syncAuth();
      input.focus();
    } catch (error) {
      answer.textContent = `Could not unlock: ${error.message}`;
    } finally {
      submit.disabled = false;
    }
  });

  askForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || !syncAuth()) return;
    const submit = askForm.querySelector("button");
    answer.hidden = false;
    answer.textContent = "Thinking…";
    submit.disabled = true;
    try {
      const result = await musicCloud.invokeFunction("big-pickle", { scope: context.scope, topic: context.topic, message: question });
      if (typeof result?.content !== "string") throw new Error("The AI response was empty.");
      answer.textContent = result.content.trim();
    } catch (error) {
      if (error.status === 401) {
        await musicCloud.signOut();
        syncAuth();
      }
      answer.textContent = `I couldn't answer that: ${error.message}`;
    } finally {
      submit.disabled = false;
      input.focus();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    askForm.requestSubmit();
  });
  toggle.addEventListener("click", () => setOpen(popover.hidden));
  popover.querySelector("[data-site-ai-close]").addEventListener("click", () => setOpen(false));
  window.addEventListener("site-cloud-unlock-request", () => setOpen(true));
  document.addEventListener("click", (event) => {
    if (!popover.hidden && !event.target.closest("#site-ai-popover") && !event.target.closest("[data-site-ai-toggle]") && !event.target.closest("[data-main-site-cloud]")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !popover.hidden) setOpen(false); });
  syncAuth();
})();
