// =========================
// FUTURE ME SYSTEM
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    document
      .getElementById("add-future-note-btn")
      ?.addEventListener("click", createFutureNote);

    renderFutureNotes();
    renderMotivationCard(); // Renders the dashboard widget on page load
  }
);

// =========================
// CREATE NOTE
// =========================

function createFutureNote() {
  const title = prompt("Title") || "Untitled";
  const message = prompt("Message");

  if (!message) return;

  appData.futureNotes.push({
    id: Date.now(),
    title,
    message,
    createdDate: new Date().toISOString().split("T")[0],
    targetDate: "",
    opened: false
  });

  updateActivity();
  saveData();
  renderFutureNotes();
  renderMotivationCard(); // Updates dashboard if a new unread note is added
}

// =========================
// DELETE NOTE
// =========================

function deleteFutureNote(id) {
  appData.futureNotes = appData.futureNotes.filter(
    note => note.id !== id
  );

  saveData();
  renderFutureNotes();
  renderMotivationCard(); // Updates dashboard in case the active note was deleted
}

// =========================
// EDIT NOTE
// =========================

function editFutureNote(id) {
  const note = appData.futureNotes.find(
    n => n.id === id
  );

  if (!note) return;

  note.title = prompt("Title", note.title) || note.title;
  note.message = prompt("Message", note.message) || note.message;

  saveData();
  renderFutureNotes();
  renderMotivationCard(); // Updates dashboard if the currently displayed note was edited
}

// =========================
// RANDOM MOTIVATION
// =========================

function getRandomFutureNote() {
  if (appData.futureNotes.length === 0) return null;

  const index = Math.floor(
    Math.random() * appData.futureNotes.length
  );

  return appData.futureNotes[index];
}

// =========================
// DASHBOARD WIDGET
// =========================

function renderMotivationCard() {
  const target = document.getElementById("motivation-card");

  if (!target) return;

  // Crucial Fix: Filter out notes that are already opened
  const notes = appData.futureNotes
