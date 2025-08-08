function setupStatisticsSheet(sheet) {
  // Title
  sheet.getRange('A1').setValue('📊 PLAYER STATISTICS & ANALYTICS').setFontSize(16).setFontWeight('bold');
  
  // Overall Rankings
  sheet.getRange('A3').setValue('🏆 OVERALL RANKINGS').setFontSize(14).setFontWeight('bold').setBackground('#E8F0FE');
  
  const rankingHeaders = ['Rank', 'Player', 'Total Points', 'Tournaments', 'Avg Points', 'Win Rate'];
  rankingHeaders.forEach((header, index) => {
    sheet.getRange(4, index + 1).setValue(header).setFontWeight('bold').setBackground('#F4F4F4');
  });
  
  // Player Progress Section
  sheet.getRange('A12').setValue('📈 PLAYER PROGRESS CHARTS').setFontSize(14).setFontWeight('bold').setBackground('#E8F0FE');
  
  // Tournament History
  sheet.getRange('A20').setValue('🏆 TOURNAMENT HISTORY').setFontSize(14).setFontWeight('bold').setBackground('#E8F0FE');
  
  const historyHeaders = ['Date', 'Tournament', 'Winner', 'Type', 'Participants'];
  historyHeaders.forEach((header, index) => {
    sheet.getRange(21, index + 1).setValue(header).setFontWeight('bold').setBackground('#F4F4F4');
  });
  
  // Format for mobile
  sheet.setColumnWidths(1, 6, 130);
  sheet.getRange('A:F').setVerticalAlignment('middle');
}

function createStatisticsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let statsSheet = ss.getSheetByName('Player_Statistics');
  if (!statsSheet) {
    statsSheet = ss.insertSheet('Player_Statistics');
  } else {
    statsSheet.clear();
  }

  setupStatisticsSheet(statsSheet);

  const allStats = calculateAllPlayerStats();

  let row = 5;
  const sorted = Object.entries(allStats).sort((a, b) => b[1].totalPoints - a[1].totalPoints);

  sorted.forEach(([player, stats], index) => {
    statsSheet.getRange(row, 1).setValue(index + 1);
    statsSheet.getRange(row, 2).setValue(player);
    statsSheet.getRange(row, 3).setValue(stats.totalPoints);
    statsSheet.getRange(row, 4).setValue(stats.tournaments);
    statsSheet.getRange(row, 5).setValue((stats.totalPoints / stats.tournaments).toFixed(2));
    statsSheet.getRange(row, 6).setValue(
      stats.matchesPlayed > 0
        ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(1) + "%"
        : "0%"
    );
    row++;
  });
}
