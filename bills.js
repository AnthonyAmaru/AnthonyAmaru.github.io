(() => {
  "use strict";

  const ADMIN_EMAIL = "anthonyamaru93@gmail.com";
  const CONTENT_KEY = "bills_dashboard_v1";
  const lock = document.querySelector("[data-bills-lock]");
  const dashboard = document.querySelector("[data-bills-dashboard]");
  const form = document.querySelector("[data-bills-auth]");
  const password = document.querySelector("#bills-password");
  const message = document.querySelector("[data-bills-message]");
  const asOf = document.querySelector("[data-bills-as-of]");
  let loading = false;

  if (!lock || !dashboard || !form || !window.musicCloud) return;

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

  function renderTotals(summary) {
    const section = element("section", "bill-totals");
    section.setAttribute("aria-label", "Monthly bill totals");
    [
      ["Monthly fixed", summary.monthlyFixed],
      ["After car payoff", summary.afterCarPayoff],
      ["Still due in August", summary.stillDue],
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
    ["Due", "Bill", "Amount", "August"].forEach((label) => {
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
      const statusCell = document.createElement("td");
      const statusClass = ["paid", "due", "upcoming"].includes(bill.status) ? bill.status : "upcoming";
      statusCell.append(element("span", `bill-status ${statusClass}`, bill.statusLabel));
      row.append(element("td", "", bill.due), name, element("td", "", money(bill.amount)), statusCell);
      tbody.append(row);
    });

    const tfoot = document.createElement("tfoot");
    const footRow = document.createElement("tr");
    const totalLabel = element("th", "", "Total fixed monthly");
    totalLabel.colSpan = 2;
    totalLabel.scope = "row";
    footRow.append(totalLabel, element("td", "", money(data.summary.monthlyFixed)), document.createElement("td"));
    tfoot.append(footRow);
    table.append(thead, tbody, tfoot);
    scroll.append(table);
    section.append(scroll);
    return section;
  }

  function renderBaseline(items) {
    const section = panel("Current baseline");
    const list = element("dl", "money-list");
    items.forEach((item) => {
      const row = document.createElement("div");
      row.append(element("dt", "", item.name), element("dd", "", money(item.amount)));
      list.append(row);
    });
    section.append(list);
    return section;
  }

  function renderHouseSale(houseSale) {
    const section = panel("House sale");
    section.classList.add("house-panel");
    const total = element("div", "house-sale-total");
    total.append(
      element("span", "", `Expected ${dateLabel(houseSale.closingDate)}`),
      element("strong", "", money(houseSale.expectedNet)),
      element("small", "", "net profit"),
    );
    const plan = element("ul", "house-plan");
    houseSale.plan.forEach((item) => plan.append(element("li", item.complete ? "" : "keep", item.label)));
    section.append(total, plan);
    return section;
  }

  function renderPaid(paid) {
    const trailing = element("span", "paid-total", `${money(paid.scheduledTotal)} scheduled`);
    const section = panel("Paid", trailing);
    const list = element("ul", "payment-checks");
    paid.items.forEach((item) => list.append(element("li", "", item)));
    section.append(list);
    return section;
  }

  function renderUpcoming(upcoming) {
    const total = upcoming.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const section = panel("Upcoming", element("strong", "", money(total)));
    const list = element("ol", "upcoming-list");
    upcoming.forEach((item) => {
      const row = document.createElement("li");
      const date = element("time", "", dateLabel(item.date, { month: "short", day: "numeric" }));
      date.dateTime = item.date;
      row.append(date, element("span", "", item.name), element("strong", "", money(item.amount)));
      list.append(row);
    });
    section.append(list);
    return section;
  }

  function render(data) {
    if (!data || !Array.isArray(data.schedule) || !Array.isArray(data.baseline) || !Array.isArray(data.upcoming)) {
      throw new Error("Private bill data is incomplete.");
    }
    const details = element("div", "bill-detail-grid");
    details.append(
      renderBaseline(data.baseline),
      renderHouseSale(data.houseSale),
      renderPaid(data.paid),
      renderUpcoming(data.upcoming),
    );
    dashboard.replaceChildren(renderTotals(data.summary), renderSchedule(data), details);
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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("button");
    submit.disabled = true;
    message.textContent = "Unlocking…";
    try {
      await musicCloud.signIn(ADMIN_EMAIL, password.value);
      sessionStorage.setItem("anthony_admin_unlocked", "1");
      password.value = "";
      await loadPrivateBills();
    } catch (error) {
      showLocked(`Could not unlock: ${error.message}`);
    } finally {
      submit.disabled = false;
    }
  });

  window.addEventListener("site-cloud-change", () => {
    if (musicCloud.isSignedIn() && dashboard.hidden) loadPrivateBills();
  });

  if (musicCloud.isSignedIn()) loadPrivateBills();
  else showLocked();
})();
