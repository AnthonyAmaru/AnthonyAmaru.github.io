function keepSingleSiteElement(selector) {
  [...document.querySelectorAll(selector)].slice(1).forEach((element) => element.remove());
}

keepSingleSiteElement(".main-site-header");
keepSingleSiteElement(".site-music-bar");
keepSingleSiteElement(".go-back-button");

const mainSiteMenu = document.querySelector("[data-main-site-menu]");
const mainSiteNav = document.querySelector("[data-main-site-nav]");

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

if (!document.querySelector(".go-back-button")) {
  const goBackButton = document.createElement("button");
  goBackButton.className = "go-back-button";
  goBackButton.type = "button";
  goBackButton.setAttribute("aria-label", "Go back to the previous page");
  goBackButton.textContent = "GO BACK";
  goBackButton.addEventListener("click", () => {
    let sameSiteReferrer = false;
    try { sameSiteReferrer = new URL(document.referrer).origin === location.origin; } catch { /* Use the Interests fallback. */ }
    if (sameSiteReferrer && history.length > 1) return history.back();
    const brand = document.querySelector(".main-site-brand");
    const fallback = new URL(brand?.href || "index.html", location.href);
    fallback.searchParams.set("page", "interests");
    fallback.searchParams.delete("v");
    location.href = fallback.href;
  });
  document.body.append(goBackButton);
}

document.body.classList.toggle(
  "has-detail-back-button",
  document.documentElement.dataset.embedded !== "true" && Boolean(document.querySelector(".go-back-button")),
);
