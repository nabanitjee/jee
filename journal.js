// =========================
// JOURNAL SYSTEM
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    document
      .getElementById(
        "add-journal-entry"
      )
      ?.addEventListener(
        "click",
        createJournalEntry
      );

    renderJournal();

  }
);

// =========================
// CREATE ENTRY
// =========================

function createJournalEntry() {

  const date =
    prompt(
      "Date (YYYY-MM-DD)"
    );

  if (!date) return;

  const hours =
    prompt(
      "Study Hours"
    ) || "0";

  const mood =
    prompt(
      "Mood (1-10)"
    ) || "5";

  const work =
    prompt(
      "Work Done"
    ) || "";

  const notes =
    prompt(
      "Notes"
    ) || "";

  appData.journal.push({

    id: Date.now(),

    date,

    hours,

    mood,

    work,

    notes

  });

  updateActivity();

  saveData();

  renderJournal();

}

// =========================
// DELETE ENTRY
// =========================

function deleteJournalEntry(
  id
) {

  appData.journal =
    appData.journal.filter(
      entry =>
        entry.id !== id
    );

  saveData();

  renderJournal();

}

// =========================
// EDIT ENTRY
// =========================

function editJournalEntry(
  id
) {

  const entry =
    appData.journal.find(
      e => e.id === id
    );

  if (!entry) return;

  const hours =
    prompt(
      "Study Hours",
      entry.hours
    );

  const mood =
    prompt(
      "Mood",
      entry.mood
    );

  const work =
    prompt(
      "Work Done",
      entry.work
    );

  const notes =
    prompt(
      "Notes",
      entry.notes
    );

  entry.hours = hours;
  entry.mood = mood;
  entry.work = work;
  entry.notes = notes;

  saveData();

  renderJournal();

}

// =========================
// SEARCH
// =========================

function filterJournal() {

  const q =
    document
      .getElementById(
        "journal-search"
      )
      ?.value
      .toLowerCase() || "";

  return appData.journal.filter(
    entry =>
      entry.date
        .toLowerCase()
        .includes(q)
  );

}

// =========================
// RENDER
// =========================

function renderJournal() {

  const container =
    document.getElementById(
      "journal-list"
    );

  if (!container)
    return;

  const entries =
    filterJournal();

  entries.sort(
    (a, b) =>
      b.id - a.id
  );

  let html = "";

  entries.forEach(
    entry => {

      html += `

      <div class="journal-card">

        <h3>
          ${entry.date}
        </h3>

        <p>
          ⏱ Hours:
          ${entry.hours}
        </p>

        <p>
          😊 Mood:
          ${entry.mood}/10
        </p>

        <p>
          📚 Work:
          ${entry.work}
        </p>

        <p>
          📝 Notes:
          ${entry.notes}
        </p>

        <div class="action-row">

          <button
          onclick="
          editJournalEntry(
          ${entry.id}
          )">

          Edit

          </button>

          <button
          onclick="
          deleteJournalEntry(
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
      No Journal Entries
    </div>
    `;

  }

  container.innerHTML =
    html;

}

// =========================
// TOTAL HOURS
// =========================

function getTotalStudyHours() {

  return appData.journal
    .reduce(
      (sum, entry) =>
        sum +
        Number(
          entry.hours || 0
        ),
      0
    );

}