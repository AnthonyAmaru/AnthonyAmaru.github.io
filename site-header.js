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

  let siteFooter = document.querySelector("body > footer.site-footer, body > footer");
  if (!siteFooter) {
    siteFooter = document.createElement("footer");
    siteFooter.className = "main-site-generated-footer";
    document.body.append(siteFooter);
  }
  siteFooter.dataset.mainSiteFooter = "";

  let footerControls = siteFooter.querySelector(".main-site-footer-controls");
  if (!footerControls) {
    footerControls = document.createElement("div");
    footerControls.className = "main-site-footer-controls";
    siteFooter.append(footerControls);
  }

  let footerNav = footerControls.querySelector(".main-site-footer-nav");
  if (!footerNav) {
    footerNav = document.createElement("nav");
    footerNav.className = "main-site-footer-nav";
    footerNav.setAttribute("aria-label", "Footer navigation");
    mainSiteNav?.querySelectorAll("a").forEach((link) => footerNav.append(link.cloneNode(true)));
    footerControls.append(footerNav);
  }

  let cloudButton = document.querySelector("[data-main-site-cloud]");
  if (!cloudButton) {
    cloudButton = document.createElement("button");
    cloudButton.type = "button";
    cloudButton.className = "main-site-cloud";
    cloudButton.dataset.mainSiteCloud = "";
    cloudButton.innerHTML = '<span class="main-site-status-dot" aria-hidden="true"></span><span data-main-site-cloud-label>Cloud locked</span>';
  }
  footerControls.append(cloudButton);

  footerNav.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    const embedded = document.documentElement.dataset.embedded === "true" || new URLSearchParams(location.search).get("embedded") === "1";
    if (!link || !embedded || window.parent === window) return;
    event.preventDefault();
    const route = new URL(link.href, location.href).searchParams.get("page") || "home";
    window.parent.postMessage({ type: "anthony-portal-nav", route }, location.origin);
  });

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
