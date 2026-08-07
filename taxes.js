(() => {
  "use strict";

  const ADMIN_EMAIL = "anthonyamaru93@gmail.com";
  const CONTENT_KEY = "tax_workspace_v1";
  const TAX_BUCKET = "tax-documents";
  const CURRENT_TAX_YEAR = 2025;
  const MAX_FILE_SIZE = 20 * 1024 * 1024;
  const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
  const PDFJS_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.min.mjs";
  const PDFJS_WORKER_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs";
  const TESSERACT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.esm.min.js";

  const OFFICIAL_FORMS = [
    { group: "IRS", code: "1040", title: "2025 Individual Income Tax Return", note: "Federal return", url: "https://www.irs.gov/pub/irs-pdf/f1040.pdf" },
    { group: "IRS", code: "1040i", title: "2025 Form 1040 Instructions", note: "Includes Schedules 1–3 instructions", url: "https://www.irs.gov/pub/irs-pdf/i1040gi.pdf" },
    { group: "IRS", code: "S1", title: "Schedule 1", note: "Additional income and adjustments", url: "https://www.irs.gov/pub/irs-pdf/f1040s1.pdf" },
    { group: "IRS", code: "S2", title: "Schedule 2", note: "Additional taxes", url: "https://www.irs.gov/pub/irs-pdf/f1040s2.pdf" },
    { group: "IRS", code: "S3", title: "Schedule 3", note: "Credits and payments", url: "https://www.irs.gov/pub/irs-pdf/f1040s3.pdf" },
    { group: "IRS", code: "4868", title: "Extension to File", note: "An extension to file is not an extension to pay", url: "https://www.irs.gov/pub/irs-pdf/f4868.pdf" },
    { group: "IRS", code: "W-4", title: "2026 Employee Withholding Certificate", note: "For payroll withholding, not the annual return", url: "https://www.irs.gov/pub/irs-pdf/fw4.pdf" },
    { group: "IRS", code: "FILE", title: "IRS Free File", note: "Official federal filing options", url: "https://www.irs.gov/file-your-taxes-for-free" },
    { group: "IRS", code: "ACCT", title: "IRS Individual Online Account", note: "Transcripts, notices, payments, and IP PIN", url: "https://www.irs.gov/payments/online-account-for-individuals" },
    { group: "NJ", code: "1040", title: "2025 NJ-1040", note: "New Jersey resident return", url: "https://www.nj.gov/treasury/taxation/pdf/current/1040.pdf" },
    { group: "NJ", code: "1040i", title: "2025 NJ-1040 Instructions", note: "Resident filing instructions", url: "https://www.nj.gov/treasury/taxation/pdf/current/1040i.pdf" },
    { group: "NJ", code: "2450", title: "NJ Income Tax Forms", note: "Includes NJ-2450 for excess employee contributions", url: "https://www.nj.gov/treasury/taxation/prntgit.shtml" },
    { group: "NJ", code: "W-4", title: "NJ-W4", note: "State payroll withholding certificate", url: "https://www.nj.gov/treasury/taxation/prntgit.shtml" },
    { group: "NJ", code: "FILE", title: "NJ Online Filing", note: "Official resident and nonresident filing", url: "https://www.nj.gov/treasury/taxation/forms/efile.shtml" },
    { group: "NJ", code: "PAY", title: "NJ Payments", note: "Official payment portal and instructions", url: "https://www.nj.gov/treasury/taxation/payments-notices.shtml" },
  ];

  const lock = document.querySelector("[data-tax-lock]");
  const workspaceRoot = document.querySelector("[data-tax-workspace]");
  const authForm = document.querySelector("[data-tax-auth]");
  const passwordInput = document.querySelector("#tax-password");
  const authMessage = document.querySelector("[data-tax-message]");
  const yearLabel = document.querySelector("[data-tax-year-label]");
  const profileForm = document.querySelector("[data-tax-profile-form]");
  const profileStatus = document.querySelector("[data-tax-profile-status]");
  const fileInput = document.querySelector("#tax-file-input");
  const dropZone = document.querySelector("[data-tax-drop-zone]");
  const chooseFiles = document.querySelector("[data-tax-choose-files]");
  const addW2 = document.querySelector("[data-tax-add-w2]");
  const progress = document.querySelector("[data-tax-progress]");
  const progressBar = progress?.querySelector("progress");
  const progressLabel = progress?.querySelector("span");
  const runSummary = document.querySelector("[data-tax-run-summary]");
  const documentList = document.querySelector("[data-tax-document-list]");
  const draft = document.querySelector("[data-tax-draft]");
  const history = document.querySelector("[data-tax-history]");
  const historyYear = document.querySelector("[data-tax-history-year]");
  const formLinks = document.querySelector("[data-tax-form-links]");
  const w2Dialog = document.querySelector("[data-tax-w2-dialog]");
  const w2Form = document.querySelector("[data-tax-w2-form]");
  const w2Delete = document.querySelector("[data-tax-w2-delete]");
  const w2OcrNote = document.querySelector("[data-tax-w2-ocr-note]");
  const documentViewer = document.querySelector("[data-tax-document-viewer]");
  const documentViewerTitle = document.querySelector("[data-tax-document-viewer-title]");
  const documentViewerFrame = document.querySelector("[data-tax-document-viewer-frame]");
  let documentViewerUrl = "";
  let data = blankWorkspace();
  let loading = false;
  let processingFiles = false;

  if (!lock || !workspaceRoot || !authForm || !window.musicCloud) return;

  function blankWorkspace() {
    return {
      version: 2,
      taxYear: CURRENT_TAX_YEAR,
      profile: {
        legalName: "",
        birthDate: "",
        filingStatus: "",
        address1: "",
        address2: "",
        city: "",
        state: "NJ",
        postalCode: "",
        dependents: 0,
        occupation: "",
        phone: "",
        email: "",
        njResidency: "full-year",
        municipalityCode: "",
        ssnLastFour: "",
      },
      documents: [],
      w2s: [],
      pastYears: [],
    };
  }

  function normalizeWorkspace(value) {
    const base = blankWorkspace();
    if (!value || typeof value !== "object" || Array.isArray(value)) return base;
    return {
      ...base,
      ...value,
      profile: { ...base.profile, ...(value.profile || {}) },
      documents: Array.isArray(value.documents) ? value.documents : [],
      w2s: Array.isArray(value.w2s) ? value.w2s : [],
      pastYears: Array.isArray(value.pastYears) ? value.pastYears : [],
    };
  }

  function element(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== "") node.textContent = String(text);
    return node;
  }

  function money(value) {
    const amount = Number(String(value || "0").replace(/[^0-9.-]/g, ""));
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number.isFinite(amount) ? amount : 0);
  }

  function numeric(value) {
    const parsed = Number(String(value || "").replace(/[$,\s]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function cleanAmount(value) {
    const parsed = String(value || "").replace(/[^0-9.-]/g, "");
    if (!parsed) return "";
    const amount = Number(parsed);
    return Number.isFinite(amount) ? amount.toFixed(2) : "";
  }

  function sumBox(box) {
    return data.w2s.reduce((total, item) => total + numeric(item[box]), 0);
  }

  async function sha256Hex(file) {
    const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function safeExtension(file) {
    if (file.type === "application/pdf") return "pdf";
    if (file.type === "image/png") return "png";
    return "jpg";
  }

  function setProgress(label, percent = 0) {
    if (!progress || !progressBar || !progressLabel) return;
    progress.hidden = false;
    progressBar.value = Math.max(0, Math.min(100, Number(percent) || 0));
    progressLabel.textContent = label;
  }

  function hideProgress() {
    if (progress) progress.hidden = true;
  }

  function showLocked(status = "") {
    workspaceRoot.hidden = true;
    lock.hidden = false;
    yearLabel.hidden = true;
    authMessage.textContent = status;
  }

  function showWorkspace() {
    lock.hidden = true;
    workspaceRoot.hidden = false;
    yearLabel.textContent = `Tax year ${data.taxYear}`;
    yearLabel.hidden = false;
    renderAll();
  }

  function setPanel(name) {
    document.querySelectorAll("[data-tax-panel]").forEach((panel) => { panel.hidden = panel.dataset.taxPanel !== name; });
    document.querySelectorAll("[data-tax-panel-button]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.taxPanelButton === name)));
  }

  function fillProfile() {
    Object.entries(data.profile).forEach(([name, value]) => {
      const field = profileForm.elements.namedItem(name);
      if (field) field.value = value ?? "";
    });
  }

  function readProfile() {
    const values = Object.fromEntries(new FormData(profileForm).entries());
    values.dependents = Math.max(0, Number.parseInt(values.dependents || "0", 10) || 0);
    values.state = String(values.state || "").trim().toUpperCase().slice(0, 2);
    values.ssnLastFour = String(values.ssnLastFour || "").replace(/\D/g, "").slice(-4);
    return values;
  }

  async function saveWorkspace() {
    await musicCloud.saveContent("anthony", CONTENT_KEY, data);
    window.dispatchEvent(new CustomEvent("site-cloud-change"));
  }

  function renderRunSummary() {
    const ready = data.profile.filingStatus && data.w2s.length && data.w2s.every((item) => item.box1 && item.box2 && item.box16 && item.box17);
    runSummary.replaceChildren();
    [
      ["W-2s", data.w2s.length],
      ["Documents", data.documents.length],
      ["Status", ready ? "Review" : "Setup"],
    ].forEach(([label, value]) => {
      const card = element("article");
      card.append(element("span", "", label), element("strong", "", value));
      runSummary.append(card);
    });
  }

  function renderDocuments() {
    documentList.replaceChildren();
    if (!data.documents.length) {
      documentList.append(element("div", "tax-empty", "No tax documents saved."));
      return;
    }
    [...data.documents].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))).forEach((item) => {
      const card = element("article", "tax-document-card");
      const copy = element("div");
      copy.append(element("h3", "", item.displayName || "Tax document"), element("p", "", `${item.taxYear || data.taxYear} · ${item.typeLabel || "Document"} · ${Math.max(1, Math.round(Number(item.size || 0) / 1024))} KB`));
      const actions = element("div", "tax-document-actions");
      const view = element("button", "", "View");
      view.type = "button";
      view.dataset.taxDocumentView = item.id;
      const remove = element("button", "danger", "Delete");
      remove.type = "button";
      remove.dataset.taxDocumentDelete = item.id;
      actions.append(view, remove);
      card.append(copy, actions);
      documentList.append(card);
    });
  }

  function valueRow(label, value) {
    const row = document.createElement("div");
    row.append(element("dt", "", label), element("dd", "", money(value)));
    return row;
  }

  function officialLink(label, url) {
    const link = element("a", "", label);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  function renderDraft() {
    draft.replaceChildren();
    const summaries = element("div", "tax-draft-summary");
    const federal = element("section", "tax-draft-card");
    const federalValues = element("dl");
    federal.append(element("h2", "", "Federal · Form 1040"));
    federalValues.append(valueRow("Line 1a · W-2 wages", sumBox("box1")), valueRow("Line 25a · Federal withheld", sumBox("box2")), valueRow("Social Security wages", sumBox("box3")), valueRow("Medicare wages", sumBox("box5")));
    federal.append(federalValues);
    const state = element("section", "tax-draft-card");
    const stateValues = element("dl");
    state.append(element("h2", "", "New Jersey · NJ-1040"));
    stateValues.append(valueRow("NJ wages · W-2 box 16", sumBox("box16")), valueRow("NJ withheld · W-2 box 17", sumBox("box17")), valueRow("UI/WF/SWF", sumBox("njUi")), valueRow("DI + FLI", sumBox("njDi") + sumBox("njFli")));
    state.append(stateValues);
    summaries.append(federal, state);

    const list = element("section", "tax-draft-card");
    list.append(element("h2", "", "W-2 worksheets"));
    const rows = element("div", "tax-w2-list");
    if (!data.w2s.length) rows.append(element("div", "tax-empty", "Add a W-2 to begin."));
    data.w2s.forEach((item, index) => {
      const row = element("div", "tax-w2-row");
      const label = item.employerName || `W-2 ${index + 1}`;
      const edit = element("button", "", "Review");
      edit.type = "button";
      edit.dataset.taxW2Edit = item.id;
      row.append(element("strong", "", label), element("span", "", money(item.box1)), edit);
      rows.append(row);
    });
    list.append(rows);

    const missing = [];
    if (!data.profile.filingStatus) missing.push("filing status");
    if (!data.profile.occupation) missing.push("occupation");
    if (!data.w2s.length) missing.push("W-2");
    if (data.w2s.some((item) => !item.box1 || !item.box2 || !item.box16 || !item.box17)) missing.push("W-2 box review");
    const notice = element("p", "tax-missing", missing.length ? `Still needed: ${[...new Set(missing)].join(" · ")}` : "W-2 mapping is ready for your review.");
    const filingLinks = element("div", "tax-filing-links");
    filingLinks.append(officialLink("IRS Free File", "https://www.irs.gov/file-your-taxes-for-free"), officialLink("NJ Online Filing", "https://www.nj.gov/treasury/taxation/forms/efile.shtml"));
    draft.append(summaries, list, notice, filingLinks);
  }

  function renderForms() {
    if (formLinks.childElementCount) return;
    OFFICIAL_FORMS.forEach((item) => {
      const card = element("article", "tax-form-card");
      const badge = element("span", "", item.group);
      const copy = element("div");
      copy.append(element("h3", "", `${item.code} · ${item.title}`), element("p", "", item.note));
      card.append(badge, copy, officialLink("Open", item.url));
      formLinks.append(card);
    });
  }

  function historyValue(label, value, options = {}) {
    const row = element("div", options.emphasis ? "emphasis" : "");
    row.append(element("dt", "", label), element("dd", "", options.raw ? value : money(value)));
    return row;
  }

  function historyCard(title, values = []) {
    const card = element("section", "tax-history-card");
    card.append(element("h2", "", title));
    const list = element("dl");
    values.forEach((value) => list.append(historyValue(value[0], value[1], value[2])));
    card.append(list);
    return card;
  }

  function renderHistory() {
    if (!history || !historyYear) return;
    const years = [...data.pastYears].sort((a, b) => Number(b.taxYear) - Number(a.taxYear));
    const selected = Number(historyYear.value || years[0]?.taxYear || 0);
    historyYear.replaceChildren();
    years.forEach((item) => {
      const option = element("option", "", item.taxYear);
      option.value = item.taxYear;
      option.selected = Number(item.taxYear) === selected;
      historyYear.append(option);
    });
    history.replaceChildren();
    if (!years.length) {
      historyYear.disabled = true;
      history.append(element("div", "tax-empty", "No prior tax years saved."));
      return;
    }
    historyYear.disabled = false;
    const record = years.find((item) => Number(item.taxYear) === selected) || years[0];
    historyYear.value = String(record.taxYear);
    const federal = record.federal || {};
    const nj = record.newJersey || {};
    const business = record.business || {};
    const itemized = record.itemized || {};
    const qbi = record.qbi || {};

    const masthead = element("header", "tax-history-masthead");
    const mastheadCopy = element("div");
    mastheadCopy.append(element("span", "", `Tax year ${record.taxYear}`), element("h2", "", record.status || "Return copy saved"), element("p", "", `${record.filingStatus || "—"} · ${Number(record.dependents || 0)} dependents`));
    masthead.append(mastheadCopy);

    const figures = element("div", "tax-history-figures");
    [
      ["Federal AGI", federal.agi],
      ["Federal tax", federal.totalTax],
      ["Federal owed", federal.amountOwed],
      ["NJ owed", nj.amountOwed],
    ].forEach(([label, value]) => {
      const card = element("article");
      card.append(element("span", "", label), element("strong", "", money(value)));
      figures.append(card);
    });

    const details = element("div", "tax-history-grid");
    details.append(
      historyCard("Federal", [
        ["W-2 wages", federal.w2Wages],
        ["Schedule C income", federal.scheduleCIncome],
        ["Total income", federal.totalIncome],
        ["Adjustments", federal.adjustments],
        ["Adjusted gross income", federal.agi, { emphasis: true }],
        ["Itemized deductions", federal.itemizedDeductions],
        ["Qualified tips deduction", federal.additionalDeductions],
        ["QBI deduction", federal.qbiDeduction],
        ["Taxable income", federal.taxableIncome],
        ["Income tax", federal.incomeTax],
        ["Self-employment tax", federal.selfEmploymentTax],
        ["Total tax", federal.totalTax, { emphasis: true }],
        ["Federal withholding", federal.withholding],
        ["Amount owed", federal.amountOwed, { emphasis: true }],
        ["Estimated-tax penalty", federal.estimatedTaxPenalty],
      ]),
      historyCard("New Jersey", [
        ["NJ wages", nj.wages],
        ["Business income", nj.businessIncome],
        ["Gross income", nj.grossIncome],
        ["Exemption", nj.exemptionAmount],
        ["Property tax paid", nj.propertyTaxPaid],
        ["Property tax deduction", nj.propertyTaxDeduction],
        ["NJ taxable income", nj.taxableIncome],
        ["Income tax", nj.incomeTax],
        ["Shared responsibility payment", nj.sharedResponsibilityPayment],
        ["Total tax due", nj.totalTaxDue, { emphasis: true }],
        ["NJ withholding", nj.withholding],
        ["Excess UI credit", nj.excessUiCredit],
        ["Total payments + credits", nj.totalPayments],
        ["Amount owed", nj.amountOwed, { emphasis: true }],
      ]),
      historyCard("Schedule C · Rideshare", [
        ["Gross receipts", business.grossReceipts],
        ["Car + truck expense", business.carTruckExpense],
        ["Utilities", business.utilities],
        ["Other expenses", business.otherExpenses],
        ["Total expenses", business.totalExpenses],
        ["Net profit", business.netProfit, { emphasis: true }],
        ["Business miles", Number(business.businessMiles || 0).toLocaleString("en-US"), { raw: true }],
        ["Vehicle in service", business.vehiclePlacedInService || "—", { raw: true }],
      ]),
      historyCard("Itemized + QBI", [
        ["State + local income tax", itemized.stateLocalIncomeTax],
        ["Real-estate tax", itemized.realEstateTax],
        ["Mortgage interest", itemized.mortgageInterest],
        ["Itemized total", itemized.total, { emphasis: true }],
        ["Qualified business income", qbi.qualifiedBusinessIncome],
        ["QBI deduction", qbi.deduction],
        ["QBI loss carryforward", qbi.lossCarryforward],
      ]),
    );

    const employers = element("section", "tax-history-card tax-history-wide");
    employers.append(element("h2", "", "W-2s"));
    const employerList = element("div", "tax-history-employers");
    data.w2s.filter((item) => Number(item.taxYear) === Number(record.taxYear)).forEach((item) => {
      const row = element("article");
      const name = element("strong", "", item.employerName || "Employer");
      const values = element("span", "", `${money(item.box1)} wages · ${money(item.box2)} federal · ${money(item.box17)} NJ withheld`);
      row.append(name, values);
      employerList.append(row);
    });
    if (!employerList.childElementCount) employerList.append(element("div", "tax-empty compact", "No W-2 summaries saved for this year."));
    employers.append(employerList);

    const nextYear = element("section", "tax-history-next");
    nextYear.append(element("h2", "", `${Number(record.taxYear) + 1} file`));
    const carry = element("div", "tax-history-carry");
    const agi = element("article");
    agi.append(element("span", "", "Prior-year AGI"), element("strong", "", money(federal.agi)), element("small", "", "E-file identity check"));
    carry.append(agi);
    (record.carryForward || []).forEach((item) => {
      const card = element("article");
      card.append(element("span", "", item.label), element("strong", "", item.value), element("small", "", item.note || ""));
      carry.append(card);
    });
    nextYear.append(carry);

    const estimates = element("div", "tax-estimates");
    estimates.append(element("h3", "", "Estimated tax vouchers"));
    const estimateRows = element("div");
    (record.estimatedTax || []).forEach((payment) => {
      const row = element("article");
      row.append(element("span", "", payment.dueDate), element("strong", "", money(payment.amount)), element("small", "", payment.status || "Verify payment"));
      estimateRows.append(row);
    });
    estimates.append(estimateRows, element("p", "", "Voucher amounts are planned payments, not proof that a payment was made."));
    nextYear.append(estimates);

    const documentSection = element("section", "tax-history-card tax-history-wide");
    documentSection.append(element("h2", "", "Saved files"));
    const documentRows = element("div", "tax-history-documents");
    data.documents.filter((item) => Number(item.taxYear) === Number(record.taxYear)).forEach((item) => {
      const row = element("article");
      const view = element("button", "", "View");
      view.type = "button";
      view.dataset.taxDocumentView = item.id;
      row.append(element("span", "", item.displayName || "Tax document"), element("small", "", item.typeLabel || "Document"), view);
      documentRows.append(row);
    });
    if (!documentRows.childElementCount) documentRows.append(element("div", "tax-empty compact", "No files saved for this year."));
    documentSection.append(documentRows);

    history.append(masthead, figures, details, employers, nextYear, documentSection);
  }

  function renderAll() {
    fillProfile();
    renderRunSummary();
    renderDocuments();
    renderDraft();
    renderHistory();
    renderForms();
  }

  async function loadPrivateWorkspace() {
    if (loading || !musicCloud.isSignedIn()) return;
    loading = true;
    authMessage.textContent = "Loading…";
    try {
      const row = await musicCloud.getContent("anthony", CONTENT_KEY);
      data = normalizeWorkspace(row?.value);
      showWorkspace();
      window.dispatchEvent(new CustomEvent("site-cloud-change"));
    } catch (error) {
      if (error.status === 401) await musicCloud.signOut();
      showLocked(error.message);
    } finally {
      loading = false;
    }
  }

  function findAmount(text, label) {
    const source = text.replace(/\r/g, "\n").replace(/[|]/g, " ");
    const match = source.match(new RegExp(`${label}[\\s\\S]{0,75}?\\$?\\s*([0-9][0-9,]*\\.[0-9]{2})`, "i"));
    return match ? cleanAmount(match[1]) : "";
  }

  function parseW2Text(text) {
    const normalized = String(text || "").replace(/\u00a0/g, " ");
    const year = normalized.match(/\b20(?:2[0-9]|3[0-9])\b/)?.[0] || data.taxYear;
    return {
      id: crypto.randomUUID(),
      documentId: "",
      employerName: "",
      taxYear: Number(year),
      box1: findAmount(normalized, "(?:1\\s*)?Wages[,\\s]+tips[,\\s]+other compensation"),
      box2: findAmount(normalized, "(?:2\\s*)?Federal income tax withheld"),
      box3: findAmount(normalized, "(?:3\\s*)?Social security wages"),
      box4: findAmount(normalized, "(?:4\\s*)?Social security tax withheld"),
      box5: findAmount(normalized, "(?:5\\s*)?Medicare wages(?: and tips)?"),
      box6: findAmount(normalized, "(?:6\\s*)?Medicare tax withheld"),
      box16: findAmount(normalized, "(?:16\\s*)?State wages[,\\s]+tips[,\\s]+etc\\.?"),
      box17: findAmount(normalized, "(?:17\\s*)?State income tax"),
      njUi: findAmount(normalized, "(?:UI|WF|SWF|UI/WF/SWF)"),
      njDi: findAmount(normalized, "(?:DI|disability insurance)"),
      njFli: findAmount(normalized, "(?:FLI|family leave insurance)"),
      extraction: normalized.trim() ? "OCR values require review" : "No text was recognized; enter the boxes manually",
    };
  }

  async function recognizeImage(source, progressPrefix) {
    setProgress(`${progressPrefix} · loading OCR`, 42);
    const module = await import(TESSERACT_URL);
    const recognize = module.recognize || module.default?.recognize;
    if (typeof recognize !== "function") throw new Error("The local OCR engine could not be loaded.");
    const result = await recognize(source, "eng", {
      logger: (entry) => {
        if (entry.status === "recognizing text") setProgress(`${progressPrefix} · reading`, 45 + Math.round(Number(entry.progress || 0) * 45));
      },
    });
    return String(result?.data?.text || "");
  }

  async function extractPdfText(file) {
    const pdfjs = await import(PDFJS_URL);
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false }).promise;
    const pages = Math.min(pdf.numPages, 4);
    const textParts = [];
    for (let pageNumber = 1; pageNumber <= pages; pageNumber += 1) {
      setProgress(`Reading PDF page ${pageNumber}`, 24 + Math.round((pageNumber / pages) * 20));
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      textParts.push(content.items.map((item) => String(item.str || "")).join("\n"));
    }
    const text = textParts.join("\n").trim();
    if (text.length > 120) return text;

    const imageText = [];
    for (let pageNumber = 1; pageNumber <= Math.min(pages, 2); pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext("2d", { alpha: false }), viewport }).promise;
      imageText.push(await recognizeImage(canvas, `OCR page ${pageNumber}`));
      canvas.width = 1;
      canvas.height = 1;
    }
    return imageText.join("\n");
  }

  async function extractText(file) {
    if (file.type === "application/pdf") return extractPdfText(file);
    const url = URL.createObjectURL(file);
    try { return await recognizeImage(url, "OCR image"); }
    finally { URL.revokeObjectURL(url); }
  }

  async function processFiles(fileList) {
    if (processingFiles) return;
    const files = [...fileList];
    if (!files.length) return;
    processingFiles = true;
    const createdW2Ids = [];
    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        if (!ALLOWED_TYPES.has(file.type)) throw new Error(`${file.name} is not a PDF, JPG, or PNG file.`);
        if (file.size > MAX_FILE_SIZE) throw new Error(`${file.name} is larger than 20 MB.`);
        setProgress(`Checking ${file.name}`, 5);
        const hash = await sha256Hex(file);
        if (data.documents.some((item) => item.sha256 === hash)) {
          setProgress(`${file.name} is already saved`, 100);
          continue;
        }

        let text = "";
        let extractionError = "";
        try { text = await extractText(file); }
        catch (error) { extractionError = error.message || "OCR was unavailable."; }

        setProgress(`Saving ${file.name}`, 92);
        const id = crypto.randomUUID();
        const storagePath = `anthony/${musicCloud.user.id}/${data.taxYear}/${id}.${safeExtension(file)}`;
        await musicCloud.uploadPrivateFile(TAX_BUCKET, storagePath, file);
        const documentRecord = {
          id,
          displayName: file.name,
          storagePath,
          mimeType: file.type,
          size: file.size,
          sha256: hash,
          taxYear: data.taxYear,
          typeLabel: "W-2",
          createdAt: new Date().toISOString(),
        };
        const w2 = parseW2Text(text);
        w2.documentId = id;
        if (extractionError) w2.extraction = `Saved securely. ${extractionError} Enter the boxes manually.`;
        data.documents.push(documentRecord);
        data.w2s.push(w2);
        createdW2Ids.push(w2.id);
        await saveWorkspace();
        setProgress(`Saved ${file.name}`, 100);
      }
      renderAll();
      setPanel("draft");
      if (createdW2Ids.length) openW2Editor(createdW2Ids[0]);
    } catch (error) {
      setProgress(error.message || "The file could not be processed.", 0);
    } finally {
      processingFiles = false;
      fileInput.value = "";
      setTimeout(hideProgress, 3500);
    }
  }

  function openW2Editor(id = "") {
    const item = data.w2s.find((entry) => entry.id === id) || {
      id: "",
      employerName: "",
      taxYear: data.taxYear,
      box1: "", box2: "", box3: "", box4: "", box5: "", box6: "", box16: "", box17: "", njUi: "", njDi: "", njFli: "",
      extraction: "Manual W-2 worksheet",
    };
    [...w2Form.elements].forEach((field) => {
      if (!field.name) return;
      field.value = item[field.name] ?? "";
    });
    w2Delete.hidden = !item.id;
    w2Delete.dataset.taxW2Delete = item.id || "";
    w2OcrNote.textContent = item.extraction || "Review every value against the W-2 before filing.";
    if (typeof w2Dialog.showModal === "function") w2Dialog.showModal();
    else w2Dialog.setAttribute("open", "");
  }

  async function deleteW2(id) {
    const item = data.w2s.find((entry) => entry.id === id);
    if (!item || !window.confirm("Delete this W-2 worksheet? The uploaded document will remain in Documents.")) return;
    data.w2s = data.w2s.filter((entry) => entry.id !== id);
    await saveWorkspace();
    renderAll();
    w2Dialog.close();
  }

  async function viewDocument(id) {
    const item = data.documents.find((entry) => entry.id === id);
    if (!item) return;
    const button = document.querySelector(`[data-tax-document-view="${CSS.escape(id)}"]`);
    if (button) button.disabled = true;
    try {
      const blob = await musicCloud.downloadPrivateFile(TAX_BUCKET, item.storagePath);
      const url = URL.createObjectURL(blob);
      if (documentViewer && documentViewerFrame) {
        if (documentViewerUrl) URL.revokeObjectURL(documentViewerUrl);
        documentViewerUrl = url;
        documentViewerTitle.textContent = item.displayName || "Tax document";
        documentViewerFrame.src = url;
        if (typeof documentViewer.showModal === "function") documentViewer.showModal();
        else window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
    } catch (error) {
      window.alert(`Could not open the document: ${error.message}`);
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function deleteDocument(id) {
    const item = data.documents.find((entry) => entry.id === id);
    if (!item || !window.confirm(`Permanently delete ${item.displayName}?`)) return;
    await musicCloud.deletePrivateFiles(TAX_BUCKET, [item.storagePath]);
    data.documents = data.documents.filter((entry) => entry.id !== id);
    data.w2s = data.w2s.filter((entry) => entry.documentId !== id);
    await saveWorkspace();
    renderAll();
  }

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = authForm.querySelector("button");
    submit.disabled = true;
    authMessage.textContent = "Unlocking…";
    try {
      await musicCloud.signIn(ADMIN_EMAIL, passwordInput.value);
      sessionStorage.setItem("anthony_admin_unlocked", "1");
      passwordInput.value = "";
      await loadPrivateWorkspace();
    } catch (error) {
      showLocked(`Could not unlock: ${error.message}`);
    } finally {
      submit.disabled = false;
    }
  });

  document.querySelectorAll("[data-tax-panel-button]").forEach((button) => button.addEventListener("click", () => setPanel(button.dataset.taxPanelButton)));
  chooseFiles.addEventListener("click", () => fileInput.click());
  addW2.addEventListener("click", () => openW2Editor());
  fileInput.addEventListener("change", () => processFiles(fileInput.files));
  ["dragenter", "dragover"].forEach((type) => dropZone.addEventListener(type, (event) => { event.preventDefault(); dropZone.classList.add("dragging"); }));
  ["dragleave", "drop"].forEach((type) => dropZone.addEventListener(type, (event) => { event.preventDefault(); dropZone.classList.remove("dragging"); }));
  dropZone.addEventListener("drop", (event) => processFiles(event.dataTransfer.files));

  profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = profileForm.querySelector("button[type='submit']");
    submit.disabled = true;
    profileStatus.textContent = "Saving…";
    try {
      data.profile = readProfile();
      await saveWorkspace();
      renderRunSummary();
      renderDraft();
      profileStatus.textContent = "Saved to private cloud";
    } catch (error) {
      profileStatus.textContent = error.message;
    } finally {
      submit.disabled = false;
    }
  });

  w2Form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(w2Form).entries());
    const id = values.id || crypto.randomUUID();
    const existing = data.w2s.find((item) => item.id === id);
    const next = { ...(existing || {}), id, employerName: String(values.employerName || "").trim(), taxYear: Number(values.taxYear || data.taxYear), extraction: existing?.extraction || "Manual W-2 worksheet" };
    ["box1", "box2", "box3", "box4", "box5", "box6", "box16", "box17", "njUi", "njDi", "njFli"].forEach((field) => { next[field] = cleanAmount(values[field]); });
    if (existing) data.w2s = data.w2s.map((item) => item.id === id ? next : item);
    else data.w2s.push(next);
    const submit = w2Form.querySelector("button[type='submit']");
    submit.disabled = true;
    try {
      await saveWorkspace();
      renderAll();
      w2Dialog.close();
      setPanel("draft");
    } finally { submit.disabled = false; }
  });

  w2Delete.addEventListener("click", () => deleteW2(w2Delete.dataset.taxW2Delete));
  document.querySelector("[data-tax-w2-close]").addEventListener("click", () => w2Dialog.close());
  document.querySelector("[data-tax-document-viewer-close]")?.addEventListener("click", () => documentViewer.close());
  documentViewer?.addEventListener("close", () => {
    if (documentViewerFrame) documentViewerFrame.removeAttribute("src");
    if (documentViewerUrl) URL.revokeObjectURL(documentViewerUrl);
    documentViewerUrl = "";
  });
  draft.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-tax-w2-edit]");
    if (edit) openW2Editor(edit.dataset.taxW2Edit);
  });
  documentList.addEventListener("click", (event) => {
    const view = event.target.closest("[data-tax-document-view]");
    const remove = event.target.closest("[data-tax-document-delete]");
    if (view) viewDocument(view.dataset.taxDocumentView);
    if (remove) deleteDocument(remove.dataset.taxDocumentDelete);
  });
  history?.addEventListener("click", (event) => {
    const view = event.target.closest("[data-tax-document-view]");
    if (view) viewDocument(view.dataset.taxDocumentView);
  });
  historyYear?.addEventListener("change", renderHistory);

  window.addEventListener("site-cloud-change", () => {
    if (musicCloud.isSignedIn() && workspaceRoot.hidden) loadPrivateWorkspace();
  });

  renderForms();
  if (musicCloud.isSignedIn()) loadPrivateWorkspace();
  else showLocked();
})();
