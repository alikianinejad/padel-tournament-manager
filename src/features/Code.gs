function onOpen() {
  // eslint-disable-next-line no-undef
  ensurePlayersSheetExists();
  createUiMenu();
}

function onInstall() {
  onOpen();
}

function createUiMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎾 Padel Tournament')
    .addItem('Create New Tournament', 'showTournamentDialog')
    .addItem('Add New Player', 'showPlayerDialog')
    .addItem('View Statistics', 'createStatisticsSheet')
    .addToUi();
}
