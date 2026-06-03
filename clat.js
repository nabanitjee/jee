// =========================
// CLAT TRACKER SYSTEM
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    document
      .getElementById(
        "add-clat-btn"
      )
      ?.addEventListener(
        "click",
        createClatEntry
      );

    renderClat();

    renderWeeklyClat();

  }
);

// =========================
// CREATE ENTRY
// =========================

function createClatEntry() {

  const english =
    Number(
      prompt(
        "English Hours"
      ) || 0
    );

  const legal =
    Number(
      prompt(
        "Legal Reasoning Hours"
      ) || 0
    );

  const gk =
    Number(
      prompt(
        "GK Hours"
      ) || 0
    );

  const logical =
    Number(
      prompt(
        "Logical Reasoning Hours"
      ) || 0
    );

  const qt =
    Number(
      prompt(
        "Quantitative Techniques Hours"
      ) || 0
    );

  const total =
    english +
    legal +
    gk +
    logical +
    qt;

  appData.clat.push({

    id: Date.now(),

    date:
      new Date()
      .toISOString()
      .split("T")[0],

    english,

    legal,

    gk,

    logical,

    qt,

    total

  });

  updateActivity();

  saveData();

  renderClat();

  renderWeeklyClat();

}

// =========================
// DELETE
// =========================

function deleteClat(
  id
) {

  appData.clat =
    appData.clat.filter(
      entry =>
        entry.id !== id
    );

  saveData();

  renderClat();

  renderWeeklyClat();

}

// =========================
// EDIT
// =========================

function editClat(
  id
) {

  const entry =
    appData.clat.find(
      e => e.id === id
    );

  if (!entry)
    return;

  entry.english =
    Number(
      prompt(
        "English",
        entry.english
      )
    );

  entry.legal =
    Number(
      prompt(
        "Legal",
        entry.legal
      )
    );

  entry.gk =
    Number(
      prompt(
        "GK",
        entry.gk
      )
    );

  entry.logical =
    Number(
      prompt(
        "Logical",
        entry.logical
      )
    );

  entry.qt =
    Number(
      prompt(
        "QT",
        entry.qt
      )
    );

  entry.total =
    entry.english +
    entry.legal +
    entry.gk +
    entry.logical +
    entry.qt;

  saveData();

  renderClat();

  renderWeeklyClat();

}

// =========================
// WEEKLY HOURS
// =========================

function getWeeklyClatHours() {

  const today =
    new Date();

  const weekAgo =
    new Date();

  weekAgo.setDate(
    today.getDate() - 7
  );

  return appData.clat

    .filter(entry => {

      const d =
        new Date(
          entry.date
        );

      return d >= weekAgo;

    })

    .reduce(
      (sum, entry) =>
        sum + entry.total,
      0
    );

}

// =========================
// MONTHLY HOURS
// =========================

function getMonthlyClatHours() {

  const today =
    new Date();

  const month =
    today.getMonth();

  const year =
    today.getFullYear();

  return appData.clat

    .filter(entry => {

      const d =
        new Date(
          entry.date
        );

      return (
        d.getMonth() ===
          month &&
        d.getFullYear() ===
          year
      );

    })

    .reduce(
      (sum, entry) =>
        sum + entry.total,
      0
    );

}

// =========================
// DASHBOARD CARD
// =========================

function renderWeeklyClat() {

  const box =
    document.getElementById(
      "clat-week-hours"
    );

  if (!box)
    return;

  const weekly =
    getWeeklyClatHours();

  const monthly =
    getMonthlyClatHours();

  box.innerHTML = `

    <strong>
      ${weekly.toFixed(1)}
      Hours
    </strong>

    <br>

    This Week

    <br><br>

    ${monthly.toFixed(1)}
    Hours This Month

  `;

}

// =========================
// LIST
// =========================

function renderClat() {

  const container =
    document.getElementById(
      "clat-list"
    );

  if (!container)
    return;

  let html = "";

  const sorted =
    [...appData.clat]
    .sort(
      (a,b)=>
        b.id-a.id
    );

  sorted.forEach(
    entry => {

      html += `

      <div class="clat-card">

        <h3>
          ${entry.date}
        </h3>

        <p>
          English:
          ${entry.english}h
        </p>

        <p>
          Legal:
          ${entry.legal}h
        </p>

        <p>
          GK:
          ${entry.gk}h
        </p>

        <p>
          Logical:
          ${entry.logical}h
        </p>

        <p>
          QT:
          ${entry.qt}h
        </p>

        <p>
          Total:
          ${entry.total}h
        </p>

        <div class="action-row">

          <button
          onclick="
          editClat(
          ${entry.id}
          )">

          Edit

          </button>

          <button
          onclick="
          deleteClat(
          ${entry.id}
          )">

          Delete

          </button>

        </div>

      </div>

      `;

    }
  );

  if (!html) {

    html = `

    <div class="card">

      No CLAT Entries Yet

    </div>

    `;

  }

  container.innerHTML =
    html;

}
function getBestClatDay() {

if (
appData.clat.length === 0
)
return null;

return appData.clat.reduce(
(best,current)=>

current.total >
best.total

? current

: best

);

}