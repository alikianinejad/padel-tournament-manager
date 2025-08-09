function setupStatisticsSheet(sheet) {
  // Title
  sheet
    .getRange('A1')
    .setValue('📊 PLAYER STATISTICS & ANALYTICS')
    .setFontSize(16)
    .setFontWeight('bold');

  // Overall Rankings
  sheet
    .getRange('A3')
    .setValue('🏆 OVERALL RANKINGS')
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground('#E8F0FE');

  const rankingHeaders = [
    'Rank',
    'Player',
    'Total Points',
    'Tournaments',
    'Avg Points',
    'Win Rate',
  ];
  rankingHeaders.forEach((header, index) => {
    sheet
      .getRange(4, index + 1)
      .setValue(header)
      .setFontWeight('bold')
      .setBackground('#F4F4F4');
  });

  // Player Progress Section
  sheet
    .getRange('A12')
    .setValue('📈 PLAYER PROGRESS CHARTS')
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground('#E8F0FE');

  // Tournament History
  sheet
    .getRange('A20')
    .setValue('🏆 TOURNAMENT HISTORY')
    .setFontSize(14)
    .setFontWeight('bold')
    .setBackground('#E8F0FE');

  const historyHeaders = ['Date', 'Tournament', 'Winner', 'Type', 'Participants'];
  historyHeaders.forEach((header, index) => {
    sheet
      .getRange(21, index + 1)
      .setValue(header)
      .setFontWeight('bold')
      .setBackground('#F4F4F4');
  });

  // Format for mobile
  sheet.setColumnWidths(1, 6, 130);
  sheet.getRange('A:F').setVerticalAlignment('middle');
}

function extractPlayersFromTournamentSheet(data) {
  const row2 = data[1][0]; // "Players: ..."
  if (!row2) return [];
  const match = row2.match(/Players:\s*(.+)/);
  return match ? match[1].split(',').map((p) => p.trim()) : [];
}

function calculateAllPlayerStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tournamentSheets = ss.getSheets().filter((s) => s.getName().startsWith('Tournament_'));

  const playerTotals = {};

  tournamentSheets.forEach((sheet) => {
    const data = sheet.getDataRange().getValues();

    // Find leaderboard or player list from sheet
    const players = extractPlayersFromTournamentSheet(data);

    players.forEach((player) => {
      const stats = calculatePlayerStatsFromSheet(player, sheet);

      if (!playerTotals[player]) {
        playerTotals[player] = {
          totalPoints: 0,
          totalScores: 0,
          matchesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          tournaments: 0,
        };
      }

      // Add stats from this tournament
      playerTotals[player].totalPoints += stats.totalPoints;
      playerTotals[player].totalScores += stats.totalScores;
      playerTotals[player].matchesPlayed += stats.matchesPlayed;
      playerTotals[player].wins += stats.wins;
      playerTotals[player].draws += stats.draws;
      playerTotals[player].losses += stats.losses;
      playerTotals[player].goalsFor += stats.goalsFor;
      playerTotals[player].goalsAgainst += stats.goalsAgainst;
      playerTotals[player].tournaments += 1;
    });
  });

  return playerTotals;
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
    statsSheet
      .getRange(row, 6)
      .setValue(
        stats.matchesPlayed > 0 ? ((stats.wins / stats.matchesPlayed) * 100).toFixed(1) + '%' : '0%'
      );
    row++;
  });
}

function calculatePlayerStatsFromSheet(playerName, sheet) {
  const data = sheet.getDataRange().getValues();
  let stats = {
    totalPoints: 0,
    totalScores: 0,
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };

  for (let i = 0; i < data.length; i++) {
    const team1Text = data[i][1] ? data[i][1].toString() : '';
    const team2Text = data[i][3] ? data[i][3].toString() : '';

    if (!team1Text.includes('&') || !team2Text.includes('&')) continue;

    const playerInTeam1 = team1Text.includes(playerName);
    const playerInTeam2 = team2Text.includes(playerName);

    if (!playerInTeam1 && !playerInTeam2) continue;

    if (i + 1 >= data.length) continue;
    const scoreRow = data[i + 1];
    const score1 = parseInt(scoreRow[1]) || 0;
    const score2 = parseInt(scoreRow[3]) || 0;

    if (score1 === 0 && score2 === 0) continue;

    stats.matchesPlayed++;
    if (playerInTeam1) {
      stats.goalsFor += score1;
      stats.goalsAgainst += score2;
      stats.totalScores += score1;
      if (score1 > score2) {
        stats.wins++;
        stats.totalPoints += 3;
      } else if (score1 === score2) {
        stats.draws++;
        stats.totalPoints += 1;
      } else {
        stats.losses++;
      }
    } else {
      stats.goalsFor += score2;
      stats.goalsAgainst += score1;
      stats.totalScores += score2;
      if (score2 > score1) {
        stats.wins++;
        stats.totalPoints += 3;
      } else if (score1 === score2) {
        stats.draws++;
        stats.totalPoints += 1;
      } else {
        stats.losses++;
      }
    }
  }

  return stats;
}
