// =========================
// FUTURE ME SYSTEM
// =========================

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-future-note-btn")?.addEventListener("click", createFutureNote);
  renderFutureNotes();
});

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
}

// =========================
// DELETE NOTE
// =========================
function deleteFutureNote(id) {
  appData.futureNotes = appData.futureNotes.filter(note => note.id !== id);
  saveData();
  renderFutureNotes();
}

// =========================
// EDIT NOTE
// =========================
function editFutureNote(id) {
  const note = appData.futureNotes.find(n => n.id === id);
  if (!note) return;

  note.title = prompt("Title", note.title) || note.title;
  note.message = prompt("Message", note.message) || note.message;

  saveData();
  renderFutureNotes();
}

// =========================
// RANDOM MOTIVATION
// =========================
function getRandomFutureNote() {
  if (appData.futureNotes.length === 0) return null;

  const index = Math.floor(Math.random() * appData.futureNotes.length);
  return appData.futureNotes[index];
}

// =========================
// DASHBOARD WIDGET
// =========================
function renderMotivationCard() {
  const target = document.getElementById("motivation-card");
  if (!target) return;

  const notes = appData.futureNotes.filter(n => !n.opened);
  const note = notes.length 
    ? notes[Math.floor(Math.random() * notes.length)] 
    : getRandomFutureNote();

  if (!note) {
    target.innerHTML = `No Future Notes Yet`;
    return;
  }

  target.innerHTML = `
    <strong>${note.title}</strong>
    <br><br>
    ${note.message}
  `;
}

// =========================
// NOTE LIST
// =========================
function renderFutureNotes() {
  const container = document.getElementById("future-note-list");
  if (!container) return;

  let html = "";
  const sorted = [...appData.futureNotes].sort((a, b) => b.id - a.id);

  sorted.forEach(note => {
    html += `
    <div class="future-card">
      <h3>${note.title}</h3>
      <small>
        ${note.createdDate}
        <br>
        ${note.opened ? "✅ Opened" : "🔒 Sealed"}
     </small>
      <p style="margin-top:10px;">${note.message}</p>
      <div class="action-row">
        <button onclick="markFutureNoteOpened(${note.id})">Open</button>
        <button onclick="editFutureNote(${note.id})">Edit</button>
        <button onclick="deleteFutureNote(${note.id})">Delete</button>
      </div>
    </div>
    `;
  });

  if (!html) {
    html = `<div class="card">No Future Notes Yet</div>`;
  }
  
  container.innerHTML = html; // Added missing DOM assignment
} // <--- FIXED: Closed the renderFutureNotes function properly here

// =========================
// MARK OPENED
// =========================
function markFutureNoteOpened(id) {
  const note = appData.futureNotes.find(n => n.id === id);
  if (!note) return;

  note.opened = true;
  saveData();
  renderFutureNotes();
}

// =========================
// GLOBAL SCOPE BINDINGS (Crucial for HTML onclicks)
// =========================
window.createFutureNote = createFutureNote;
window.editFutureNote = editFutureNote;
window.deleteFutureNote = deleteFutureNote;
window.markFutureNoteOpened = markFutureNoteOpened;
