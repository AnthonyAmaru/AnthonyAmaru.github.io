(() => {
  "use strict";

  const ADMIN_EMAIL = "anthonyamaru93@gmail.com";
  const CONTENT_KEY = "gym_tracker_v1";
  const PROGRAMS = {
    ppl: {
      label: "Push / Pull / Legs",
      schedule: { 1: "legs", 2: "push", 3: "pull" },
      workouts: {
        legs: {
          label: "Legs",
          exercises: ["Leg Press", "Seated Leg Press", "Romanian Deadlift (RDL)", "Split Squats", "Leg Extension", "Leg Curl", "Hip Abduction", "Hip Adduction", "Barbell Standing Calf Raise"],
        },
        push: {
          label: "Push",
          exercises: ["Dumbbell Bench Press", "Incline Dumbbell Press", "Seated Chest Press", "Seated Dumbbell Shoulder Press", "Lateral Raises", "Incline Bench Press", "Seated Chest Fly", "Single-Arm Standing Cable Chest Fly (SACCF)", "Dips", "Triceps Rope Pushdown", "Overhead Triceps Extension"],
        },
        pull: {
          label: "Pull",
          exercises: ["Assisted Pull-Ups", "Iso-Lateral Row (Machine)", "Seated Cable Row", "Close-Grip Pulldown", "Straight-Arm Pulldown", "Rear Delt Fly / Face Pull", "Dumbbell Curls", "Cable Bicep Curls"],
        },
      },
    },
    "upper-lower": {
      label: "Original Split",
      schedule: { 1: "upper-a", 2: "lower-a", 3: "upper-b", 4: "lower-b", 5: "upper-c" },
      workouts: {
        "upper-a": { label: "Upper A", exercises: ["Dumbbell Bench Press", "Iso-Lateral Row (Machine, Overhand)", "Incline Dumbbell Press", "Assisted Pull-Ups", "Lateral Raises", "Triceps Rope Pushdown", "Dumbbell Curls"] },
        "lower-a": { label: "Lower A", exercises: ["Leg Press", "Romanian Deadlift (RDL)", "Split Squats", "Leg Curl", "Barbell Standing Calf Raise"] },
        "upper-b": { label: "Upper B", exercises: ["Incline Bench Press", "Seated Cable Row", "Seated Chest Fly", "Straight-Arm Pulldown", "Rear Delt Fly / Face Pull", "Dumbbell Curls", "Overhead Triceps Extension"] },
        "lower-b": { label: "Lower B", exercises: ["Seated Leg Press", "Hip Abduction", "Hip Adduction", "Leg Extension", "Leg Curl", "Barbell Standing Calf Raise"] },
        "upper-c": { label: "Upper C", exercises: ["Seated Chest Press", "Close-Grip Pulldown", "Single-Arm Standing Cable Chest Fly (SACCF)", "Seated Dumbbell Shoulder Press", "Dips", "Cable Bicep Curls", "Dumbbell Skull Crushers"] },
      },
    },
  };

  const hub = document.querySelector("[data-gym-hub]");
  const views = [...document.querySelectorAll("[data-gym-view]")];
  const section = new URLSearchParams(location.search).get("section");
  const activeSection = ["nutrition", "tracker", "program"].includes(section) ? section : "";

  if (hub) hub.hidden = Boolean(activeSection);
  views.forEach((view) => { view.hidden = view.dataset.gymView !== activeSection; });

  function element(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== "") node.textContent = String(text);
    return node;
  }

  function renderProgramPanel(panel, programKey) {
    if (!panel) return;
    const program = PROGRAMS[programKey];
    const schedule = element("div", "training-schedule");
    schedule.setAttribute("aria-label", `${program.label} weekly schedule`);
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    dayNames.forEach((day, index) => {
      const workoutKey = program.schedule[index + 1];
      const item = element("span");
      item.append(element("strong", "", day), document.createTextNode(workoutKey ? program.workouts[workoutKey].label : "Recovery / Optional Cardio"));
      schedule.append(item);
    });

    const grid = element("div", "workout-day-grid");
    Object.values(program.workouts).forEach((workout, index) => {
      const details = document.createElement("details");
      details.open = index === 0;
      const summary = element("summary");
      summary.append(document.createTextNode(workout.label), element("span", "", `${workout.exercises.length} exercises`));
      const list = document.createElement("ul");
      workout.exercises.forEach((name) => list.append(element("li", "", name)));
      details.append(summary, list);
      grid.append(details);
    });
    panel.replaceChildren(schedule, grid);
  }

  renderProgramPanel(document.querySelector('[data-workout-panel="ppl"]'), "ppl");
  renderProgramPanel(document.querySelector('[data-workout-panel="upper-lower"]'), "upper-lower");

  const programButtons = [...document.querySelectorAll("[data-workout-tab]")];
  const programPanels = [...document.querySelectorAll("[data-workout-panel]")];
  programButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.workoutTab;
      programButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      programPanels.forEach((panel) => { panel.hidden = panel.dataset.workoutPanel !== selected; });
    });
  });

  if (activeSection !== "tracker" || !window.musicCloud) return;

  const lock = document.querySelector("[data-gym-lock]");
  const tracker = document.querySelector("[data-gym-tracker]");
  const authForm = document.querySelector("[data-gym-auth]");
  const password = document.querySelector("#gym-password");
  const authMessage = document.querySelector("[data-gym-auth-message]");
  const saveStatus = document.querySelector("[data-gym-save-status]");
  const workoutForm = document.querySelector("[data-gym-workout-form]");
  const exerciseEditor = document.querySelector("[data-gym-exercise-editor]");
  const weekInput = document.querySelector("[data-gym-week]");
  const weekGrid = document.querySelector("[data-gym-week-grid]");
  const chartExercise = document.querySelector("[data-gym-chart-exercise]");
  const chartMetric = document.querySelector("[data-gym-chart-metric]");
  const chart = document.querySelector("[data-gym-chart]");
  const history = document.querySelector("[data-gym-history]");
  const historyCount = document.querySelector("[data-gym-history-count]");
  let data = { version: 1, selectedProgram: "ppl", entries: [] };
  let loading = false;

  function normalizeData(value) {
    const source = value && typeof value === "object" ? value : {};
    return {
      version: 1,
      selectedProgram: PROGRAMS[source.selectedProgram] ? source.selectedProgram : "ppl",
      entries: Array.isArray(source.entries) ? source.entries.filter((entry) => entry && entry.id && entry.date && PROGRAMS[entry.program]?.workouts?.[entry.workout]) : [],
    };
  }

  function localDateValue(date = new Date()) {
    const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
    return copy.toISOString().slice(0, 10);
  }

  function parseLocalDate(value) {
    const [year, month, day] = String(value).split("-").map(Number);
    return new Date(year, month - 1, day, 12);
  }

  function isoWeekValue(date = new Date()) {
    const value = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    value.setUTCDate(value.getUTCDate() + 4 - (value.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(value.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((value - yearStart) / 86400000) + 1) / 7);
    return `${value.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  function weekStartFromValue(value) {
    const match = String(value).match(/^(\d{4})-W(\d{2})$/);
    if (!match) return weekStartFromValue(isoWeekValue());
    const year = Number(match[1]);
    const week = Number(match[2]);
    const jan4 = new Date(year, 0, 4, 12);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + ((week - 1) * 7));
    return monday;
  }

  function workoutForDate(programKey, dateValue) {
    const date = parseLocalDate(dateValue);
    return PROGRAMS[programKey].schedule[date.getDay()] || Object.keys(PROGRAMS[programKey].workouts)[0];
  }

  function workoutLabel(entry) {
    return PROGRAMS[entry.program]?.workouts?.[entry.workout]?.label || entry.workout;
  }

  function totalVolume(entry) {
    return (entry.exercises || []).reduce((total, exercise) => total + (exercise.sets || []).reduce((sum, set) => sum + (Number(set.weight || 0) * Number(set.reps || 0)), 0), 0);
  }

  function latestExerciseEntry(name, beforeDate = "9999-12-31") {
    return [...data.entries]
      .filter((entry) => entry.date <= beforeDate && entry.exercises?.some((exercise) => exercise.name === name))
      .sort((a, b) => b.date.localeCompare(a.date) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))[0];
  }

  function progressionCue(name, dateValue) {
    const latest = latestExerciseEntry(name, dateValue);
    const exercise = latest?.exercises?.find((item) => item.name === name);
    const reps = (exercise?.sets || []).map((set) => Number(set.reps || 0)).filter(Boolean);
    if (!reps.length) return { text: "", increase: false };
    if (/calf/i.test(name)) return { text: "Calf rule", increase: false };
    if (reps.every((value) => value >= 12)) return { text: "Increase next time", increase: true };
    return { text: "Hold weight", increase: false };
  }

  function setLetter(index) {
    return String.fromCharCode(65 + Math.min(index, 25));
  }

  function addSetRow(container, set = {}) {
    const row = element("div", "gym-set-row");
    const label = element("span", "", setLetter(container.children.length));
    const weightLabel = element("label", "", "Weight");
    const weight = document.createElement("input");
    weight.type = "number";
    weight.min = "0";
    weight.step = "0.5";
    weight.inputMode = "decimal";
    weight.dataset.gymSetWeight = "";
    weight.value = set.weight ?? "";
    weightLabel.append(weight);
    const repsLabel = element("label", "", "Reps");
    const reps = document.createElement("input");
    reps.type = "number";
    reps.min = "0";
    reps.step = "1";
    reps.inputMode = "numeric";
    reps.dataset.gymSetReps = "";
    reps.value = set.reps ?? "";
    repsLabel.append(reps);
    const remove = element("button", "", "×");
    remove.type = "button";
    remove.setAttribute("aria-label", "Remove set");
    remove.addEventListener("click", () => {
      if (container.children.length <= 1) {
        weight.value = "";
        reps.value = "";
        return;
      }
      row.remove();
      [...container.children].forEach((item, index) => { item.querySelector(":scope > span").textContent = setLetter(index); });
    });
    row.append(label, weightLabel, repsLabel, remove);
    container.append(row);
  }

  function renderExerciseEditor(existing = []) {
    const programKey = workoutForm.elements.program.value;
    const workoutKey = workoutForm.elements.workout.value;
    const workout = PROGRAMS[programKey]?.workouts?.[workoutKey];
    if (!workout) return exerciseEditor.replaceChildren();
    const existingMap = new Map(existing.map((exercise) => [exercise.name, exercise]));
    const dateValue = workoutForm.elements.date.value || localDateValue();
    const fragment = document.createDocumentFragment();
    workout.exercises.forEach((name) => {
      const card = element("article", "gym-exercise");
      card.dataset.gymExercise = name;
      const header = document.createElement("header");
      const cue = progressionCue(name, dateValue);
      header.append(element("strong", "", name), element("span", `gym-exercise-cue${cue.increase ? " increase" : ""}`, cue.text));
      const sets = element("div", "gym-sets");
      sets.dataset.gymSets = "";
      const savedSets = existingMap.get(name)?.sets || [];
      (savedSets.length ? savedSets : [{}, {}, {}]).forEach((set) => addSetRow(sets, set));
      const add = element("button", "gym-add-set", "+ Set");
      add.type = "button";
      add.addEventListener("click", () => addSetRow(sets));
      card.append(header, sets, add);
      fragment.append(card);
    });
    exerciseEditor.replaceChildren(fragment);
  }

  function updateWorkoutOptions(selected = "", existing = []) {
    const programKey = workoutForm.elements.program.value;
    const workoutSelect = workoutForm.elements.workout;
    workoutSelect.replaceChildren(...Object.entries(PROGRAMS[programKey].workouts).map(([key, workout]) => {
      const option = element("option", "", workout.label);
      option.value = key;
      return option;
    }));
    workoutSelect.value = PROGRAMS[programKey].workouts[selected] ? selected : workoutForDate(programKey, workoutForm.elements.date.value || localDateValue());
    renderExerciseEditor(existing);
  }

  function resetWorkoutForm(dateValue = localDateValue(), programKey = data.selectedProgram) {
    workoutForm.reset();
    workoutForm.elements.entryId.value = "";
    workoutForm.elements.date.value = dateValue;
    workoutForm.elements.program.value = PROGRAMS[programKey] ? programKey : "ppl";
    updateWorkoutOptions(workoutForDate(workoutForm.elements.program.value, dateValue));
    document.querySelector("[data-gym-new-workout]").textContent = "New workout";
  }

  function editWorkout(entry) {
    workoutForm.elements.entryId.value = entry.id;
    workoutForm.elements.date.value = entry.date;
    workoutForm.elements.program.value = entry.program;
    workoutForm.elements.bodyWeight.value = entry.bodyWeight ?? "";
    workoutForm.elements.notes.value = entry.notes || "";
    updateWorkoutOptions(entry.workout, entry.exercises || []);
    document.querySelector("[data-gym-new-workout]").textContent = "Editing workout";
    document.querySelector(".gym-log-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderWeek() {
    if (!weekInput.value) weekInput.value = isoWeekValue();
    const start = weekStartFromValue(weekInput.value);
    const today = localDateValue();
    const fragment = document.createDocumentFragment();
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let index = 0; index < 7; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const dateValue = localDateValue(date);
      const day = element("button", "gym-week-day");
      day.type = "button";
      const plannedKey = PROGRAMS[data.selectedProgram].schedule[index + 1];
      const planned = plannedKey ? PROGRAMS[data.selectedProgram].workouts[plannedKey].label : "Recovery";
      const completed = data.entries.filter((entry) => entry.date === dateValue);
      day.classList.toggle("current", dateValue === today);
      day.classList.toggle("complete", completed.length > 0);
      day.append(
        element("strong", "", dayNames[index]),
        Object.assign(element("time", "", date.toLocaleDateString("en-US", { month: "short", day: "numeric" })), { dateTime: dateValue }),
        element("span", "", completed.length ? completed.map(workoutLabel).join(" · ") : planned),
      );
      if (completed.length) day.append(element("b", "", "Completed"));
      day.addEventListener("click", () => resetWorkoutForm(dateValue, data.selectedProgram));
      fragment.append(day);
    }
    weekGrid.replaceChildren(fragment);
  }

  function chartValue(exercise, metric) {
    const sets = (exercise?.sets || []).filter((set) => Number(set.weight || 0) > 0 && Number(set.reps || 0) > 0);
    if (!sets.length) return 0;
    if (metric === "volume") return sets.reduce((sum, set) => sum + (Number(set.weight) * Number(set.reps)), 0);
    if (metric === "estimatedOneRepMax") return Math.max(...sets.map((set) => Number(set.weight) * (1 + (Number(set.reps) / 30))));
    return Math.max(...sets.map((set) => Number(set.weight)));
  }

  function renderChartOptions() {
    const previous = chartExercise.value;
    const names = new Set();
    const loggedNames = new Set();
    Object.values(PROGRAMS).forEach((program) => Object.values(program.workouts).forEach((workout) => workout.exercises.forEach((name) => names.add(name))));
    data.entries.forEach((entry) => entry.exercises?.forEach((exercise) => {
      names.add(exercise.name);
      loggedNames.add(exercise.name);
    }));
    const orderedNames = [...loggedNames].sort().concat([...names].filter((name) => !loggedNames.has(name)).sort());
    chartExercise.replaceChildren(...orderedNames.map((name) => {
      const option = element("option", "", name);
      option.value = name;
      return option;
    }));
    if (loggedNames.has(previous) || (!loggedNames.size && names.has(previous))) chartExercise.value = previous;
  }

  function svgElement(tag, attributes = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
    return node;
  }

  function renderChart() {
    const name = chartExercise.value;
    const metric = chartMetric.value;
    const points = data.entries
      .map((entry) => ({ entry, exercise: entry.exercises?.find((item) => item.name === name) }))
      .filter((item) => item.exercise)
      .map((item) => ({ date: item.entry.date, value: chartValue(item.exercise, metric) }))
      .filter((point) => point.value > 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-12);
    if (!points.length) {
      chart.replaceChildren(element("div", "gym-chart-empty", "No entries yet"));
      return;
    }

    const width = 720;
    const height = 260;
    const left = 54;
    const right = 24;
    const top = 28;
    const bottom = 42;
    const max = Math.max(...points.map((point) => point.value));
    const min = Math.min(...points.map((point) => point.value));
    const range = Math.max(max - min, max * .12, 1);
    const floor = Math.max(0, min - (range * .25));
    const ceiling = max + (range * .18);
    const x = (index) => points.length === 1 ? (left + width - right) / 2 : left + ((width - left - right) * index / (points.length - 1));
    const y = (value) => top + ((ceiling - value) / (ceiling - floor)) * (height - top - bottom);
    const svg = svgElement("svg", { viewBox: `0 0 ${width} ${height}`, role: "img", "aria-label": `${name} progression chart` });

    for (let index = 0; index <= 4; index += 1) {
      const lineY = top + ((height - top - bottom) * index / 4);
      const value = ceiling - ((ceiling - floor) * index / 4);
      svg.append(svgElement("line", { class: "gym-chart-grid", x1: left, x2: width - right, y1: lineY, y2: lineY }));
      const label = svgElement("text", { class: "gym-chart-label", x: left - 8, y: lineY + 4, "text-anchor": "end" });
      label.textContent = Math.round(value).toLocaleString();
      svg.append(label);
    }

    const polyline = svgElement("polyline", { class: "gym-chart-line", points: points.map((point, index) => `${x(index)},${y(point.value)}`).join(" ") });
    svg.append(polyline);
    points.forEach((point, index) => {
      const pointX = x(index);
      const pointY = y(point.value);
      svg.append(svgElement("circle", { class: "gym-chart-point", cx: pointX, cy: pointY, r: 6 }));
      const valueLabel = svgElement("text", { class: "gym-chart-value", x: pointX, y: pointY - 12, "text-anchor": "middle" });
      valueLabel.textContent = Math.round(point.value).toLocaleString();
      svg.append(valueLabel);
      const dateLabel = svgElement("text", { class: "gym-chart-label", x: pointX, y: height - 15, "text-anchor": "middle" });
      dateLabel.textContent = parseLocalDate(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      svg.append(dateLabel);
    });
    chart.replaceChildren(svg);
  }

  function renderHistory() {
    const entries = [...data.entries].sort((a, b) => b.date.localeCompare(a.date) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    historyCount.textContent = `${entries.length} ${entries.length === 1 ? "workout" : "workouts"}`;
    if (!entries.length) {
      history.replaceChildren(element("p", "gym-history-empty", "No workouts saved"));
      return;
    }
    history.replaceChildren(...entries.map((entry) => {
      const row = element("article", "gym-history-row");
      const date = Object.assign(element("time", "", parseLocalDate(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })), { dateTime: entry.date });
      const actions = element("div", "gym-history-actions");
      const edit = element("button", "", "Edit");
      edit.type = "button";
      edit.addEventListener("click", () => editWorkout(entry));
      const remove = element("button", "danger", "Delete");
      remove.type = "button";
      remove.addEventListener("click", async () => {
        if (!confirm(`Delete ${workoutLabel(entry)} from ${entry.date}?`)) return;
        data.entries = data.entries.filter((item) => item.id !== entry.id);
        await saveData("Deleted");
        renderAll();
      });
      actions.append(edit, remove);
      row.append(date, element("strong", "", workoutLabel(entry)), element("span", "", `${Math.round(totalVolume(entry)).toLocaleString()} lb · reps`), actions);
      return row;
    }));
  }

  function renderAll() {
    renderWeek();
    renderChartOptions();
    renderChart();
    renderHistory();
  }

  async function saveData(message = "Saved") {
    saveStatus.textContent = "Saving…";
    try {
      await musicCloud.saveContent("anthony", CONTENT_KEY, data);
      saveStatus.textContent = message;
      window.dispatchEvent(new CustomEvent("site-cloud-change"));
    } catch (error) {
      saveStatus.textContent = error.message;
      throw error;
    }
  }

  function showLocked(message = "") {
    tracker.hidden = true;
    lock.hidden = false;
    authMessage.textContent = message;
  }

  function showTracker() {
    lock.hidden = true;
    tracker.hidden = false;
  }

  async function loadTracker() {
    if (loading || !musicCloud.isSignedIn()) return;
    loading = true;
    authMessage.textContent = "Loading…";
    try {
      const row = await musicCloud.getContent("anthony", CONTENT_KEY);
      data = normalizeData(row?.value);
      weekInput.value = isoWeekValue();
      resetWorkoutForm();
      renderAll();
      showTracker();
      saveStatus.textContent = row?.value ? "Cloud synced" : "Ready";
      window.dispatchEvent(new CustomEvent("site-cloud-change"));
    } catch (error) {
      if (error.status === 401) await musicCloud.signOut();
      showLocked(error.message);
    } finally {
      loading = false;
    }
  }

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = authForm.querySelector("button");
    button.disabled = true;
    authMessage.textContent = "Unlocking…";
    try {
      await musicCloud.signIn(ADMIN_EMAIL, password.value);
      sessionStorage.setItem("anthony_admin_unlocked", "1");
      password.value = "";
      await loadTracker();
    } catch (error) {
      showLocked(`Could not unlock: ${error.message}`);
    } finally {
      button.disabled = false;
    }
  });

  workoutForm.elements.program.addEventListener("change", () => {
    data.selectedProgram = workoutForm.elements.program.value;
    updateWorkoutOptions();
    renderWeek();
  });
  workoutForm.elements.workout.addEventListener("change", () => renderExerciseEditor());
  workoutForm.elements.date.addEventListener("change", () => {
    updateWorkoutOptions(workoutForm.elements.workout.value);
    weekInput.value = isoWeekValue(parseLocalDate(workoutForm.elements.date.value));
    renderWeek();
  });
  document.querySelector("[data-gym-clear]")?.addEventListener("click", resetWorkoutForm);
  workoutForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const entryId = workoutForm.elements.entryId.value || crypto.randomUUID();
    const exercises = [...exerciseEditor.querySelectorAll("[data-gym-exercise]")].map((card) => ({
      name: card.dataset.gymExercise,
      sets: [...card.querySelectorAll("[data-gym-sets] .gym-set-row")].map((row) => ({
        weight: Number(row.querySelector("[data-gym-set-weight]").value || 0),
        reps: Number(row.querySelector("[data-gym-set-reps]").value || 0),
      })).filter((set) => set.weight > 0 || set.reps > 0),
    })).filter((exercise) => exercise.sets.length);
    if (!exercises.length) {
      saveStatus.textContent = "Enter at least one set";
      return;
    }
    const previous = data.entries.find((entry) => entry.id === entryId);
    const entry = {
      id: entryId,
      date: workoutForm.elements.date.value,
      program: workoutForm.elements.program.value,
      workout: workoutForm.elements.workout.value,
      bodyWeight: workoutForm.elements.bodyWeight.value ? Number(workoutForm.elements.bodyWeight.value) : null,
      notes: workoutForm.elements.notes.value.trim(),
      exercises,
      createdAt: previous?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.selectedProgram = entry.program;
    data.entries = data.entries.filter((item) => item.id !== entry.id).concat(entry);
    await saveData("Workout saved");
    renderAll();
    resetWorkoutForm(entry.date, entry.program);
  });

  document.querySelector("[data-gym-new-workout]").addEventListener("click", () => resetWorkoutForm());
  document.querySelector("[data-gym-week-previous]").addEventListener("click", () => {
    const date = weekStartFromValue(weekInput.value);
    date.setDate(date.getDate() - 7);
    weekInput.value = isoWeekValue(date);
    renderWeek();
  });
  document.querySelector("[data-gym-week-next]").addEventListener("click", () => {
    const date = weekStartFromValue(weekInput.value);
    date.setDate(date.getDate() + 7);
    weekInput.value = isoWeekValue(date);
    renderWeek();
  });
  weekInput.addEventListener("change", renderWeek);
  chartExercise.addEventListener("change", renderChart);
  chartMetric.addEventListener("change", renderChart);
  window.addEventListener("site-cloud-change", () => {
    if (musicCloud.isSignedIn() && tracker.hidden && !loading) loadTracker();
  });

  if (musicCloud.isSignedIn()) loadTracker();
  else showLocked();
})();
