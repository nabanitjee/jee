// =========================
// BACKUP SYSTEM
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const exportBtn =
      document.getElementById(
        "export-btn"
      );

    const importBtn =
      document.getElementById(
        "import-btn"
      );

    if (exportBtn) {

      exportBtn.addEventListener(
        "click",
        exportBackup
      );

    }

    if (importBtn) {

      importBtn.addEventListener(
        "click",
        importBackup
      );

    }

  }
);

// =========================
// EXPORT
// =========================

function exportBackup() {

  try {

    const backup = {

      version: "JEE_OS_V2",

      exportDate:
        new Date()
        .toISOString(),

      data: appData

    };

    const blob =
      new Blob(
        [
          JSON.stringify(
            backup,
            null,
            2
          )
        ],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    const date =
      new Date()
      .toISOString()
      .split("T")[0];

    a.href = url;

    a.download =
      `jeeos-backup-${date}.json`;

    a.click();

    URL.revokeObjectURL(
      url
    );

    alert(
      "Backup exported successfully."
    );

  }

  catch (error) {

    console.error(error);

    alert(
      "Backup export failed."
    );

  }

}

// =========================
// IMPORT
// =========================

function importBackup() {

  const input =
    document.createElement(
      "input"
    );

  input.type = "file";

  input.accept =
    ".json";

  input.onchange =
    event => {

      const file =
        event.target.files[0];

      if (!file)
        return;

      const reader =
        new FileReader();

      reader.onload =
        e => {

          try {

            const parsed =
              JSON.parse(
                e.target.result
              );

            if (
              !parsed.data
            ) {

              alert(
                "Invalid backup file."
              );

              return;

            }

            const confirmImport =
              confirm(
                "Importing will overwrite current data. Continue?"
              );

            if (
              !confirmImport
            )
              return;

            appData =
              parsed.data;

            saveData();

            alert(
              "Backup imported successfully. Reloading..."
            );

            location.reload();

          }

          catch {

            alert(
              "Could not import backup."
            );

          }

        };

      reader.readAsText(
        file
      );

    };

  input.click();

}

// =========================
// AUTO BACKUP INFO
// =========================

function getBackupStats() {

  return {

    chapters:
      Object.keys(
        appData.chapters
      ).length,

    journal:
      appData.journal
      ?.length || 0,

    mocks:
      appData.mocks
      ?.length || 0,

    clat:
      appData.clat
      ?.length || 0,

    futureNotes:
      appData.futureNotes
      ?.length || 0

  };

}

// =========================
// STORAGE SIZE
// =========================

function getStorageUsage() {

  const data =
    JSON.stringify(
      appData
    );

  const bytes =
    new Blob(
      [data]
    ).size;

  const kb =
    (
      bytes / 1024
    ).toFixed(2);

  return kb;

}

// =========================
// DEBUG INFO
// =========================

function showBackupInfo() {

  console.log(
    "JEE OS Backup Info"
  );

  console.log(
    getBackupStats()
  );

  console.log(
    "Storage:",
    getStorageUsage(),
    "KB"
  );

}