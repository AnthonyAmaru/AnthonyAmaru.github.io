function keepSingleSiteElement(selector) {
  [...document.querySelectorAll(selector)].slice(1).forEach((element) => element.remove());
}

keepSingleSiteElement(".main-site-header");
keepSingleSiteElement(".site-music-bar");

const mainSiteMenu = document.querySelector("[data-main-site-menu]");
const mainSiteNav = document.querySelector("[data-main-site-nav]");
const mainSiteHeader = document.querySelector(".main-site-header");

if (mainSiteHeader && !mainSiteHeader.querySelector("[data-main-site-theme]")) {
  const themeButton = document.createElement("button");
  themeButton.type = "button";
  themeButton.className = "main-site-theme";
  themeButton.dataset.mainSiteTheme = "";
  const syncThemeButton = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    themeButton.textContent = dark ? "☀" : "☾";
    themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    themeButton.title = dark ? "Light mode" : "Dark mode";
  };
  mainSiteHeader.insertBefore(themeButton, mainSiteMenu || mainSiteNav);
  themeButton.addEventListener("click", () => {
    if (window.toggleSiteTheme) window.toggleSiteTheme();
    else document.documentElement.dataset.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    syncThemeButton();
  });
  window.addEventListener("site-theme-change", syncThemeButton);
  window.addEventListener("storage", (event) => { if (event.key === "anthony_portal_theme") syncThemeButton(); });
  syncThemeButton();
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
