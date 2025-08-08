function showPlayerDialog() {
  const html = HtmlService.createHtmlOutputFromFile('dialogs/player_dialog')
    .setWidth(350)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Add New Player');
}

function ensurePlayersSheetExists() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = "Players";
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Optionally, add headers
    sheet.appendRow(["Name", "Ranking", "Contact"]);
  }
}

