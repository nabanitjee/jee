// =========================
// QUEST SYSTEM V1
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // Standard initialization safeguard
    if (!appData.dailyQuest) {
      appData.dailyQuest = {
        task1: "",
        task2: "",
        task3: "",
        done1: false,
        done2: false,
        done3: false
      };
      saveData();
    }

    renderQuest();
  }
);

// =========================
// EDIT QUEST
// =========================

function editQuest() {
  // Capture inputs safely so pressing "Cancel" doesn't wipe existing tasks
  const res1 = prompt("Task 1", appData.dailyQuest.task1);
  if (res1 !== null) appData.dailyQuest.task1 = res1 || "";

  const res2 = prompt("Task 2", appData.dailyQuest.task2);
  if (res2 !== null) appData.dailyQuest.task2 = res2 || "";

  const res3 = prompt("Task 3", appData.dailyQuest.task3);
  if (res3 !== null) appData.dailyQuest.task3 = res3 || "";

  // Reset completion states upon editing a new slate of tasks
  appData.dailyQuest.done1 = false;
  appData.dailyQuest.done2 = false;
  appData.dailyQuest.done3 = false;

  saveData();
  renderQuest();
}

// =========================
// TOGGLE DONE
// =========================

function toggleQuest(taskNo) {
  const key = "done" + taskNo;
  
  // Directly flip the targeted boolean state
  appData.dailyQuest[key] = !appData.dailyQuest[key];

  saveData();
  renderQuest();
}

// =========================
// RENDER
// =========================

function renderQuest() {
  const box = document.getElementById("quest-list");
  if (!box) return;

  box.innerHTML = `
    <div>
      <p onclick="toggleQuest(1)" style="cursor: pointer; user-select: none; margin: 8px 0;">
        ${appData.dailyQuest.done1 ? "✅" : "⬜"} 
        ${appData.dailyQuest.task1 || "No Task"}
      </p>

      <p onclick="toggleQuest(2)" style="cursor: pointer; user-select: none; margin: 8px 0;">
        ${appData.dailyQuest.done2 ? "✅" : "⬜"} 
        ${appData.dailyQuest.task2 || "No Task"}
      </p>

      <p onclick="toggleQuest(3)" style="cursor: pointer; user-select: none; margin: 8px 0;">
        ${appData.dailyQuest.done3 ? "✅" : "⬜"} 
        ${appData.dailyQuest.task3 || "No Task"}
      </p>

      <button onclick="editQuest()" style="margin-top: 10px;">
        Edit Quest
      </button>
    </div>
  `;
}

// =========================
// GLOBAL BINDINGS
// =========================
// Ensures absolute cross-file execution and HTML inline accessibility
window.editQuest = editQuest;
window.toggleQuest = toggleQuest;
window.renderQuest = renderQuest;
