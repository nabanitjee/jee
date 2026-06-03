// =========================
// SAFE INITIALIZATION
// =========================
window.appData = window.appData || {};
window.appData.futureNotes = window.appData.futureNotes || [];

// Fallback functions if they aren't defined elsewhere
window.saveData = window.saveData || function() {
  localStorage.setItem('futureNotes', JSON.stringify(window.appData.futureNotes));
};
window.updateActivity = window.updateActivity || function() {
  console.log("Activity updated");
};

// Load from localStorage if available
if (localStorage.getItem('futureNotes')) {
  window.appData.futureNotes = JSON.parse(localStorage.getItem('futureNotes'));
}

// =========================
// FUTURE ME SYSTEM
// =========================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("add-future-note-btn")?.addEventListener("click", createFutureNote);
  renderFutureNotes();
  renderMotivationCard(); // Also render motivation card on load
});

// =========================
// CREATE NOTE
// =========================
function createFutureNote() {
  const title = prompt("Title") || "Untitled";
  const message = prompt("Message");

  if (!message) return;

  window.appData.futureNotes.push({
    id: Date.now(),
    title,
    message,
    createdDate: new Date().toISOString().split("T")[0],
    targetDate: "",
    opened: false
  });

  window.updateActivity();
  window.saveData();
  renderFutureNotes();
}

// =========================
// DELETE NOTE
// =========================
function deleteFutureNote(id) {
  window.appData.futureNotes = window.appData.futureNotes.filter(note => note.id !== id);
  window.saveData();
  renderFutureNotes();
}

// =========================
// EDIT NOTE
// =========================
function editFutureNote(id) {
  const note = window.appData.futureNotes.find(n => n.id === id);
  if (!note) return;

  note.title = prompt("Title", note.title) || note.title;
  note.message = prompt("Message", note.message) || note.message;

  window.saveData();
  renderFutureNotes();
}

// =========================
// RANDOM MOTIVATION
// =========================
function getRandomFutureNote() {
  if (window.appData.futureNotes.length === 0) return null;
  const index = Math.floor(Math.random() * window.appData.futureNotes.length);
  return window.appData.futureNotes[index];
}

// =========================
// DASHBOARD WIDGET
// =========================
function renderMotivationCard() {
  const target = document.getElementById("motivation-card");
  if (!target) return;

  const notes = window.appData.futureNotes.filter(n => !n.opened);
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
  const sorted = [...window.appData.futureNotes].sort((a, b) => b.id - a.id);

  sorted.forEach(note => {
    html += `
    <div class="future-card" style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
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
  
  container.innerHTML = html;
}

// =========================
// MARK OPENED
// =========================
function markFutureNoteOpened(id) {
  const note = window.appData.futureNotes.find(n => n.id === id);
  if (!note) return;

  note.opened = true;
  window.saveData();
  renderFutureNotes();
}

// =========================
// GLOBAL SCOPE BINDINGS
// =========================
window.createFutureNote = createFutureNote;
window.editFutureNote = editFutureNote;
window.deleteFutureNote = deleteFutureNote;
window.markFutureNoteOpened = markFutureNoteOpened;
