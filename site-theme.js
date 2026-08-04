(() => {
  const themeKey = "anthony_portal_theme";
  const isEmbedded = new URLSearchParams(location.search).get("embedded") === "1" || window.self !== window.top;
  if (isEmbedded) document.documentElement.dataset.embedded = "true";

  function portalRoute(url) {
    if (url.origin !== location.origin) return null;
    const pathParts = url.pathname.split("/").filter(Boolean);
    const isPortalPage = pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === "index.html");
    if (!isPortalPage) return null;
    const requested = url.searchParams.get("page");
    return ["resume", "interests", "music"].includes(requested) ? requested : "home";
  }

  function leaveEmbeddedView(route) {
    window.top.postMessage({ type: "anthony:portal-navigation", route }, location.origin);
  }

  if (isEmbedded) {
    document.addEventListener("click", (event) => {
      const link = event.target.closest?.("a[href]");
      if (!link || event.defaultPrevented || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const route = portalRoute(new URL(link.href, location.href));
      if (!route) return;
      event.preventDefault();
      leaveEmbeddedView(route);
    });

    const currentPortalRoute = portalRoute(new URL(location.href));
    if (currentPortalRoute) leaveEmbeddedView(currentPortalRoute);
  }

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
