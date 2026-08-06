(() => {
  const themeKey = "anthony_portal_theme";

  function applySiteTheme(value) {
    const theme = value === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(themeKey, theme); } catch {}
    const themeColor = document.querySelector("meta[name='theme-color']");
    if (themeColor) themeColor.setAttribute("content", theme === "dark" ? "#121713" : "#f2f4f0");
    window.dispatchEvent(new CustomEvent("site-theme-change", { detail: { theme } }));
    return theme;
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(themeKey); } catch {}
  applySiteTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  window.setSiteTheme = applySiteTheme;
  window.toggleSiteTheme = () => applySiteTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

  window.addEventListener("storage", (event) => {
    if (event.key === themeKey && event.newValue) applySiteTheme(event.newValue);
  });
})();
