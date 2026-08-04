(() => {
  const themeKey = "anthony_portal_theme";
  const isEmbedded = new URLSearchParams(location.search).get("embedded") === "1" || window.self !== window.top;
  if (isEmbedded) document.documentElement.dataset.embedded = "true";

  function applySiteTheme(value) {
    const theme = value === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector("meta[name='theme-color']");
    if (themeColor) themeColor.setAttribute("content", theme === "dark" ? "#121713" : "#f2f4f0");
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(themeKey); } catch {}
  applySiteTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));

  window.addEventListener("storage", (event) => {
    if (event.key === themeKey && event.newValue) applySiteTheme(event.newValue);
  });
})();
