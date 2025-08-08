function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎾 Padel Tournament')
    .addItem('Create New Tournament', 'showTournamentDialog')
    .addItem('Add New Player', 'showPlayerDialog') // <-- new menu item
    .addItem('View Statistics', 'createStatisticsSheet')
    .addToUi();
}

function onInstall() {
  onOpen();
}