(() => {
  const cards = [...document.querySelectorAll(".mushroom-card")];
  const edibility = document.querySelector("#edibility-filter");
  const location = document.querySelector("#location-filter");
  const season = document.querySelector("#season-filter");
  const count = document.querySelector("#mushroom-count");
  const clear = document.querySelector("#clear-mushroom-filters");
  const globe = document.querySelector("#mushroom-globe");
  const globeButtons = [...document.querySelectorAll("[data-globe-location]")];
  if (!cards.length || !edibility || !location || !season || !count || !clear) return;

  const includes = (value, selected) => selected === "all" || String(value || "").split(/\s+/).includes(selected);
  const syncGlobeButtons = () => globeButtons.forEach((button) => button.classList.toggle("active", button.dataset.globeLocation === location.value || (location.value === "worldwide" && button.dataset.globeLocation === "all")));
  const applyFilters = () => {
    let visible = 0;
    cards.forEach((card) => {
      const matches = includes(card.dataset.edibility, edibility.value)
        && includes(card.dataset.locations, location.value)
        && includes(card.dataset.seasons, season.value);
      card.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = `${visible} mushroom${visible === 1 ? "" : "s"}`;
    syncGlobeButtons();
  };

  [edibility, location, season].forEach((select) => select.addEventListener("change", applyFilters));
  clear.addEventListener("click", () => {
    edibility.value = "all";
    location.value = "all";
    season.value = "all";
    applyFilters();
  });

  if (!globe) {
    applyFilters();
    return;
  }

  const regions = [
    { id: "north-america", label: "North America", lng: -102, lat: 40 },
    { id: "europe", label: "Europe", lng: 16, lat: 49 },
    { id: "norway", label: "Norway", lng: 10, lat: 63 },
    { id: "asia", label: "Asia", lng: 92, lat: 38 },
    { id: "australia", label: "Australia", lng: 134, lat: -25 },
  ];
  const fallback = document.querySelector("#globe-fallback");
  const zoomButtons = [...document.querySelectorAll("[data-globe-action]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const initialView = { lat: 24, lng: -32, altitude: 2.15 };
  const textureRoot = "https://cdn.jsdelivr.net/npm/three-globe@2.45.0/example/img/";
  let globeView = null;

  const showGlobeFallback = () => {
    globe.classList.add("is-unavailable");
    zoomButtons.forEach((button) => { button.disabled = true; });
    if (fallback) fallback.hidden = false;
  };

  const regionCount = (id) => cards.filter((card) => includes(card.dataset.locations, id)).length;
  const markerLabel = (region) => `
    <div class="globe-region-tip">
      <strong>${region.label}</strong>
      <span>${regionCount(region.id)} profiles</span>
    </div>`;

  const refreshMarkers = () => {
    if (!globeView) return;
    globeView
      .pointsData([...regions])
      .ringsData([...regions]);
  };

  const resetGlobe = (duration = 900) => {
    if (!globeView) return;
    globeView.pointOfView(initialView, duration);
  };

  const chooseRegion = (id, centerRegion = true) => {
    location.value = id;
    applyFilters();
    refreshMarkers();

    if (!globeView || !centerRegion) return;
    const region = regions.find((item) => item.id === id);
    if (region) globeView.pointOfView({ lat: region.lat, lng: region.lng, altitude: 1.55 }, 900);
    else resetGlobe();
  };

  applyFilters();

  if (typeof window.Globe !== "function") {
    showGlobeFallback();
    globeButtons.forEach((button) => button.addEventListener("click", () => chooseRegion(button.dataset.globeLocation, false)));
    return;
  }

  try {
    globeView = window.Globe({ rendererConfig: { antialias: true, alpha: true } })(globe)
      .backgroundImageUrl(`${textureRoot}night-sky.png`)
      .globeImageUrl(`${textureRoot}earth-blue-marble.jpg`)
      .bumpImageUrl(`${textureRoot}earth-topology.png`)
      .showAtmosphere(true)
      .atmosphereColor(document.documentElement.dataset.theme === "dark" ? "#6fdcff" : "#8bdfff")
      .atmosphereAltitude(0.18)
      .pointLat("lat")
      .pointLng("lng")
      .pointAltitude(0.035)
      .pointRadius((region) => location.value === region.id ? 0.9 : 0.58)
      .pointResolution(24)
      .pointColor((region) => location.value === region.id ? "#ffe47a" : "#7ce8ff")
      .pointLabel(markerLabel)
      .pointsTransitionDuration(350)
      .onPointClick((region) => chooseRegion(region.id, true))
      .ringLat("lat")
      .ringLng("lng")
      .ringColor((region) => (progress) => location.value === region.id
        ? `rgba(255, 228, 122, ${Math.max(0, 1 - progress)})`
        : `rgba(111, 220, 255, ${Math.max(0, 0.82 - progress)})`)
      .ringMaxRadius((region) => location.value === region.id ? 5.2 : 3.2)
      .ringPropagationSpeed((region) => location.value === region.id ? 1.15 : 0.72)
      .ringRepeatPeriod((region) => location.value === region.id ? 1050 : 2400);

    const material = globeView.globeMaterial();
    material.bumpScale = 8;
    material.shininess = 12;

    const controls = globeView.controls();
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.34;
    controls.enablePan = false;
    controls.minDistance = 150;
    controls.maxDistance = 520;

    const renderer = globeView.renderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));

    const resize = () => {
      const rect = globe.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      globeView.width(width).height(height);
    };

    if (window.ResizeObserver) new ResizeObserver(resize).observe(globe);
    else window.addEventListener("resize", resize);

    if (window.IntersectionObserver) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) globeView.resumeAnimation();
        else globeView.pauseAnimation();
      }, { threshold: 0.05 }).observe(globe);
    }

    globeButtons.forEach((button) => button.addEventListener("click", () => chooseRegion(button.dataset.globeLocation, true)));
    zoomButtons.forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.globeAction;
      if (action === "reset") {
        resetGlobe();
        return;
      }
      const current = globeView.pointOfView();
      const change = action === "zoom-in" ? -0.32 : 0.32;
      globeView.pointOfView({ ...current, altitude: Math.min(3.2, Math.max(1.25, current.altitude + change)) }, 420);
    }));

    location.addEventListener("change", () => chooseRegion(location.value, true));
    new MutationObserver(() => {
      globeView.atmosphereColor(document.documentElement.dataset.theme === "dark" ? "#6fdcff" : "#8bdfff");
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    refreshMarkers();
    resize();
    resetGlobe(0);
  } catch (error) {
    console.warn("The 3D mushroom globe could not start.", error);
    showGlobeFallback();
    globeButtons.forEach((button) => button.addEventListener("click", () => chooseRegion(button.dataset.globeLocation, false)));
  }
})();
