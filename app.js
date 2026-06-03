// =========================
// JEE OS CORE V3
// =========================

const STORAGE_KEY = "jee_os_v3";

// =========================
// STORAGE
// =========================

let appData = JSON.parse(
localStorage.getItem(
STORAGE_KEY
)
) || {

jeeMainDate:
"2027-01-15",

jeeAdvancedDate:
"",

chapters: {},

journal: [],

mocks: [],

clat: [],

futureNotes: [],

streak: 0,

lastActivity: null

};

function saveData() {

localStorage.setItem(
STORAGE_KEY,
JSON.stringify(
appData
)
);

}

// =========================
// NAVIGATION
// =========================

const pages =
document.querySelectorAll(
".page"
);

function openPage(pageId){

  document
    .querySelectorAll(".page")
    .forEach(page=>{
      page.style.display="none";
      page.classList.remove("active");
    });

  const target =
    document.getElementById(pageId);

  if(target){
    target.style.display="block";
    target.classList.add("active");
  }

  document
    .querySelectorAll(".bottom-nav button")
    .forEach(btn=>{
      btn.classList.remove("active-nav");
    });

  document
    .querySelector(
      `[data-page="${pageId}"]`
    )
    ?.classList.add("active-nav");

}

document
.querySelectorAll(
".bottom-nav button"
)
.forEach(btn => {

  btn.classList.remove(
    "active-nav"
  );

});

document
.querySelector(
"[data-page="${pageId}"]"
)
?.classList.add(
"active-nav"
);

}

document
.querySelectorAll(
".bottom-nav button"
)
.forEach(btn => {

btn.addEventListener(
  "click",
  () => {

    openPage(
      btn.dataset.page
    );

  }
);

});

// =========================
// DATE SYSTEM
// =========================

function getDaysLeft(
dateString
) {

if (!dateString)
return "--";

const today =
new Date();

const target =
new Date(
dateString
);

const diff =
target - today;

return Math.ceil(
diff /
(
1000 *
60 *
60 *
24
)
);

}

function updateCountdowns() {

const main =
document.getElementById(
"jee-main-countdown"
);

const adv =
document.getElementById(
"jee-advanced-countdown"
);

if (main) {

main.textContent =
  getDaysLeft(
    appData.jeeMainDate
  ) + " days";

}

if (adv) {

adv.textContent =
  appData.jeeAdvancedDate
  ? getDaysLeft(
      appData.jeeAdvancedDate
    ) + " days"
  : "Not Set";

}

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
// DROP DAY
// =========================

function renderDropDay() {

const el =
document.getElementById(
"drop-day"
);

if (!el)
return;

const start =
new Date(
"2026-06-03"
);

const today =
new Date();

const diff =
Math.floor(
(
today -
start
) /
(
1000 *
60 *
60 *
24
)
);

el.textContent =
diff + 1;

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

const el =
document.getElementById(
"study-streak"
);

if (!el)
return;

el.textContent =
appData.streak;

}

// =========================
// PREP INDEX
// =========================

function calculatePrepIndex() {

const chapters =
Object.values(
appData.chapters
);

if (
chapters.length === 0
)
return 0;

let total = 0;

chapters.forEach(
ch => {

  let status = 0;

  switch (
    ch.status
  ) {

    case "weak":
      status = 25;
      break;

    case "average":
      status = 50;
      break;

    case "strong":
      status = 75;
      break;

    case "mastered":
      status = 100;
      break;

  }

  const pyq =
    ch.pyq || 0;

  const revision =
    (
      (ch.revision1
        ? 1
        : 0) +
      (ch.revision2
        ? 1
        : 0) +
      (ch.revision3
        ? 1
        : 0)
    ) / 3 * 100;

  total +=

    status * 0.4 +

    pyq * 0.4 +

    revision * 0.2;

}

);

return Math.round(
total /
chapters.length
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
// STATUS COUNTS
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
).textContent = weak;

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
// FUTURE ME WIDGET
// =========================

function renderFutureWidget() {

const box =
document.getElementById(
"motivation-card"
);

if (!box)
return;

if (
!appData.futureNotes ||
appData.futureNotes.length
=== 0
) {

box.textContent =
  "No Future Notes Yet";

return;

}

const latest =
appData.futureNotes[
appData.futureNotes
.length - 1
];

box.textContent =
latest.message ||
latest.text ||
"Keep Going.";

}

// =========================
// MISSION BOARD
// =========================

function renderMissionBoard() {

const box =
document.getElementById(
"mission-board"
);

if (!box)
return;

const weakest =
Object.entries(
appData.chapters
)

.sort(
  (a,b) =>
    (a[1].pyq||0) -
    (b[1].pyq||0)
)[0];

if (!weakest) {

box.textContent =
  "No Mission Yet";

return;

}

box.innerHTML = `

Target Chapter

<br><br>

  <strong>
    ${weakest[0]}
  </strong>  <br>PYQ:
${weakest[1].pyq}%

`;

}

// =========================
// QUEST
// =========================

function generateQuest() {

const box =
document.getElementById(
"quest-list"
);

if (!box)
return;

box.innerHTML = `

□ Solve 25 PYQs

  <br>□ Revise 1 Chapter

  <br>□ Add Journal Entry

`;

}

// =========================
// INIT
// =========================

updateActivity();

updateCountdowns();

renderDropDay();

renderStreak();

renderPrepIndex();

renderStatusCounts();

renderFutureWidget();

renderMissionBoard();

generateQuest();

openPage(
"dashboard-page"
);

setTimeout(() => {

renderSubjectProgress?.();

renderLowestPYQList?.();

}, 200);