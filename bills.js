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

  function fixedMonthlyTotal(schedule = []) {
    return schedule.reduce((total, item) => total + Number(item?.amount || 0), 0);
  }

  function primaryMonthlyIncome(income) {
    return Number(income?.biweeklyNet || 0) * Number(income?.paychecksPerYear || 26) / 12;
  }

  function monthlyIncome(income) {
    return primaryMonthlyIncome(income) + Number(income?.secondaryMonthly || 0);
  }

  function dailyTotal(dailyCosts = []) {
    return dailyCosts.reduce((total, item) => total + Number(item?.amount || 0), 0);
  }

  function monthlyDailyCosts(data) {
    return dailyTotal(data.daily) * 365 / 12;
  }

  function monthlyExpenses(data) {
    return fixedMonthlyTotal(data.schedule) + monthlyDailyCosts(data);
  }

  function monthlySavings(data) {
    return Math.max(0, monthlyIncome(data.income) - monthlyExpenses(data));
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

  function normalizeData(data) {
    const schedule = Array.isArray(data?.schedule) ? data.schedule.map((item) => ({
      due: String(item?.due || "").trim(),
      name: String(item?.name || "").trim(),
      amount: Math.max(0, Number(item?.amount || 0)),
    })) : [];
    const daily = Array.isArray(data?.daily) ? data.daily.map((item) => ({
      name: String(item?.name || "").trim(),
      amount: Math.max(0, Number(item?.amount || 0)),
    })) : [];
    const income = {
      ...data.income,
      biweeklyNet: Math.max(0, Number(data.income?.biweeklyNet || 0)),
      secondaryMonthly: Math.max(0, Number(data.income?.secondaryMonthly || 0)),
      paychecksPerYear: Math.max(1, Number(data.income?.paychecksPerYear || 26)),
    };
    const savings = {
      ...data.savings,
      current: Math.max(0, Number(data.savings?.current || 0)),
      goal: Math.max(1, Number(data.savings?.goal || 1)),
    };
    return {
      ...data,
      version: Math.max(4, Number(data.version || 0)),
      schedule,
      daily,
      income,
      savings,
      summary: { ...data.summary, monthlyFixed: fixedMonthlyTotal(schedule) },
    };
  }

  function renderTotals(data) {
    const section = element("section", "bill-totals");
    section.setAttribute("aria-label", "Finances and income summary");
    [
      ["Fixed monthly bills", money(fixedMonthlyTotal(data.schedule))],
      ["Total monthly income", money(monthlyIncome(data.income))],
      ["Potential monthly savings", money(monthlySavings(data))],
    ].forEach(([label, value]) => {
      const card = element("article");
      card.append(element("span", "", label), element("strong", "", value));
      section.append(card);
    });
    return section;
  }

  function renderSchedule(data) {
    const privateChip = element("span", "locked-chip", "Private");
    const section = panel("Payment schedule", privateChip);
    section.classList.add("bill-schedule-panel");
    const scroll = element("div", "bill-table-scroll");
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Frequency", "Bill", "Amount"].forEach((label) => {
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
    data.daily.forEach((cost) => {
      const row = document.createElement("tr");
      row.className = "daily-cost-row";
      const name = element("th", "", cost.name);
      name.scope = "row";
      row.append(element("td", "", "Daily"), name, element("td", "", `${money(cost.amount)}/day`));
      tbody.append(row);
    });

    const tfoot = document.createElement("tfoot");
    [
      ["Fixed monthly total", fixedMonthlyTotal(data.schedule)],
      ["Average monthly total", monthlyExpenses(data)],
    ].forEach(([label, value]) => {
      const row = document.createElement("tr");
      const totalLabel = element("th", "", label);
      totalLabel.colSpan = 2;
      totalLabel.scope = "row";
      row.append(totalLabel, element("td", "", money(value)));
      tfoot.append(row);
    });
    table.append(thead, tbody, tfoot);
    scroll.append(table);
    section.append(scroll);
    return section;
  }

  function renderIncome(data) {
    const section = panel("Income");
    section.classList.add("income-panel");
    const facts = element("div", "income-facts");
    [
      ["Primary biweekly", data.income.biweeklyNet],
      ["Primary monthly average", primaryMonthlyIncome(data.income)],
      ["Secondary monthly", data.income.secondaryMonthly],
      ["Total monthly income", monthlyIncome(data.income)],
    ].forEach(([label, value]) => {
      const card = element("article");
      card.append(element("span", "", label), element("strong", "", money(value)));
      facts.append(card);
    });
    section.append(facts);
    return section;
  }

  function editorField(labelText, name, value, type = "number") {
    const label = element("label", "bill-editor-field");
    const caption = element("span", "", labelText);
    const input = document.createElement("input");
    input.name = name;
    input.type = type;
    input.value = String(value ?? "");
    input.required = true;
    if (type === "number") {
      input.min = "0";
      input.step = "0.01";
      input.inputMode = "decimal";
    }
    label.append(caption, input);
    return label;
  }

  function editorGroup(title) {
    const group = document.createElement("fieldset");
    group.className = "bill-editor-group";
    group.append(element("legend", "", title));
    return group;
  }

  function renderEditor(data) {
    const details = document.createElement("details");
    details.className = "bill-panel bill-editor";
    const summary = document.createElement("summary");
    summary.append(element("strong", "", "Edit values"), element("span", "", "Bills · income · savings"));
    const form = element("form", "bill-editor-form");
    form.dataset.billsEditor = "";

    const income = editorGroup("Income");
    const incomeGrid = element("div", "bill-editor-grid two-columns");
    incomeGrid.append(
      editorField("Primary biweekly pay", "primaryIncome", data.income.biweeklyNet),
      editorField("Secondary monthly income", "secondaryIncome", data.income.secondaryMonthly),
    );
    income.append(incomeGrid);

    const bills = editorGroup("Monthly bills");
    const billRows = element("div", "bill-editor-rows");
    data.schedule.forEach((bill, index) => {
      const row = element("div", "bill-editor-row monthly-row");
      row.append(
        editorField("Due", `scheduleDue${index}`, bill.due, "text"),
        editorField("Bill", `scheduleName${index}`, bill.name, "text"),
        editorField("Amount", `scheduleAmount${index}`, bill.amount),
      );
      billRows.append(row);
    });
    bills.append(billRows);

    const daily = editorGroup("Daily costs");
    const dailyRows = element("div", "bill-editor-rows");
    data.daily.forEach((cost, index) => {
      const row = element("div", "bill-editor-row daily-row");
      row.append(
        editorField("Cost", `dailyName${index}`, cost.name, "text"),
        editorField("Amount per day", `dailyAmount${index}`, cost.amount),
      );
      dailyRows.append(row);
    });
    daily.append(dailyRows);

    const savings = editorGroup("Savings");
    const savingsGrid = element("div", "bill-editor-grid two-columns");
    savingsGrid.append(
      editorField("Current saved", "currentSavings", data.savings.current),
      editorField("Savings goal", "savingsGoal", data.savings.goal),
    );
    savings.append(savingsGrid);

    const actions = element("div", "bill-editor-actions");
    const save = element("button", "", "Save changes");
    save.type = "submit";
    const status = element("span");
    status.dataset.billsEditorStatus = "";
    status.setAttribute("role", "status");
    actions.append(save, status);
    form.append(income, bills, daily, savings, actions);
    details.append(summary, form);
    return details;
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
      ["Total monthly income", monthlyIncome(data.income), true],
      ["Average monthly expenses", monthlyExpenses(data), true],
      ["Potential monthly savings", available, true],
      ["Remaining", remaining, true],
      ["Estimated time", remaining === 0 ? "Goal reached" : `${months} months`, false],
    ].forEach(([label, value, isMoney]) => {
      const card = element("article");
      card.append(element("span", "", label), element("strong", "", isMoney ? money(value) : value));
      facts.append(card);
    });

    section.append(progressCopy, progress, facts, element("p", "savings-note", "Estimate uses listed fixed bills plus daily costs averaged over 365 days."));
    return section;
  }

  function render(data) {
    if (!data || !Array.isArray(data.schedule) || !data.summary || !data.income || !data.savings) {
      throw new Error("Private bill data is incomplete.");
    }
    billData = normalizeData(data);
    dashboard.replaceChildren(renderTotals(billData), renderIncome(billData), renderSchedule(billData), renderSavings(billData), renderEditor(billData));
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
    const editor = event.target.closest("[data-bills-editor]");
    if (!editor || !billData) return;
    event.preventDefault();
    const submit = editor.querySelector("button[type='submit']");
    const status = editor.querySelector("[data-bills-editor-status]");
    const fields = new FormData(editor);
    const numberValue = (name, fallback, minimum = 0) => {
      const value = Number(fields.get(name));
      return Number.isFinite(value) ? Math.max(minimum, value) : fallback;
    };
    const textValue = (name, fallback) => String(fields.get(name) || "").trim() || fallback;
    const schedule = billData.schedule.map((bill, index) => ({
      due: textValue(`scheduleDue${index}`, bill.due),
      name: textValue(`scheduleName${index}`, bill.name),
      amount: numberValue(`scheduleAmount${index}`, bill.amount),
    }));
    const daily = billData.daily.map((cost, index) => ({
      name: textValue(`dailyName${index}`, cost.name),
      amount: numberValue(`dailyAmount${index}`, cost.amount),
    }));
    const nextData = normalizeData({
      ...billData,
      version: 4,
      schedule,
      daily,
      income: {
        ...billData.income,
        biweeklyNet: numberValue("primaryIncome", billData.income.biweeklyNet),
        secondaryMonthly: numberValue("secondaryIncome", billData.income.secondaryMonthly),
      },
      savings: {
        ...billData.savings,
        current: numberValue("currentSavings", billData.savings.current),
        goal: numberValue("savingsGoal", billData.savings.goal, 1),
        updatedAt: new Date().toISOString(),
      },
    });
    submit.disabled = true;
    status.textContent = "Saving…";
    try {
      await musicCloud.saveContent("anthony", CONTENT_KEY, nextData);
      render(nextData);
      const savedEditor = dashboard.querySelector(".bill-editor");
      const savedStatus = dashboard.querySelector("[data-bills-editor-status]");
      if (savedEditor) savedEditor.open = true;
      if (savedStatus) savedStatus.textContent = "Saved";
    } catch (error) {
      status.textContent = error.message;
      submit.disabled = false;
    }
  });

  window.addEventListener("site-cloud-change", () => {
    if (musicCloud.isSignedIn() && dashboard.hidden) loadPrivateBills();
  });

  if (musicCloud.isSignedIn()) loadPrivateBills();
  else showLocked("Unlock once from Interests for this browser session.");
})();
