function showPlayerDialog() {
  const html = HtmlService.createHtmlOutputFromFile('player_dialog')
    .setWidth(350)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Add New Player');
}