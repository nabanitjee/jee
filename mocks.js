// =========================
// MOCK TEST SYSTEM
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    document
      .getElementById(
        "add-mock-btn"
      )
      ?.addEventListener(
        "click",
        createMock
      );

    renderMocks();

    renderLatestMock();

  }
);

// =========================
// CREATE MOCK
// =========================

function createMock() {

  const examName =
    prompt(
      "Exam Name"
    ) || "Mock";

  const maxMarks =
    prompt(
      "Maximum Marks"
    ) || 300;

  const physics =
    Number(
      prompt(
        "Physics Marks"
      ) || 0
    );

  const chemistry =
    Number(
      prompt(
        "Chemistry Marks"
      ) || 0
    );

  const maths =
    Number(
      prompt(
        "Maths Marks"
      ) || 0
    );

  const remarks =
    prompt(
      "Remarks"
    ) || "";

  const errorLog =
    prompt(
      "Major Mistakes"
    ) || "";

  const total =
    physics +
    chemistry +
    maths;

  appData.mocks.push({

    id: Date.now(),

    date:
      new Date()
      .toISOString()
      .split("T")[0],

    examName,

    maxMarks,

    physics,

    chemistry,

    maths,

    total,

    remarks,

    errorLog

  });

  updateActivity();

  saveData();

  renderMocks();

  renderLatestMock();

}

// =========================
// DELETE MOCK
// =========================

function deleteMock(
  id
) {

  appData.mocks =
    appData.mocks.filter(
      mock =>
        mock.id !== id
    );

  saveData();

  renderMocks();

  renderLatestMock();

}

// =========================
// EDIT MOCK
// =========================

function editMock(
  id
) {

  const mock =
    appData.mocks.find(
      m => m.id === id
    );

  if (!mock)
    return;

  mock.physics =
    Number(
      prompt(
        "Physics",
        mock.physics
      )
    );

  mock.chemistry =
    Number(
      prompt(
        "Chemistry",
        mock.chemistry
      )
    );

  mock.maths =
    Number(
      prompt(
        "Maths",
        mock.maths
      )
    );

  mock.maxMarks =
    Number(
      prompt(
        "Max Marks",
        mock.maxMarks
      )
    );

  mock.remarks =
    prompt(
      "Remarks",
      mock.remarks
    );

  mock.errorLog =
    prompt(
      "Error Log",
      mock.errorLog
    );

  mock.total =
    mock.physics +
    mock.chemistry +
    mock.maths;

  saveData();

  renderMocks();

  renderLatestMock();

}

// =========================
// LATEST MOCK CARD
// =========================

function renderLatestMock() {

  const box =
    document.getElementById(
      "latest-mock"
    );

  if (!box)
    return;

  if (
    appData.mocks.length === 0
  ) {

    box.innerHTML =
      "No mocks added yet.";

    return;

  }

  const latest =
    appData.mocks[
      appData.mocks.length - 1
    ];

  box.innerHTML = `

    <strong>
      ${latest.examName}
    </strong>

    <br>

    ${latest.total}
    /
    ${latest.maxMarks}

    <br>

    P:
    ${latest.physics}

    |
    C:
    ${latest.chemistry}

    |
    M:
    ${latest.maths}

  `;

}

// =========================
// MOCK LIST
// =========================

function renderMocks() {

  const container =
    document.getElementById(
      "mock-list"
    );

  if (!container)
    return;

  let html = "";

  const sorted =
    [...appData.mocks]
    .sort(
      (a,b)=>
        b.id-a.id
    );

  sorted.forEach(
    mock => {

      html += `

      <div class="mock-card">

        <h3>
          ${mock.examName}
        </h3>

        <p>
          📅 ${mock.date}
        </p>

        <p>
          🎯
          ${mock.total}
          /
          ${mock.maxMarks}
        </p>
        <p>📊
${Math.round(
(mock.total/mock.maxMarks)*100
)}%
         </p>

        <p>
          Physics:
          ${mock.physics}
        </p>

        <p>
          Chemistry:
          ${mock.chemistry}
        </p>

        <p>
          Maths:
          ${mock.maths}
        </p>

        <p>
          Remarks:
          ${mock.remarks}
        </p>

        <p>
          Error Log:
          ${mock.errorLog}
        </p>

        <div class="action-row">

          <button
          onclick="
          editMock(
          ${mock.id}
          )">

          Edit

          </button>

          <button
          onclick="
          deleteMock(
          ${mock.id}
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

      No Mock Tests Added

    </div>

    `;

  }

  container.innerHTML =
    html;

}

// =========================
// ANALYTICS HELPERS
// =========================

function getAverageMockScore() {

  if (
    appData.mocks.length === 0
  )
    return 0;

  const total =
    appData.mocks.reduce(
      (sum,m)=>
        sum+m.total,
      0
    );

  return Math.round(
    total /
    appData.mocks.length
  );

}

function getBestMockScore() {

  if (
    appData.mocks.length === 0
  )
    return 0;

  return Math.max(
    ...appData.mocks.map(
      m=>m.total
    )
  );

}

function getLatestMockTrend() {

if (
appData.mocks.length < 2
)
return "No Trend";

const latest =
appData.mocks[
appData.mocks.length - 1
];

const previous =
appData.mocks[
appData.mocks.length - 2
];

const diff =
latest.total -
previous.total;

if (diff > 0)
return `📈 +${diff}`;

if (diff < 0)
return `📉 ${diff}`;

return "➖ 0";

}