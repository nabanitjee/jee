// =========================
// QUEST SYSTEM V1
// =========================

document.addEventListener(
"DOMContentLoaded",
() => {

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

appData.dailyQuest.task1 =
prompt(
"Task 1",
appData.dailyQuest.task1
) || "";

appData.dailyQuest.task2 =
prompt(
"Task 2",
appData.dailyQuest.task2
) || "";

appData.dailyQuest.task3 =
prompt(
"Task 3",
appData.dailyQuest.task3
) || "";

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

const key =
"done" + taskNo;

appData.dailyQuest[key] =
!appData.dailyQuest[key];

saveData();

renderQuest();

}

// =========================
// RENDER
// =========================

function renderQuest() {

const box =
document.getElementById(
"quest-list"
);

if (!box) return;

box.innerHTML = `

  <div><p onclick="toggleQuest(1)">

  ${
    appData.dailyQuest.done1
    ? "✅"
    : "⬜"
  }

  ${
    appData.dailyQuest.task1
    || "No Task"
  }

</p>

<p onclick="toggleQuest(2)">

  ${
    appData.dailyQuest.done2
    ? "✅"
    : "⬜"
  }

  ${
    appData.dailyQuest.task2
    || "No Task"
  }

</p>

<p onclick="toggleQuest(3)">

  ${
    appData.dailyQuest.done3
    ? "✅"
    : "⬜"
  }

  ${
    appData.dailyQuest.task3
    || "No Task"
  }

</p>

<button
onclick="editQuest()">

  Edit Quest

</button>

  </div>`;

}

// =========================
// GLOBAL
// =========================

window.editQuest =
editQuest;

window.toggleQuest =
toggleQuest;