function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎾 Padel Tournament')
    .addItem('Create New Tournament', 'showTournamentDialog')
    .addItem('Add New Player', 'showPlayerDialog')
    .addItem('View Statistics', 'createStatisticsSheet')
    .addToUi();
}

function onInstall() {
  onOpen();
  ensurePlayersSheetExists();
}