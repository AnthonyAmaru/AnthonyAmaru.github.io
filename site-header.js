function keepSingleSiteElement(selector) {
  [...document.querySelectorAll(selector)].slice(1).forEach((element) => element.remove());
}

keepSingleSiteElement(".main-site-header");
keepSingleSiteElement(".site-music-bar");

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
