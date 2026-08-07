(() => {
  "use strict";

  const CONTENT_KEY = "bills_dashboard_v1";
  const lock = document.querySelector("[data-bills-lock]");
  const dashboard = document.querySelector("[data-bills-dashboard]");
  const message = document.querySelector("[data-bills-message]");
  const asOf = document.querySelector("[data-bills-as-of]");
  let loading = false;
  let billData = null;

  if (!lock || !dashboard || !window.musicCloud) return;

  function element(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== "") node.textContent = String(text);
    return node;
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value || 0));
  }

  function dateLabel(value, options = { month: "long", day: "numeric", year: "numeric" }) {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? String(value || "") : date.toLocaleDateString("en-US", options);
  }

  function heading(title, trailing = null) {
    const row = element("div", "bill-section-heading");
    row.append(element("h2", "", title));
    if (trailing) row.append(trailing);
    return row;
  }

  function panel(title, trailing = null) {
    const section = element("section", "bill-panel");
    section.append(heading(title, trailing));
    return section;
  }

  function monthlyIncome(income) {
    return Number(income?.biweeklyNet || 0) * Number(income?.paychecksPerYear || 26) / 12;
  }

  function monthlySavings(data) {
    return Math.max(0, monthlyIncome(data.income) - Number(data.summary?.monthlyFixed || 0));
  }

  function nextPayday(anchorValue) {
    const anchor = new Date(`${anchorValue}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(anchor.getTime()) || anchor >= today) return anchorValue;
    const elapsedDays = Math.floor((today - anchor) / 86_400_000);
    const periods = Math.ceil(elapsedDays / 14);
    anchor.setDate(anchor.getDate() + periods * 14);
    return anchor.toISOString().slice(0, 10);
  }

  function renderTotals(data) {
    const section = element("section", "bill-totals");
    section.setAttribute("aria-label", "Bills and income summary");
    [
      ["Monthly bills", data.summary.monthlyFixed],
      ["Biweekly pay", data.income.biweeklyNet],
      ["Potential monthly savings", monthlySavings(data)],
    ].forEach(([label, value]) => {
      const card = element("article");
      card.append(element("span", "", label), element("strong", "", money(value)));
      section.append(card);
    });
    return section;
  }

  function renderSchedule(data) {
    const privateChip = element("span", "locked-chip", "Private");
    const section = panel("Monthly schedule", privateChip);
    section.classList.add("bill-schedule-panel");
    const scroll = element("div", "bill-table-scroll");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Due", "Bill", "Amount"].forEach((label) => {
      const th = element("th", "", label);
      th.scope = "col";
      headRow.append(th);
    });
    thead.append(headRow);

    const tbody = document.createElement("tbody");
    data.schedule.forEach((bill) => {
      const row = document.createElement("tr");
      const name = element("th", "", bill.name);
      name.scope = "row";
      row.append(element("td", "", bill.due), name, element("td", "", money(bill.amount)));
      tbody.append(row);
    });

    const tfoot = document.createElement("tfoot");
    const footRow = document.createElement("tr");
    const totalLabel = element("th", "", "Total fixed monthly");
    totalLabel.colSpan = 2;
    totalLabel.scope = "row";
    footRow.append(totalLabel, element("td", "", money(data.summary.monthlyFixed)));
    tfoot.append(footRow);
    table.append(thead, tbody, tfoot);
    scroll.append(table);
    section.append(scroll);
    return section;
  }

  function renderSavings(data) {
    const savings = data.savings || { current: 0, goal: 1 };
    const current = Math.max(0, Number(savings.current || 0));
    const goal = Math.max(1, Number(savings.goal || 1));
    const remaining = Math.max(0, goal - current);
    const available = monthlySavings(data);
    const percent = Math.min(100, current / goal * 100);
    const months = available > 0 ? Math.ceil(remaining / available) : 0;
    const section = panel("Savings goal", element("strong", "", `${Math.round(percent)}%`));
    section.classList.add("savings-panel");

    const progressCopy = element("div", "savings-progress-copy");
    progressCopy.append(element("strong", "", money(current)), element("span", "", `of ${money(goal)}`));
    const progress = document.createElement("progress");
    progress.max = goal;
    progress.value = current;
    progress.setAttribute("aria-label", `${money(current)} saved toward ${money(goal)}`);

    const facts = element("div", "savings-facts");
    [
      ["Next payday", dateLabel(nextPayday(data.income.anchorPayDate), { month: "long", day: "numeric", year: "numeric" }), false],
      ["Paycheck", data.income.biweeklyNet, true],
      ["Average monthly income", monthlyIncome(data.income), true],
      ["Potential monthly savings", available, true],
      ["Remaining", remaining, true],
      ["Estimated time", remaining === 0 ? "Goal reached" : `${months} months`, false],
    ].forEach(([label, value, isMoney]) => {
      const card = element("article");
      card.append(element("span", "", label), element("strong", "", isMoney ? money(value) : value));
      facts.append(card);
    });

    const update = element("form", "savings-update");
    update.dataset.savingsUpdate = "";
    const label = document.createElement("label");
    label.htmlFor = "current-savings";
    label.textContent = "Current saved";
    const controls = element("div");
    const input = document.createElement("input");
    input.id = "current-savings";
    input.name = "currentSavings";
    input.type = "number";
    input.min = "0";
    input.step = "1";
    input.value = String(current);
    input.inputMode = "decimal";
    const button = element("button", "", "Save");
    button.type = "submit";
    const status = element("span");
    status.dataset.savingsStatus = "";
    status.setAttribute("role", "status");
    controls.append(input, button);
    update.append(label, controls, status);

    section.append(progressCopy, progress, facts, update, element("p", "savings-note", "Estimate uses listed bills only."));
    return section;
  }

  function render(data) {
    if (!data || !Array.isArray(data.schedule) || !data.summary || !data.income || !data.savings) {
      throw new Error("Private bill data is incomplete.");
    }
    billData = data;
    dashboard.replaceChildren(renderTotals(data), renderSchedule(data), renderSavings(data));
    dashboard.hidden = false;
    lock.hidden = true;
    asOf.dateTime = data.asOf;
    asOf.textContent = dateLabel(data.asOf);
    asOf.hidden = false;
  }

  function showLocked(status = "") {
    dashboard.hidden = true;
    lock.hidden = false;
    asOf.hidden = true;
    message.textContent = status;
  }

  async function loadPrivateBills() {
    if (loading || !musicCloud.isSignedIn()) return;
    loading = true;
    message.textContent = "Loading…";
    try {
      const row = await musicCloud.getContent("anthony", CONTENT_KEY);
      if (!row?.value) throw new Error("Private bill data was not found.");
      render(row.value);
      window.dispatchEvent(new CustomEvent("site-cloud-change"));
    } catch (error) {
      if (error.status === 401) await musicCloud.signOut();
      showLocked(error.message);
    } finally {
      loading = false;
    }
  }

  dashboard.addEventListener("submit", async (event) => {
    const savingsForm = event.target.closest("[data-savings-update]");
    if (!savingsForm || !billData) return;
    event.preventDefault();
    const submit = savingsForm.querySelector("button");
    const status = savingsForm.querySelector("[data-savings-status]");
    const value = Math.max(0, Number(new FormData(savingsForm).get("currentSavings") || 0));
    submit.disabled = true;
    status.textContent = "Saving…";
    try {
      billData.savings = { ...billData.savings, current: value, updatedAt: new Date().toISOString() };
      await musicCloud.saveContent("anthony", CONTENT_KEY, billData);
      render(billData);
      dashboard.querySelector("[data-savings-status]").textContent = "Saved";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      const currentSubmit = dashboard.querySelector("[data-savings-update] button");
      if (currentSubmit) currentSubmit.disabled = false;
    }
  });

  window.addEventListener("site-cloud-change", () => {
    if (musicCloud.isSignedIn() && dashboard.hidden) loadPrivateBills();
  });

  if (musicCloud.isSignedIn()) loadPrivateBills();
  else showLocked("Unlock once from Interests for this browser session.");
})();
