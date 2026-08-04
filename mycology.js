(() => {
  const cards = [...document.querySelectorAll(".mushroom-card")];
  const edibility = document.querySelector("#edibility-filter");
  const location = document.querySelector("#location-filter");
  const season = document.querySelector("#season-filter");
  const count = document.querySelector("#mushroom-count");
  const clear = document.querySelector("#clear-mushroom-filters");
  if (!cards.length || !edibility || !location || !season || !count || !clear) return;

  const includes = (value, selected) => selected === "all" || String(value || "").split(/\s+/).includes(selected);
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
  };

  [edibility, location, season].forEach((select) => select.addEventListener("change", applyFilters));
  clear.addEventListener("click", () => {
    edibility.value = "all";
    location.value = "all";
    season.value = "all";
    applyFilters();
  });
})();
