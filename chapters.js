// =========================
// CHAPTER SYSTEM V3
// =========================

let currentFilter = "all";

// =========================
// INIT
// =========================

document.addEventListener(
"DOMContentLoaded",
() => {

document
  .querySelectorAll(
    ".filter-btn"
  )
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        currentFilter =
          btn.dataset.filter;

        renderChapters();

      }
    );

  });

document
  .getElementById(
    "chapter-search"
  )
  ?.addEventListener(
    "input",
    renderChapters
  );

document
  .getElementById(
    "add-custom-chapter-btn"
  )
  ?.addEventListener(
    "click",
    addCustomChapter
  );

renderChapters();

}
);

// =========================
// CUSTOM CHAPTER
// =========================

function addCustomChapter() {

const name =
document
.getElementById(
"custom-chapter-name"
)
.value
.trim();

const subject =
document
.getElementById(
"custom-chapter-subject"
)
.value;

if (!name) return;

appData.chapters[name] = {

subject,

status: "weak",

pyq: 0,

revision1: false,
revision2: false,
revision3: false,

priority:
  "medium",

notes: "",

lastRevised:
  null,

custom: true

};

saveData();

renderChapters();

renderPrepIndex?.();

renderStatusCounts?.();

renderSubjectProgress?.();

}

// =========================
// DELETE
// =========================

function deleteCustomChapter(
chapter
) {

if (
!appData.chapters[
chapter
]?.custom
)
return;

delete appData.chapters[
chapter
];

saveData();

renderChapters();

renderPrepIndex?.();

}

// =========================
// STATUS
// =========================

function updateStatus(
chapter,
value
) {

appData.chapters[
chapter
].status =
value;

saveData();

renderPrepIndex?.();

renderStatusCounts?.();

renderSubjectProgress?.();

renderLowestPYQList?.();

renderMissionBoard?.();

}

// =========================
// PYQ
// =========================

function updatePYQ(
chapter,
value
) {

appData.chapters[
chapter
].pyq =
parseInt(value);

saveData();

const label =
document.getElementById(
`pyq-${slugify(chapter)}`
);

if (label) {

label.textContent =
  `PYQ Progress: ${value}%`;

}
renderSubjectProgress?.();

renderMissionBoard?.();

renderLowestPYQList?.();

renderPrepIndex?.();

}

// =========================
// PRIORITY
// =========================

function updatePriority(
chapter,
value
) {

appData.chapters[
chapter
].priority =
value;

saveData();

}

// =========================
// NOTES
// =========================

function updateNotes(
chapter
) {

const notes =
prompt(
"Chapter Notes",
appData.chapters[
chapter
].notes || ""
);

if (
notes === null
)
return;

appData.chapters[
chapter
].notes =
notes;

saveData();

}

// =========================
// REVISION
// =========================

function toggleRevision(
chapter,
round
) {

const key =
"revision" +
round;

appData.chapters[
chapter
][key] =
!appData.chapters[
chapter
][key];

appData.chapters[
chapter
].lastRevised =
new Date()
.toISOString()
.split("T")[0];

saveData();

renderChapters();

renderPrepIndex?.();

}

// =========================
// SCORE
// =========================

function getChapterScore(
chapter
) {

let statusScore = 0;

switch (
chapter.status
) {

case "weak":
statusScore = 25;
break;

case "average":
statusScore = 50;
break;

case "strong":
statusScore = 75;
break;

case "mastered":
statusScore = 100;
break;

}

const pyqScore =
chapter.pyq || 0;

const revisionScore =

(
(chapter.revision1 ? 1 : 0) +
(chapter.revision2 ? 1 : 0) +
(chapter.revision3 ? 1 : 0)

) / 3 * 100;

return Math.round(

statusScore * 0.4 +

pyqScore * 0.4 +

revisionScore * 0.2

);

}

// =========================
// FILTER
// =========================

function shouldShowChapter(
chapterName,
data
) {

const search =
document
.getElementById(
"chapter-search"
)
?.value
.toLowerCase() || "";

if (
search &&
!chapterName
.toLowerCase()
.includes(search)
)
return false;

if (
currentFilter !==
"all" &&
data.status !==
currentFilter
)
return false;

return true;

}

// =========================
// SLUG
// =========================

function slugify(text) {

return text
.replaceAll(
" ",
"-"
)
.replaceAll(
"&",
""
);

}

// =========================
// CARD
// =========================

function createChapterCard(
chapterName,
data
) {

const score =
getChapterScore(
data
);

return `

  <div class="chapter-card ${data.status}"><div class="chapter-title">

  ${chapterName}

</div>

<select
  onchange="
  updateStatus(
  '${chapterName}',
  this.value
  )">

  <option ${
    data.status==="weak"
    ?"selected":""
  }>
  weak
  </option>

  <option ${
    data.status==="average"
    ?"selected":""
  }>
  average
  </option>

  <option ${
    data.status==="strong"
    ?"selected":""
  }>
  strong
  </option>

  <option ${
    data.status==="mastered"
    ?"selected":""
  }>
  mastered
  </option>

</select>

<div
class="pyq-label"
id="pyq-${slugify(
  chapterName
)}">

  PYQ Progress:
  ${data.pyq}%

</div>

<input
  type="range"
  min="0"
  max="100"
  value="${data.pyq}"

  oninput="
  updatePYQ(
  '${chapterName}',
  this.value
  )
  "
>

<select
  onchange="
  updatePriority(
  '${chapterName}',
  this.value
  )">

  <option ${
    data.priority==="low"
    ?"selected":""
  }>
  low
  </option>

  <option ${
    data.priority==="medium"
    ?"selected":""
  }>
  medium
  </option>

  <option ${
    data.priority==="high"
    ?"selected":""
  }>
  high
  </option>

</select>

<div
class="pyq-label">

  Score:
  ${score}/100

</div>

<div
class="pyq-label">

  Last Revised:

  ${
    data.lastRevised
    || "Never"
  }

</div>

<div
class="action-row">

  <button
  onclick="
  toggleRevision(
  '${chapterName}',
  1
  )">

  ${
    data.revision1
    ? "✅R1"
    : "R1"
  }

  </button>

  <button
  onclick="
  toggleRevision(
  '${chapterName}',
  2
  )">

  ${
    data.revision2
    ? "✅R2"
    : "R2"
  }

  </button>

  <button
  onclick="
  toggleRevision(
  '${chapterName}',
  3
  )">

  ${
    data.revision3
    ? "✅R3"
    : "R3"
  }

  </button>

</div>

<button
onclick="
updateNotes(
'${chapterName}'
)">

Notes

</button>

${
  data.custom
  ? `
  <button
  onclick="
  deleteCustomChapter(
  '${chapterName}'
  )">

  Delete

  </button>
  `
  : ""
}

  </div>`;

}

// =========================
// RENDER
// =========================

function renderChapters() {

const container =
document.getElementById(
"chapter-grid"
);

if (!container)
return;

let html = "";

const subjects = [
"Physics",
"Chemistry",
"Mathematics"
];

subjects.forEach(
subject => {

  html += `

  <div
  style="
  grid-column:1/-1;
  margin-top:12px;
  ">

  <h2>
  ${subject}
  </h2>

  </div>

  `;

  Object.entries(
    appData.chapters
  )

  .filter(
    ([_,data]) =>
      data.subject ===
      subject
  )

  .forEach(
    ([name,data]) => {

      if (
        shouldShowChapter(
          name,
          data
        )
      ) {

        html +=
          createChapterCard(
            name,
            data
          );

      }

    }
  );

}

);

container.innerHTML =
html;

}