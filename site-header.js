function keepSingleSiteElement(selector) {
  [...document.querySelectorAll(selector)].slice(1).forEach((element) => element.remove());
}

keepSingleSiteElement(".main-site-header");
keepSingleSiteElement(".site-music-bar");

const mainSiteHeader = document.querySelector(".main-site-header");
const mainSiteMenu = document.querySelector("[data-main-site-menu]");
const mainSiteNav = document.querySelector("[data-main-site-nav]");

if (mainSiteHeader) {
  let actions = mainSiteHeader.querySelector(".main-site-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.className = "main-site-actions";
    mainSiteHeader.append(actions);
  }

  let themeButton = actions.querySelector("[data-main-site-theme]");
  if (!themeButton) {
    themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "main-site-theme";
    themeButton.dataset.mainSiteTheme = "";
    actions.append(themeButton);
  }

  let cloudButton = actions.querySelector("[data-main-site-cloud]");
  if (!cloudButton) {
    cloudButton = document.createElement("button");
    cloudButton.type = "button";
    cloudButton.className = "main-site-cloud";
    cloudButton.dataset.mainSiteCloud = "";
    cloudButton.innerHTML = '<span class="main-site-status-dot" aria-hidden="true"></span><span data-main-site-cloud-label>Cloud locked</span>';
    actions.append(cloudButton);
  }

  const syncThemeButton = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    themeButton.textContent = dark ? "☀" : "☾";
    themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeButton.title = dark ? "Light mode" : "Dark mode";
  };
  const syncCloudButton = () => {
    const connected = Boolean(window.musicCloud?.isSignedIn());
    cloudButton.classList.toggle("connected", connected);
    cloudButton.querySelector("[data-main-site-cloud-label]").textContent = connected ? "Cloud synced" : "Cloud locked";
    cloudButton.setAttribute("aria-label", connected ? "Cloud synced for this session" : "Unlock cloud tools");
  };

  themeButton.addEventListener("click", () => {
    if (window.toggleSiteTheme) window.toggleSiteTheme();
    else document.documentElement.dataset.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    syncThemeButton();
  });
  cloudButton.addEventListener("click", () => window.dispatchEvent(new CustomEvent("site-cloud-unlock-request")));
  window.addEventListener("site-theme-change", syncThemeButton);
  window.addEventListener("site-cloud-change", syncCloudButton);
  window.addEventListener("storage", (event) => { if (event.key === "anthony_portal_theme") syncThemeButton(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) syncCloudButton(); });
  window.syncSiteCloudStatus = syncCloudButton;
  syncThemeButton();
  syncCloudButton();
}

if (mainSiteMenu && mainSiteNav) {
  mainSiteMenu.addEventListener("click", () => {
    const open = mainSiteNav.classList.toggle("open");
    mainSiteMenu.setAttribute("aria-expanded", String(open));
  });

  mainSiteNav.addEventListener("click", () => {
    mainSiteNav.classList.remove("open");
    mainSiteMenu.setAttribute("aria-expanded", "false");
  });
}
