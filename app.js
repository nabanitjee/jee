// =========================
// JEE OS CORE
// =========================

const STORAGE_KEY = "jee_os_v2";

// ---------- STORAGE ----------

let appData = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
) || {

  theme: "blue",

  jeeMainDate: "2027-01-15",

  jeeAdvancedDate: "",

  chapters: {},

  customChapters: [],

  journal: [],

  mocks: [],

  clat: [],

  futureNotes: [],

  quests: [],

  streak: 0,

  lastActivity: null

};

function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appData)
  );
}

// =========================
// NAVIGATION
// =========================

const pages = document.querySelectorAll(".page");

function openPage(pageId) {

  pages.forEach(page => {
    page.classList.remove("active");
  });

  document
    .getElementById(pageId)
    .classList.add("active");

  document
    .querySelectorAll(".bottom-nav button")
    .forEach(btn => {
      btn.classList.remove("active-nav");
    });

  document
    .querySelector(
      `[data-page="${pageId}"]`
    )
    ?.classList.add("active-nav");

}

document
  .querySelectorAll(".bottom-nav button")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      openPage(
        btn.dataset.page
      );

    });

  });

// =========================
// THEME
// =========================

function applyTheme() {

  document.body.setAttribute(
    "data-theme",
    appData.theme
  );

}

const themeSelector =
  document.getElementById(
    "theme-selector"
  );

if (themeSelector) {

  themeSelector.value =
    appData.theme;

  themeSelector.addEventListener(
    "change",
    (e) => {

      appData.theme =
        e.target.value;

      saveData();

      applyTheme();

    }
  );

}

// =========================
// COUNTDOWNS
// =========================

function getDaysLeft(dateString) {

  if (!dateString)
    return "--";

  const today =
    new Date();

  const target =
    new Date(dateString);

  const diff =
    target - today;

  return Math.ceil(
    diff /
    (1000 * 60 * 60 * 24)
  );

}

function updateCountdowns() {

  const mainDays =
    getDaysLeft(
      appData.jeeMainDate
    );

  const advDays =
    getDaysLeft(
      appData.jeeAdvancedDate
    );

  document.getElementById(
    "jee-main-countdown"
  ).textContent =
    `${mainDays} days`;

  document.getElementById(
    "jee-advanced-countdown"
  ).textContent =
    appData.jeeAdvancedDate
      ? `${advDays} days`
      : "Not Set";

}

const mainDateInput =
  document.getElementById(
    "jee-main-date"
  );

const advDateInput =
  document.getElementById(
    "jee-advanced-date"
  );

if (mainDateInput) {

  mainDateInput.value =
    appData.jeeMainDate;

  mainDateInput.addEventListener(
    "change",
    e => {

      appData.jeeMainDate =
        e.target.value;

      saveData();

      updateCountdowns();

    }
  );

}

if (advDateInput) {

  advDateInput.value =
    appData.jeeAdvancedDate;

  advDateInput.addEventListener(
    "change",
    e => {

      appData.jeeAdvancedDate =
        e.target.value;

      saveData();

      updateCountdowns();

    }
  );

}

// =========================
// STREAK
// =========================

function updateActivity() {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  if (
    appData.lastActivity !==
    today
  ) {

    appData.lastActivity =
      today;

    appData.streak++;

    saveData();

  }

}

function renderStreak() {

  let streakEl =
    document.getElementById(
      "study-streak"
    );

  if (!streakEl)
    return;

  streakEl.textContent =
    appData.streak;

}

// =========================
// PREPARATION INDEX
// =========================

function calculatePrepIndex() {

  let total = 0;

  let score = 0;

  Object.values(
    appData.chapters
  ).forEach(ch => {

    total++;

    switch (
      ch.status
    ) {

      case "weak":
        score += 1;
        break;

      case "average":
        score += 2;
        break;

      case "strong":
        score += 3;
        break;

      case "mastered":
        score += 4;
        break;

    }

  });

  if (!total)
    return 0;

  return Math.round(
    (score /
      (total * 4)) *
    100
  );

}

function renderPrepIndex() {

  const percent =
    calculatePrepIndex();

  const bar =
    document.getElementById(
      "prep-progress"
    );

  const label =
    document.getElementById(
      "prep-percent"
    );

  if (bar)
    bar.style.width =
      percent + "%";

  if (label)
    label.textContent =
      percent + "%";

}

// =========================
// DASHBOARD COUNTS
// =========================

function renderStatusCounts() {

  let weak = 0;
  let average = 0;
  let strong = 0;
  let mastered = 0;

  Object.values(
    appData.chapters
  ).forEach(ch => {

    switch (
      ch.status
    ) {

      case "weak":
        weak++;
        break;

      case "average":
        average++;
        break;

      case "strong":
        strong++;
        break;

      case "mastered":
        mastered++;
        break;

    }

  });

  document.getElementById(
    "weak-count"
  ).textContent =
    weak;

  document.getElementById(
    "average-count"
  ).textContent =
    average;

  document.getElementById(
    "strong-count"
  ).textContent =
    strong;

  document.getElementById(
    "mastered-count"
  ).textContent =
    mastered;

}

// =========================
// MISSION DRIFT
// =========================

function checkMissionDrift() {

  if (
    !appData.lastActivity
  )
    return;

  const last =
    new Date(
      appData.lastActivity
    );

  const today =
    new Date();

  const days =
    Math.floor(
      (today - last) /
      (1000 *
        60 *
        60 *
        24)
    );

  if (days >= 3) {

    const dz =
      document.getElementById(
        "danger-zone-list"
      );

    if (dz) {

      dz.innerHTML =
        `<div class="danger-item">
          ⚠ Mission Drift Detected
        </div>`;

    }

  }

}

// =========================
// QUESTS
// =========================

function generateQuest() {

  const box =
    document.getElementById(
      "quest-list"
    );

  if (!box)
    return;

  box.innerHTML = `
    <div>□ Solve 25 PYQs</div>
    <div>□ Revise 1 Chapter</div>
    <div>□ Add Journal Entry</div>
  `;

}

// =========================
// INIT
// =========================

applyTheme();

updateCountdowns();

renderPrepIndex();

renderStatusCounts();

renderStreak();

checkMissionDrift();

generateQuest();

openPage(
  "dashboard-page"
);