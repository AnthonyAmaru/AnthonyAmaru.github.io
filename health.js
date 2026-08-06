(() => {
  "use strict";

  const ADMIN_EMAIL = "anthonyamaru93@gmail.com";
  const CONTENT_KEY = "health_bloodwork_v1";
  const lock = document.querySelector("[data-health-lock]");
  const dashboard = document.querySelector("[data-health-dashboard]");
  const form = document.querySelector("[data-health-auth]");
  const password = document.querySelector("#health-password");
  const message = document.querySelector("[data-health-message]");
  const asOf = document.querySelector("[data-health-as-of]");
  let loading = false;

  if (!lock || !dashboard || !form || !window.musicCloud) return;

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

  function chip(label, type) { return element("span", `health-chip ${type}`, label); }

  function dateLabel(value) {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? String(value || "") : date.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
  }

  function panel(title, status = null, wide = false) {
    const section = element("section", `health-panel${wide ? " health-panel-wide" : ""}`);
    const heading = element("header", "health-section-heading");
    heading.append(element("h2", "", title));
    if (status) heading.append(status);
    section.append(heading);
    return section;
  }

  function metric(label, value, unit, flag = "") {
    const card = element("article", "health-metric");
    const head = element("div", "health-metric-head");
    head.append(element("span", "", label));
    if (flag) head.append(element("em", "", flag));
    card.append(head, element("strong", "", value), element("small", "", unit));
    return card;
  }

  function overviewCard(type, label, value, note) {
    const card = element("article", type);
    card.append(element("span", "", label), element("strong", "", value), element("small", "", note));
    return card;
  }

  function bulletList(items, className) {
    const list = element("ul", className);
    items.forEach((item) => list.append(element("li", "", item)));
    return list;
  }

  function renderLipids(data) {
    const lipids = data.latest.lipids;
    const section = panel("Lipids", chip("Priority", "high"), true);
    const metrics = element("div", "health-metrics");
    metrics.append(
      metric("Triglycerides", lipids.triglycerides, "mg/dL · high (200–499)", "High"),
      metric("LDL", lipids.ldl, "mg/dL · borderline high (130–159)", "Above goal"),
      metric("Non-HDL", lipids.nonHdl, "mg/dL · healthy adult level <130", "High"),
      metric("Total", lipids.total, "mg/dL · borderline high (200–239)", "Above goal"),
      metric("HDL", lipids.hdl, "mg/dL · acceptable ≥40", "Okay"),
      metric("Ratio", lipids.ratio, "goal on report <5.0", "High"),
    );
    section.append(metrics);
    section.append(bulletList([
      "Repeat a fasting lipid panel; the report did not confirm whether this sample was fasting.",
      "Ask the clinician to review cardiovascular risk, blood pressure, family history, weight, medications, and whether lipid-lowering medicine is appropriate.",
      "Reduce added sugar, sweet drinks, refined starches, saturated fat, and restaurant/processed foods; favor vegetables, beans, oats, whole grains, fish, nuts, olive oil, and other unsaturated fats.",
      "Aim for at least 150 minutes of moderate activity weekly. If overweight, a clinician-supervised 5–10% weight reduction can improve triglycerides.",
      "Avoid alcohol because of the reported cirrhosis history. Do not self-start niacin, high-dose omega-3, or other lipid supplements.",
    ], "health-actions"));
    const note = element("p", "health-note");
    note.append(element("strong", "", "Danger check: "), document.createTextNode(`${lipids.triglycerides} mg/dL is high, but below the ≥500 mg/dL severe range where pancreatitis prevention becomes a primary concern. It still deserves timely follow-up for long-term cardiovascular risk.`));
    section.append(note);
    return section;
  }

  function renderGlucose(data) {
    const glucose = data.latest.glucose;
    const section = panel("Blood sugar", chip("Watch", "watch"));
    const metrics = element("div", "health-metrics");
    metrics.append(
      metric("Fasting glucose", glucose.july14, "mg/dL · confirm it was truly fasting", "Watch"),
      metric("A1C", glucose.a1c, "% · normal is below 5.7", "Normal"),
      metric("Later glucose", glucose.july27, "mg/dL · non-fasting", "Normal"),
    );
    section.append(metrics, bulletList([
      "Confirm whether the July 14 test followed an 8-hour fast; 100–125 mg/dL is the impaired-fasting-glucose range.",
      "Keep the same heart-healthy food and activity plan used for triglycerides; repeat testing on the clinician’s schedule.",
    ], "health-actions"));
    return section;
  }

  function renderHcv(data) {
    const hcv = data.latest.hcv;
    const section = panel("Hepatitis C", chip("No current infection", "clear"));
    const metrics = element("div", "health-metrics");
    metrics.append(metric("Antibody", hcv.antibody, "past exposure or false positive"), metric("HCV RNA", hcv.rna, "PCR · no current infection"));
    section.append(metrics, bulletList([
      "Keep this result in the medical record; antibodies can remain reactive after a cleared infection.",
      "Repeat RNA only if there was exposure within the last 6 months, ongoing risk, symptoms, or the clinician recommends it.",
    ], "health-actions"));
    return section;
  }

  function renderResolved(data) {
    const section = panel("Resolved trends", chip("Later normal", "clear"), true);
    const list = element("ul", "health-trends");
    data.resolved.forEach((item) => {
      const row = element("li");
      row.append(element("strong", "", item.name), element("span", "", item.first), element("span", "", item.latest), chip(item.status, "clear"));
      list.append(row);
    });
    section.append(list);
    const note = element("p", "health-note");
    note.append(element("strong", "", "Do not self-treat old results: "), document.createTextNode("do not increase salt or add extra iron/calcium based only on the May values. If any value drops again, ask for repeat testing and evaluation of the cause."));
    section.append(note);
    return section;
  }

  function renderNormal(data) {
    const section = panel("Within range", chip("Latest tests", "clear"), true);
    const list = element("ul", "health-normal-list");
    [
      ["Kidney", `Creatinine ${data.latest.renal.creatinine} · eGFR ${data.latest.renal.eGFR}`],
      ["Liver enzymes", `AST ${data.latest.liver.ast} · ALT ${data.latest.liver.alt} · bilirubin ${data.latest.liver.bilirubin}`],
      ["Thyroid", `TSH ${data.latest.thyroid.tsh} · free T4 ${data.latest.thyroid.freeT4}`],
    ].forEach(([name,value]) => { const item = element("li"); item.append(element("strong","",name),element("span","",value)); list.append(item); });
    section.append(list);
    const note = element("p", "health-note");
    note.append(element("strong", "", "Cirrhosis note: "), document.createTextNode("normal AST and ALT do not by themselves measure cirrhosis severity. Continue the clinician’s liver follow-up, sodium plan, imaging, and medication guidance."));
    section.append(note);
    return section;
  }

  function renderChecklist() {
    const section = panel("Next appointment", null, true);
    section.append(bulletList([
      "Bring the full reports and confirm whether the July lipid and July 14 glucose tests were fasting.",
      "Request a repeat fasting lipid panel after a clinician-directed lifestyle interval and discuss overall cardiovascular risk.",
      "Review every prescription and supplement because medicines, alcohol, diabetes, and other conditions can raise triglycerides.",
      "Ask whether repeat CBC/CMP, iron and ferritin studies, or other testing is needed only if anemia or electrolyte abnormalities return.",
      "Coordinate diet changes with a registered dietitian or liver clinician so heart goals remain compatible with cirrhosis nutrition needs.",
    ], "health-checklist"));
    return section;
  }

  function renderUrgent() {
    const section = panel("Get urgent help", chip("Symptoms", "high"), true);
    section.classList.add("health-urgent");
    section.append(bulletList([
      "Call emergency services for chest pressure, sudden weakness or speech trouble, severe confusion, fainting, or a seizure.",
      "Seek urgent care for severe upper-abdominal pain with repeated vomiting, vomiting blood, or black/bloody stool.",
    ], "health-safety-list"));
    return section;
  }

  function renderSources() {
    const details = element("details", "health-panel health-panel-wide health-sources");
    details.append(element("summary", "", "Medical sources"));
    const list = element("ul", "health-source-list");
    sources.forEach(([label,url]) => { const item = element("li"); const link = element("a", "", label); link.href=url; link.target="_blank"; link.rel="noopener noreferrer"; item.append(link); list.append(item); });
    details.append(list, element("p", "health-disclaimer", "This dashboard organizes reported results and evidence-based questions for a clinician. It does not diagnose disease or replace medical care. Laboratory ranges and personal treatment targets vary."));
    return details;
  }

  function render(data) {
    if (!data?.latest?.lipids || !data?.latest?.glucose || !data?.latest?.hcv || !Array.isArray(data.resolved)) throw new Error("Private health data is incomplete.");
    const overview = element("section", "health-overview");
    overview.append(
      overviewCard("priority", "Priority", "Lipids", `Triglycerides ${data.latest.lipids.triglycerides} · LDL ${data.latest.lipids.ldl}`),
      overviewCard("", "Watch", "Glucose", `Fasting value ${data.latest.glucose.july14} · A1C ${data.latest.glucose.a1c}%`),
      overviewCard("clear", "Resolved", `${data.resolved.length} trends`, "Later CBC and electrolytes were within range"),
    );
    const grid = element("div", "health-grid");
    grid.append(renderLipids(data), renderGlucose(data), renderHcv(data), renderResolved(data), renderNormal(data), renderChecklist(), renderUrgent(), renderSources());
    dashboard.replaceChildren(overview, grid);
    dashboard.hidden = false;
    lock.hidden = true;
    asOf.dateTime = data.asOf;
    asOf.textContent = `Labs through ${dateLabel(data.asOf)}`;
    asOf.hidden = false;
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
    message.textContent = "Loading…";
    try {
      const row = await musicCloud.getContent("anthony", CONTENT_KEY);
      if (!row?.value) throw new Error("Private health data was not found.");
      render(row.value);
      window.dispatchEvent(new CustomEvent("site-cloud-change"));
    } catch (error) {
      if (error.status === 401) await musicCloud.signOut();
      showLocked(error.message);
    } finally { loading = false; }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button");
    submit.disabled = true;
    message.textContent = "Unlocking…";
    try {
      await musicCloud.signIn(ADMIN_EMAIL, password.value);
      sessionStorage.setItem("anthony_admin_unlocked", "1");
      password.value = "";
      await loadHealthData();
    } catch (error) { showLocked(`Could not unlock: ${error.message}`); }
    finally { submit.disabled = false; }
  });

  window.addEventListener("site-cloud-change", () => { if (musicCloud.isSignedIn() && dashboard.hidden) loadHealthData(); });
  if (musicCloud.isSignedIn()) loadHealthData(); else showLocked();
})();
