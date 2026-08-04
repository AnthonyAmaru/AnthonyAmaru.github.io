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

  const context = globe.getContext("2d");
  const radians = Math.PI / 180;
  const regions = [
    { id: "north-america", label: "North America", lon: -102, lat: 40 },
    { id: "europe", label: "Europe", lon: 16, lat: 49 },
    { id: "norway", label: "Norway", lon: 10, lat: 63 },
    { id: "asia", label: "Asia", lon: 92, lat: 38 },
    { id: "australia", label: "Australia", lon: 134, lat: -25 },
  ];
  const continents = [
    [[-168, 68], [-145, 58], [-128, 50], [-124, 34], [-110, 24], [-96, 17], [-82, 25], [-66, 45], [-54, 52], [-64, 66], [-92, 73], [-130, 72], [-168, 68]],
    [[-81, 12], [-70, 5], [-61, -12], [-56, -30], [-68, -54], [-76, -35], [-79, -10], [-81, 12]],
    [[-11, 35], [3, 44], [23, 40], [40, 55], [31, 70], [7, 71], [-8, 56], [-11, 35]],
    [[-17, 34], [12, 37], [34, 30], [48, 10], [38, -34], [18, -35], [3, -26], [-9, 3], [-17, 34]],
    [[35, 36], [58, 56], [92, 73], [150, 61], [161, 45], [143, 28], [112, 8], [82, 8], [67, 25], [35, 36]],
    [[112, -11], [135, -10], [154, -25], [147, -41], [116, -38], [112, -11]],
    [[-52, 60], [-42, 82], [-20, 75], [-35, 59], [-52, 60]],
  ];
  let yaw = -28;
  let size = 0;
  let radius = 0;
  let center = 0;
  let markerHits = [];
  let pointerStart = null;

  const project = (lon, lat) => {
    const lambda = (lon - yaw) * radians;
    const phi = lat * radians;
    const cosine = Math.cos(phi);
    return {
      x: center + radius * cosine * Math.sin(lambda),
      y: center - radius * Math.sin(phi),
      z: cosine * Math.cos(lambda),
    };
  };

  const drawVisibleLine = (points, color, width) => {
    context.beginPath();
    let drawing = false;
    points.forEach(([lon, lat]) => {
      const point = project(lon, lat);
      if (point.z <= 0) {
        drawing = false;
        return;
      }
      if (!drawing) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
      drawing = true;
    });
    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.stroke();
  };

  const draw = () => {
    if (!size) return;
    const dark = document.documentElement.dataset.theme === "dark";
    context.clearRect(0, 0, size, size);
    context.save();
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.clip();
    const ocean = context.createRadialGradient(center - radius * 0.38, center - radius * 0.4, radius * 0.08, center, center, radius * 1.08);
    ocean.addColorStop(0, dark ? "#527f70" : "#91bea6");
    ocean.addColorStop(0.55, dark ? "#214538" : "#3c7354");
    ocean.addColorStop(1, dark ? "#10271f" : "#183e2b");
    context.fillStyle = ocean;
    context.fillRect(0, 0, size, size);

    for (let lat = -60; lat <= 60; lat += 30) {
      const points = [];
      for (let lon = -180; lon <= 180; lon += 3) points.push([lon, lat]);
      drawVisibleLine(points, "rgba(255,255,255,.13)", 1);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const points = [];
      for (let lat = -88; lat <= 88; lat += 2) points.push([lon, lat]);
      drawVisibleLine(points, "rgba(255,255,255,.13)", 1);
    }
    continents.forEach((points) => {
      drawVisibleLine(points, dark ? "rgba(205,226,190,.40)" : "rgba(219,231,182,.62)", Math.max(7, radius * 0.04));
      drawVisibleLine(points, dark ? "rgba(159,194,151,.82)" : "rgba(184,207,137,.95)", Math.max(2, radius * 0.014));
    });
    context.restore();

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.strokeStyle = dark ? "rgba(230,240,232,.28)" : "rgba(24,62,43,.25)";
    context.lineWidth = Math.max(2, radius * 0.012);
    context.stroke();

    markerHits = [];
    regions.map((region) => ({ region, point: project(region.lon, region.lat) }))
      .filter(({ point }) => point.z > 0)
      .sort((a, b) => a.point.z - b.point.z)
      .forEach(({ region, point }) => {
        const active = location.value === region.id;
        const markerRadius = active ? Math.max(8, radius * 0.045) : Math.max(6, radius * 0.035);
        context.beginPath();
        context.arc(point.x, point.y, markerRadius + 4, 0, Math.PI * 2);
        context.fillStyle = active ? "rgba(248,219,107,.35)" : "rgba(255,255,255,.25)";
        context.fill();
        context.beginPath();
        context.arc(point.x, point.y, markerRadius, 0, Math.PI * 2);
        context.fillStyle = active ? "#f8db6b" : "#fffdf4";
        context.fill();
        context.strokeStyle = "rgba(24,35,27,.72)";
        context.lineWidth = 1.5;
        context.stroke();
        markerHits.push({ ...point, radius: markerRadius + 12, region });
      });
  };

  const resize = () => {
    const rect = globe.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    size = Math.max(1, Math.round(rect.width * ratio));
    globe.width = size;
    globe.height = size;
    center = size / 2;
    radius = size * 0.45;
    draw();
  };

  const chooseRegion = (id, centerRegion = true) => {
    location.value = id;
    if (centerRegion) {
      const region = regions.find((item) => item.id === id);
      if (region) yaw = region.lon;
    }
    applyFilters();
    draw();
  };

  globeButtons.forEach((button) => button.addEventListener("click", () => chooseRegion(button.dataset.globeLocation, true)));
  globe.addEventListener("pointerdown", (event) => {
    pointerStart = { x: event.clientX, yaw, moved: false };
    globe.setPointerCapture(event.pointerId);
  });
  globe.addEventListener("pointermove", (event) => {
    if (!pointerStart) return;
    const delta = event.clientX - pointerStart.x;
    pointerStart.moved ||= Math.abs(delta) > 5;
    yaw = pointerStart.yaw + delta * 0.45;
    draw();
  });
  globe.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const moved = pointerStart.moved;
    pointerStart = null;
    if (moved) return;
    const rect = globe.getBoundingClientRect();
    const scale = globe.width / rect.width;
    const x = (event.clientX - rect.left) * scale;
    const y = (event.clientY - rect.top) * scale;
    const hit = [...markerHits].reverse().find((marker) => Math.hypot(marker.x - x, marker.y - y) <= marker.radius);
    if (hit) chooseRegion(hit.region.id, true);
  });
  globe.addEventListener("pointercancel", () => { pointerStart = null; });
  location.addEventListener("change", draw);
  window.addEventListener("resize", resize);

  applyFilters();
  resize();
})();
