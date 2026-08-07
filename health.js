(() => {
  "use strict";

  const CONTENT_KEY = "health_bloodwork_v1";
  const lock = document.querySelector("[data-health-lock]");
  const dashboard = document.querySelector("[data-health-dashboard]");
  const message = document.querySelector("[data-health-message]");
  const asOf = document.querySelector("[data-health-as-of]");
  let loading = false;

  if (!lock || !dashboard || !window.musicCloud) return;

  const sources = [
    ["Triglyceride ranges · MedlinePlus", "https://medlineplus.gov/triglycerides.html"],
    ["Hypertriglyceridemia guidance · American College of Cardiology", "https://www.acc.org/Latest-in-Cardiology/ten-points-to-remember/2021/07/27/21/04/2021-ACC-ECDP-Hypertriglyceridemia"],
    ["LDL ranges · MedlinePlus", "https://medlineplus.gov/ldlthebadcholesterol.html"],
    ["Prediabetes testing · NIDDK", "https://www.niddk.nih.gov/health-information/professionals/clinical-tools-patient-management/diabetes/diabetes-prediabetes"],
    ["Hepatitis C test interpretation · CDC", "https://www.cdc.gov/hepatitis-c/hcp/diagnosis-testing/index.html"],
    ["Anemia diagnosis · NHLBI", "https://www.nhlbi.nih.gov/health/anemia/diagnosis"],
    ["Cirrhosis nutrition · NIDDK", "https://www.niddk.nih.gov/health-information/liver-disease/cirrhosis/eating-diet-nutrition"],
  ];

  function element(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== "") node.textContent = String(text);
    return node;
  }

  function chip(label, tone) {
    return element("span", `health-chip ${tone}`, label);
  }

  function dateLabel(value) {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? String(value || "") : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  }

  function resultRow({ code, label, value, unit = "", reference, status, tone = "clear" }) {
    const row = element("article", `health-result-row signal-${tone}`);
    row.dataset.healthTone = tone;
    row.dataset.healthSearch = [code, label, value, unit, reference, status].join(" ").toLocaleLowerCase();
    const index = element("span", "health-row-index", code);
    const name = element("div", "health-result-name");
    name.append(element("small", "", "ANALYTE"), element("strong", "", label));
    const reading = element("div", "health-result-value");
    reading.append(element("strong", "", value));
    if (unit) reading.append(element("small", "", unit));
    const range = element("div", "health-result-reference");
    range.append(element("small", "", "REFERENCE"), element("span", "", reference));
    const signal = element("span", "health-signal", "");
    signal.setAttribute("aria-hidden", "true");
    row.append(index, name, reading, range, chip(status, tone), signal);
    return row;
  }

  function protocol(title, items, tone = "clear", open = false) {
    const details = element("details", `health-protocol protocol-${tone}`);
    details.open = open;
    const summary = element("summary");
    summary.append(element("span", "health-protocol-icon", "+"), element("strong", "", title), element("small", "", `${items.length} STEPS`));
    const list = element("ol", "health-protocol-list");
    items.forEach((item) => list.append(element("li", "", item)));
    details.append(summary, list);
    return details;
  }

  function resultSection(code, title, status, tone, rows, extra = null) {
    const section = element("section", "health-result-section");
    section.dataset.healthCategory = code;
    const heading = element("header", "health-section-heading");
    const titleBlock = element("div");
    titleBlock.append(element("span", "health-section-code", code), element("h2", "", title));
    heading.append(titleBlock, chip(status, tone));
    const list = element("div", "health-result-list");
    rows.forEach((row) => list.append(resultRow(row)));
    section.append(heading, list);
    if (extra) section.append(extra);
    return section;
  }

  function renderFilters() {
    const filters = element("section", "health-filters");
    filters.setAttribute("aria-label", "Filter health results");

    const searchLabel = element("label", "health-filter-search");
    const search = element("input");
    search.type = "search";
    search.placeholder = "Search results";
    search.setAttribute("aria-label", "Search health results");
    search.autocomplete = "off";
    search.dataset.healthSearchInput = "";
    searchLabel.append(search);

    const categoryLabel = element("label", "health-filter-category");
    const category = element("select");
    category.setAttribute("aria-label", "Filter by category");
    category.dataset.healthCategorySelect = "";
    [
      ["all", "All categories"],
      ["01", "Lipids"],
      ["02", "Glucose"],
      ["03", "Hepatitis C"],
      ["04", "Resolved"],
      ["05", "Stable systems"],
    ].forEach(([value, label]) => {
      const option = element("option", "", label);
      option.value = value;
      category.append(option);
    });
    categoryLabel.append(category);

    const status = element("div", "health-filter-status");
    status.setAttribute("role", "group");
    status.setAttribute("aria-label", "Filter by status");
    [["all", "All"], ["high", "High"], ["watch", "Watch"], ["clear", "Clear"]].forEach(([value, label], index) => {
      const button = element("button", "", label);
      button.type = "button";
      button.dataset.healthStatus = value;
      button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
      status.append(button);
    });

    const count = element("output", "health-filter-count", "");
    count.dataset.healthFilterCount = "";
    count.setAttribute("aria-live", "polite");
    filters.append(searchLabel, categoryLabel, status, count);
    return filters;
  }

  function enableFilters() {
    const search = dashboard.querySelector("[data-health-search-input]");
    const category = dashboard.querySelector("[data-health-category-select]");
    const statusButtons = [...dashboard.querySelectorAll("[data-health-status]")];
    const sections = [...dashboard.querySelectorAll("[data-health-category]")];
    const rows = [...dashboard.querySelectorAll(".health-result-row")];
    const count = dashboard.querySelector("[data-health-filter-count]");
    let status = "all";

    function applyFilters() {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const section = row.closest("[data-health-category]");
        const categoryMatch = category.value === "all" || section?.dataset.healthCategory === category.value;
        const statusMatch = status === "all" || row.dataset.healthTone === status;
        const searchMatch = !query || row.dataset.healthSearch.includes(query);
        row.hidden = !(categoryMatch && statusMatch && searchMatch);
        if (!row.hidden) visible += 1;
      });
      sections.forEach((section) => {
        section.hidden = !section.querySelector(".health-result-row:not([hidden])");
      });
      count.textContent = `${visible} / ${rows.length}`;
    }

    search.addEventListener("input", applyFilters);
    category.addEventListener("change", applyFilters);
    statusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        status = button.dataset.healthStatus;
        statusButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        applyFilters();
      });
    });
    applyFilters();
  }

  function renderSystemBar(data) {
    const bar = element("section", "health-system-bar");
    const identity = element("div", "health-system-identity");
    identity.append(element("span", "health-live-dot", ""));
    const copy = element("div");
    copy.append(element("small", "", "SECURE LAB FEED"), element("strong", "", "BLOODWORK // ANALYSIS NODE"));
    identity.append(copy);
    const meta = element("div", "health-system-meta");
    meta.append(
      element("span", "", `DATASET ${dateLabel(data.asOf).toUpperCase()}`),
      element("span", "", "ENCRYPTED"),
      element("span", "", "STATUS ONLINE"),
    );
    bar.append(identity, meta);
    return bar;
  }

  function renderLipids(data) {
    const values = data.latest.lipids;
    const steps = protocol("Improvement protocol", [
      "Repeat a fasting lipid panel; the report did not confirm whether this sample was fasting.",
      "Review overall cardiovascular risk, blood pressure, family history, weight, medicines, and treatment options with the clinician.",
      "Reduce added sugar, sweet drinks, refined starches, saturated fat, and heavily processed foods; favor vegetables, beans, oats, fish, nuts, olive oil, and whole grains.",
      "Aim for at least 150 minutes of moderate activity weekly. If appropriate, a clinician-supervised 5–10% weight reduction can improve triglycerides.",
      "Avoid alcohol because of the cirrhosis history. Do not self-start niacin, high-dose omega-3, or other lipid supplements.",
    ], "high", true);
    const warning = element("p", "health-alert-line");
    warning.append(element("strong", "", "THRESHOLD CHECK // "), document.createTextNode(`${values.triglycerides} mg/dL is high, but below the severe ≥500 mg/dL range. Timely follow-up is still important for long-term cardiovascular risk.`));
    const extra = element("div", "health-section-extra");
    extra.append(warning, steps);
    return resultSection("01", "Lipid Matrix", "Priority", "high", [
      { code: "L-01", label: "Triglycerides", value: values.triglycerides, unit: "mg/dL", reference: "High 200–499 · Severe ≥500", status: "High", tone: "high" },
      { code: "L-02", label: "LDL cholesterol", value: values.ldl, unit: "mg/dL", reference: "Borderline high 130–159", status: "Above goal", tone: "watch" },
      { code: "L-03", label: "Non-HDL cholesterol", value: values.nonHdl, unit: "mg/dL", reference: "Healthy adult level <130", status: "High", tone: "high" },
      { code: "L-04", label: "Total cholesterol", value: values.total, unit: "mg/dL", reference: "Borderline high 200–239", status: "Above goal", tone: "watch" },
      { code: "L-05", label: "HDL cholesterol", value: values.hdl, unit: "mg/dL", reference: "Acceptable ≥40", status: "In range", tone: "clear" },
      { code: "L-06", label: "Total / HDL ratio", value: values.ratio, reference: "Report goal <5.0", status: "High", tone: "high" },
    ], extra);
  }

  function renderGlucose(data) {
    const values = data.latest.glucose;
    return resultSection("02", "Glucose Control", "Monitor", "watch", [
      { code: "G-01", label: "Fasting glucose", value: values.july14, unit: "mg/dL", reference: "Normal 70–99 if truly fasting", status: "Watch", tone: "watch" },
      { code: "G-02", label: "Hemoglobin A1C", value: values.a1c, unit: "%", reference: "Normal <5.7", status: "In range", tone: "clear" },
      { code: "G-03", label: "Later glucose", value: values.july27, unit: "mg/dL", reference: "Non-fasting sample", status: "In range", tone: "clear" },
    ], protocol("Follow-up protocol", [
      "Confirm whether the July 14 test followed an 8-hour fast; 100–125 mg/dL is the impaired-fasting-glucose range.",
      "Use the same heart-healthy food and activity plan as the lipid protocol and repeat testing on the clinician’s schedule.",
    ], "watch"));
  }

  function renderHcv(data) {
    const values = data.latest.hcv;
    return resultSection("03", "Hepatitis C Sequence", "No current infection", "clear", [
      { code: "H-01", label: "HCV antibody", value: values.antibody, reference: "Screening result · past exposure or false positive", status: "Reactive", tone: "watch" },
      { code: "H-02", label: "HCV RNA", value: values.rna, reference: "PCR confirmation", status: "Clear", tone: "clear" },
    ], protocol("Record protocol", [
      "Keep this result in the medical record; antibodies can remain reactive after a cleared infection.",
      "Repeat RNA only after recent exposure, ongoing risk, symptoms, or clinician direction.",
    ]));
  }

  function renderResolved(data) {
    const rows = data.resolved.map((item, index) => ({
      code: `R-${String(index + 1).padStart(2, "0")}`,
      label: item.name,
      value: item.latest.replace(/^July:\s*/i, ""),
      reference: `Previous signal · ${item.first}`,
      status: item.status,
      tone: "clear",
    }));
    return resultSection("04", "Resolved Signals", "Later normal", "clear", rows, protocol("Safety note", [
      "Do not increase salt or add extra iron or calcium based only on the old May values.",
      "If a value drops again, request repeat testing and evaluation of the cause.",
    ]));
  }

  function renderNormal(data) {
    const latest = data.latest;
    return resultSection("05", "Stable Systems", "Within range", "clear", [
      { code: "S-01", label: "Creatinine", value: latest.renal.creatinine, unit: "mg/dL", reference: "Latest metabolic panel", status: "Stable", tone: "clear" },
      { code: "S-02", label: "eGFR", value: latest.renal.eGFR, unit: "mL/min/1.73m²", reference: "Latest metabolic panel", status: "Stable", tone: "clear" },
      { code: "S-03", label: "AST", value: latest.liver.ast, unit: "U/L", reference: "Latest liver panel", status: "In range", tone: "clear" },
      { code: "S-04", label: "ALT", value: latest.liver.alt, unit: "U/L", reference: "Latest liver panel", status: "In range", tone: "clear" },
      { code: "S-05", label: "Bilirubin", value: latest.liver.bilirubin, unit: "mg/dL", reference: "Latest liver panel", status: "In range", tone: "clear" },
      { code: "S-06", label: "TSH", value: latest.thyroid.tsh, unit: "mIU/L", reference: "Latest thyroid panel", status: "In range", tone: "clear" },
      { code: "S-07", label: "Free T4", value: latest.thyroid.freeT4, unit: "ng/dL", reference: "Latest thyroid panel", status: "In range", tone: "clear" },
    ], protocol("Cirrhosis safeguard", [
      "Normal AST and ALT do not by themselves measure cirrhosis severity.",
      "Continue the clinician’s liver follow-up, sodium plan, imaging, and medication guidance.",
    ], "watch"));
  }

  function renderNextSteps() {
    const section = element("section", "health-command-section");
    const heading = element("header", "health-section-heading");
    const title = element("div");
    title.append(element("span", "health-section-code", "06"), element("h2", "", "Clinician Command List"));
    heading.append(title, chip("Next visit", "watch"));
    const list = element("ol", "health-command-list");
    [
      "Bring the full reports and confirm whether the lipid panel and July 14 glucose test were fasting.",
      "Request a clinician-timed repeat fasting lipid panel and discuss overall cardiovascular risk.",
      "Review every prescription and supplement for possible effects on triglycerides and liver care.",
      "Ask about repeat CBC/CMP, iron, ferritin, or other testing only if anemia or electrolyte abnormalities return.",
      "Coordinate diet changes with a registered dietitian or liver clinician.",
    ].forEach((item) => list.append(element("li", "", item)));
    section.append(heading, list);
    return section;
  }

  function renderUrgent() {
    const section = element("section", "health-urgent");
    section.append(element("span", "health-urgent-code", "!"));
    const copy = element("div");
    copy.append(element("small", "", "EMERGENCY OVERRIDE"), element("strong", "", "Get urgent medical help"));
    const list = element("ul");
    list.append(
      element("li", "", "Chest pressure, sudden weakness or speech trouble, severe confusion, fainting, or seizure."),
      element("li", "", "Severe upper-abdominal pain with repeated vomiting, vomiting blood, or black/bloody stool."),
    );
    section.append(copy, list);
    return section;
  }

  function renderSources() {
    const details = element("details", "health-sources");
    details.append(element("summary", "", "SOURCE ARCHIVE // MEDICAL REFERENCES"));
    const list = element("ul", "health-source-list");
    sources.forEach(([label, url]) => {
      const item = element("li");
      const link = element("a", "", label);
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      item.append(link);
      list.append(item);
    });
    details.append(list, element("p", "health-disclaimer", "This dashboard organizes reported results and evidence-based questions for a clinician. It does not diagnose disease or replace medical care. Laboratory ranges and treatment targets vary."));
    return details;
  }

  function render(data) {
    if (!data?.latest?.lipids || !data?.latest?.glucose || !data?.latest?.hcv || !Array.isArray(data.resolved)) throw new Error("Private health data is incomplete.");
    const stack = element("div", "health-result-stack");
    stack.append(renderLipids(data), renderGlucose(data), renderHcv(data), renderResolved(data), renderNormal(data), renderNextSteps(), renderUrgent(), renderSources());
    dashboard.replaceChildren(renderSystemBar(data), renderFilters(), stack);
    enableFilters();
    dashboard.hidden = false;
    lock.hidden = true;
    asOf.dateTime = data.asOf;
    asOf.textContent = `LABS // ${dateLabel(data.asOf).toUpperCase()}`;
    asOf.hidden = false;
    message.textContent = "";
  }

  function showLocked(status = "") {
    dashboard.hidden = true;
    lock.hidden = false;
    asOf.hidden = true;
    message.textContent = status;
  }

  async function loadHealthData() {
    if (loading || !musicCloud.isSignedIn()) return;
    loading = true;
    message.textContent = "Loading secure feed…";
    try {
      const row = await musicCloud.getContent("anthony", CONTENT_KEY);
      if (!row?.value) throw new Error("Private health data was not found.");
      render(row.value);
      window.dispatchEvent(new CustomEvent("site-cloud-change"));
    } catch (error) {
      if (error.status === 401) await musicCloud.signOut();
      showLocked(error.message);
    } finally {
      loading = false;
    }
  }

  window.addEventListener("site-cloud-change", () => {
    if (musicCloud.isSignedIn() && dashboard.hidden) loadHealthData();
  });

  if (musicCloud.isSignedIn()) loadHealthData();
  else showLocked("Unlock once from Interests for this browser session.");
})();
