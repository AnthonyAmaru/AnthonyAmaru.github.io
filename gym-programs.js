(() => {
  const buttons = [...document.querySelectorAll("[data-workout-tab]")];
  const panels = [...document.querySelectorAll("[data-workout-panel]")];

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.workoutTab;
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      panels.forEach((panel) => { panel.hidden = panel.dataset.workoutPanel !== selected; });
    });
  });
})();
