// =========================
// CHAPTER SYSTEM
// =========================

let currentFilter = "all";

// =========================
// FILTER BUTTONS
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
// ADD CUSTOM CHAPTER
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

    custom: true

  };

  saveData();

  renderChapters();

  document.getElementById(
    "custom-chapter-name"
  ).value = "";

}

// =========================
// DELETE CUSTOM CHAPTER
// =========================

function deleteCustomChapter(
  chapter
) {

  if (
    !appData.chapters[
      chapter
    ]?.custom
  ) return;

  delete appData.chapters[
    chapter
  ];

  saveData();

  renderChapters();

}

// =========================
// STATUS CHANGE
// =========================

function updateStatus(
  chapter,
  value
) {

  appData.chapters[
    chapter
  ].status = value;

  saveData();

  renderStatusCounts();

  renderPrepIndex();

  renderLowestPYQList();

}

// =========================
// PYQ UPDATE
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

  renderLowestPYQList();

}

// =========================
// REVISION TRACKING
// =========================

function toggleRevision(
  chapter,
  round
) {

  const key =
    "revision" + round;

  appData.chapters[
    chapter
  ][key] =
    !appData.chapters[
      chapter
    ][key];

  saveData();

  renderChapters();

}

// =========================
// SEARCH + FILTER
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
  ) {
    return false;
  }

  if (
    currentFilter !==
      "all" &&
    data.status !==
      currentFilter
  ) {
    return false;
  }

  return true;

}

// =========================
// CHAPTER CARD
// =========================

function createChapterCard(
  chapterName,
  data
) {

  return `

  <div class="chapter-card ${data.status}">

    <div class="chapter-title">
      ${chapterName}
    </div>

    <select
      onchange="
      updateStatus(
      '${chapterName}',
      this.value
      )">

      <option
      ${
        data.status==="weak"
        ? "selected"
        : ""
      }>
      weak
      </option>

      <option
      ${
        data.status==="average"
        ? "selected"
        : ""
      }>
      average
      </option>

      <option
      ${
        data.status==="strong"
        ? "selected"
        : ""
      }>
      strong
      </option>

      <option
      ${
        data.status==="mastered"
        ? "selected"
        : ""
      }>
      mastered
      </option>

    </select>

    <div class="pyq-label">

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

    <div class="pyq-label">

      Revision Rounds

    </div>

    <div class="action-row">

      <button
      onclick="
      toggleRevision(
      '${chapterName}',
      1
      )">

      ${
        data.revision1
        ? "✅ R1"
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
        ? "✅ R2"
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
        ? "✅ R3"
        : "R3"
      }

      </button>

    </div>

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

  </div>

  `;

}

// =========================
// SUBJECT GROUPING
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
      margin-top:15px;
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
        ([_, data]) =>
          data.subject ===
          subject
      )

      .forEach(
        ([name, data]) => {

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