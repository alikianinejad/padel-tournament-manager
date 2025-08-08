function showTournamentDialog() {
  const html = HtmlService.createHtmlOutputFromFile('dialogs/tournament_dialog')
    .setWidth(400)
    .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(html, 'Create Padel Tournament');
}

const schedule12Player3Court = [
  [[11, 0, 1, 10], [2, 9, 3, 8], [4, 7, 5, 6]],
  [[11, 10, 0, 9], [1, 8, 2, 7], [3, 6, 4, 5]],
  [[11, 9, 10, 8], [0, 7, 1, 6], [2, 5, 3, 4]],
  [[11, 8, 9, 7], [10, 6, 0, 5], [1, 4, 2, 3]],
  [[11, 7, 8, 6], [9, 5, 10, 4], [0, 3, 1, 2]],
  [[11, 6, 7, 5], [8, 4, 9, 3], [10, 2, 0, 1]],
  [[11, 5, 6, 4], [7, 3, 8, 2], [9, 1, 10, 0]],
  [[11, 4, 5, 3], [6, 2, 7, 1], [8, 0, 9, 10]],
  [[11, 3, 4, 2], [5, 1, 6, 0], [7, 10, 8, 9]],
  [[11, 2, 3, 1], [4, 0, 5, 10], [6, 9, 7, 8]],
  [[11, 1, 2, 0], [3, 10, 4, 9], [5, 8, 6, 7]]
];

function createTournament(players, tournamentType) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date().toISOString().slice(0, 10);
  const sheetName = `Tournament_${timestamp}_${tournamentType}`;
  
  // Create new sheet
  const sheet = ss.insertSheet(sheetName);
  
  // Set up tournament based on type
  let courts, rounds;
  switch(tournamentType) {
    case '4players':
      courts = 1;
      rounds = generateRounds4Players(players);
      break;
    case '8players':
      courts = 2;
      rounds = generateRounds8Players(players);
      break;
    case '12players':
      courts = 3;
      rounds = generateRounds12Players(players);
      break;
  }
  
  setupTournamentSheet(sheet, players, rounds, courts);
  createLeaderboard(sheet, players, rounds.length);
  
  return sheetName;
}

function generateRounds4Players(players) {
  // For 4 players, each player plays with every other player once
  const rounds = [
    [{players: [players[0], players[1]], vs: [players[2], players[3]]}]
  ];
  
  // Generate all possible combinations
  const combinations = [
    [{players: [players[0], players[2]], vs: [players[1], players[3]]}],
    [{players: [players[0], players[3]], vs: [players[1], players[2]]}]
  ];
  
  rounds.push(...combinations);
  return rounds;
}

function generateRounds8Players(players) {
  const rounds = [];
  const totalRounds = 7; // Standard for 8 players
  
  // Americano algorithm for 8 players, 2 courts
  const schedule = [
    [[0,1,2,3], [4,5,6,7]],
    [[0,4,1,5], [2,6,3,7]],
    [[0,6,4,2], [1,7,5,3]],
    [[0,7,6,1], [4,3,2,5]],
    [[0,3,7,4], [6,5,1,2]],
    [[0,5,3,6], [7,2,4,1]],
    [[0,2,5,7], [3,1,6,4]]
  ];
  
  schedule.forEach(round => {
    const roundMatches = round.map(court => ({
      players: [players[court[0]], players[court[1]]],
      vs: [players[court[2]], players[court[3]]]
    }));
    rounds.push(roundMatches);
  });
  
  return rounds;
}

function generateRounds12Players(players) {
  const rounds = [];
  
  const schedule = schedule12Player3Court
  schedule.forEach(round => {
    const roundMatches = round.map(court => ({
      players: [players[court[0]], players[court[1]]],
      vs: [players[court[2]], players[court[3]]]
    }));
    rounds.push(roundMatches);
  });
  
  return rounds;
}

function testAmericanoSchedule12Playes3Counrt(){
  const result = examinateAmericanoSchedule(schedule12Player3Court)
  console.log(result)
}

function examinateAmericanoSchedule(schedule) {
  // Fixed Americano algorithm for 12 players, 3 courts
  
  // Validate the schedule
  const partnerships = new Map();
  const duplicates = [];
  
  for (let roundIndex = 0; roundIndex < schedule.length; roundIndex++) {
    const round = schedule[roundIndex];
    
    for (let courtIndex = 0; courtIndex < round.length; courtIndex++) {
      const match = round[courtIndex];
      
      // Check team 1 (players 0,1 of match)
      const team1Key = [match[0], match[1]].sort().join('-');
      // Check team 2 (players 2,3 of match) 
      const team2Key = [match[2], match[3]].sort().join('-');
      
      // Check for duplicates
      if (partnerships.has(team1Key)) {
        const previousLocation = partnerships.get(team1Key);
        duplicates.push(`DUPLICATE: Team ${team1Key} appears in ${previousLocation} and Round ${roundIndex + 1}, Court ${courtIndex + 1}`);
      } else {
        partnerships.set(team1Key, `Round ${roundIndex + 1}, Court ${courtIndex + 1}`);
      }
      
      if (partnerships.has(team2Key)) {
        const previousLocation = partnerships.get(team2Key);
        duplicates.push(`DUPLICATE: Team ${team2Key} appears in ${previousLocation} and Round ${roundIndex + 1}, Court ${courtIndex + 1}`);
      } else {
        partnerships.set(team2Key, `Round ${roundIndex + 1}, Court ${courtIndex + 1}`);
      }
    }
  }
  
  // Log results
  console.log('=== AMERICANO SCHEDULE VALIDATION ===');
  console.log(`Total unique partnerships found: ${partnerships.size}`);
  console.log(`Expected partnerships for 12 players: 66`); // C(12,2) = 66
  console.log('');
  
  if (duplicates.length > 0) {
    console.log('❌ DUPLICATE PARTNERSHIPS FOUND:');
    duplicates.forEach(duplicate => console.log(duplicate));
  } else {
    console.log('✅ SUCCESS: All partnerships are unique!');
  }
  
  console.log('');
  console.log('=== DETAILED SCHEDULE ===');
  
  // Display schedule
  for (let i = 0; i < schedule.length; i++) {
    console.log(`Round ${i + 1}:`);
    for (let j = 0; j < schedule[i].length; j++) {
      const match = schedule[i][j];
      console.log(`  Court ${j + 1}: Players ${match[0]},${match[1]} vs ${match[2]},${match[3]}`);
    }
    console.log('');
  }
  
  // Return summary
  return {
    isValid: duplicates.length === 0,
    totalPartnerships: partnerships.size,
    expectedPartnerships: 66,
    duplicatesFound: duplicates.length,
    duplicates: duplicates
  };
}

function calculateRecommendedScore(totalRounds) {
  
  // Reference round count and score for 8 players, 2 courts
  const referenceRounds = 7;
  const referenceScore = 40;

  // Scaling score for fairness based on the number of rounds
  const recommendedScore = (referenceRounds / totalRounds) * referenceScore;

  return Number(recommendedScore.toFixed(2));
}


function setupTournamentSheet(sheet, players, rounds, courts) {
  // Set up header
  sheet.getRange('A1').setValue('🎾 PADEL AMERICANO TOURNAMENT').setFontSize(16).setFontWeight('bold');
  sheet.getRange('A2').setValue(`Players: ${players.join(', ')}`);
  sheet.getRange('A3').setValue(`Courts: ${courts} | Rounds: ${rounds.length}`);
  sheet.getRange('A4').setValue(`Score per round: ${calculateRecommendedScore(rounds.length)}`);
  let currentRow = 5;
  
  // Create rounds
  rounds.forEach((round, roundIndex) => {
    sheet.getRange(currentRow, 1).setValue(`ROUND ${roundIndex + 1}`).setFontWeight('bold').setBackground('#E8F0FE');
    sheet.getRange(currentRow, 1, 1, 5).merge().setHorizontalAlignment('center');
    currentRow++;
    
    round.forEach((match, courtIndex) => {
      const courtRow = currentRow;
      
      // Court label
      sheet.getRange(courtRow, 1).setValue(`Court ${courtIndex + 1}:`).setFontWeight('bold');
      
      // Team 1 vs Team 2 format
      sheet.getRange(courtRow, 2).setValue(`${match.players[0]} & ${match.players[1]}`).setHorizontalAlignment('left');
      sheet.getRange(courtRow, 3).setValue('|');
      sheet.getRange(courtRow, 4).setValue(`${match.vs[0]} & ${match.vs[1]}`).setHorizontalAlignment('right');
      
      currentRow++;
      
      // Score row
      sheet.getRange(currentRow, 2).setValue('0').setHorizontalAlignment('center').setBackground('#F0F8FF');
      sheet.getRange(currentRow, 3).setValue('|').setHorizontalAlignment('center');
      sheet.getRange(currentRow, 4).setValue('0').setHorizontalAlignment('center').setBackground('#F0F8FF');
      
      // Add borders for better visual separation
      sheet.getRange(courtRow, 1, 2, 4).setBorder(true, true, true, true, true, true);
      
      currentRow += 2; // Space between matches
    });
    
    currentRow++; // Extra space between rounds
  });
  
  // Format the sheet for mobile
  sheet.setColumnWidth(1, 80);  // Court label
  sheet.setColumnWidth(2, 150); // Team 1 / Score 1
  sheet.setColumnWidth(3, 30);  // Separator |
  sheet.setColumnWidth(4, 150); // Team 2 / Score 2
  
  // Set text alignment and formatting
  sheet.getRange('A:D').setVerticalAlignment('middle');
  sheet.getRange('C:C').setHorizontalAlignment('center');
  
  return currentRow;
}

function createLeaderboard(sheet, players, totalRounds) {
  const startRow = sheet.getLastRow() + 3;
  
  // Leaderboard header
  sheet.getRange(startRow, 1).setValue('🏆 LEADERBOARD').setFontSize(14).setFontWeight('bold').setBackground('#FFF2CC');
  
  const headerRow = startRow + 1;
  const headers = ['Pos', 'Player', 'Scores', 'Points', 'Matches', 'Win %'];
  headers.forEach((header, index) => {
    sheet.getRange(headerRow, index + 1).setValue(header).setFontWeight('bold').setBackground('#F4F4F4');
  });
  
  // Player rows
  players.forEach((player, index) => {
    const playerRow = headerRow + index + 1;
    sheet.getRange(playerRow, 1).setValue(index + 1); // Position
    sheet.getRange(playerRow, 2).setValue(player);
    sheet.getRange(playerRow, 3).setFormula(0);
    sheet.getRange(playerRow, 4).setValue(totalRounds);
    sheet.getRange(playerRow, 5).setFormula(`=IF(D${playerRow}>0,C${playerRow}/D${playerRow}*100,0)&"%"`);
  });
  
  // Add sorting button (simulate with note)
  sheet.getRange(startRow, 6).setValue('🔄 Sort').setNote('Tap to sort by points');
}

function calculatePlayerStats(playerName) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  let stats = {
    totalPoints: 0,
    totalScores: 0,
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0
  };
  
  // Scan through all rows to find matches
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Skip empty rows and header rows
    if (!row[1] || typeof row[1] !== 'string') continue;
    
    const team1Text = row[1] ? row[1].toString() : '';
    const team2Text = row[3] ? row[3].toString() : '';
    
    // Skip if not a team row
    if (!team1Text.includes('&') || !team2Text.includes('&')) continue;
    
    let playerInTeam1 = team1Text.startsWith(playerName + " &") || team1Text.endsWith("& " + playerName);
    let playerInTeam2 = team2Text.startsWith(playerName + " &") || team2Text.endsWith("& " + playerName);
    
    if (!playerInTeam1 && !playerInTeam2) continue;

    // Look for the score row (next row)
    if (i + 1 >= data.length) continue;
    const scoreRow = data[i + 1];
    const score1 = parseInt(scoreRow[1]) || 0;
    const score2 = parseInt(scoreRow[3]) || 0;
    
    // Skip if no score entered yet
    if (score1 === 0 && score2 === 0) continue;
    
    stats.matchesPlayed++;
    
    if (playerInTeam1) {
      // Player is in team 1
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
    } else if (playerInTeam2) {
      // Player is in team 2
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

function calculatePlayerScore(playerName) {
  return calculatePlayerStats(playerName).totalScores
}

function updateLeaderboard() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Find leaderboard section
  let leaderboardStart = -1;
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().includes('LEADERBOARD')) {
      leaderboardStart = i + 2; // Skip header row
      break;
    }
  }
  
  if (leaderboardStart === -1) return; // No leaderboard found
  
  // Get all players from leaderboard
  const players = [];
  for (let i = leaderboardStart; i < data.length; i++) {
    if (data[i][1] && data[i][1] !== 'Player') { // Skip header
      const playerName = data[i][1].toString();
      if (playerName) {
        const stats = calculatePlayerStats(playerName);
        players.push({
          name: playerName,
          points: stats.totalPoints,
          scores: stats.totalScores,
          matches: stats.matchesPlayed,
          wins: stats.wins,
          draws: stats.draws,
          losses: stats.losses,
          winRate: stats.matchesPlayed > 0 ? (stats.wins / stats.matchesPlayed * 100).toFixed(1) : 0,
          goalDiff: stats.goalsFor - stats.goalsAgainst
        });
      }
    }
  }
  
  // Sort players by points (descending), then by goal difference
  players.sort((a, b) => {
    return b.scores - a.scores
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDiff - a.goalDiff;
  });
  
  // Update leaderboard with sorted data
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const rowIndex = leaderboardStart + i + 1; // +1 for 1-based indexing
    
    sheet.getRange(rowIndex, 1).setValue(i + 1); // Position
    sheet.getRange(rowIndex, 2).setValue(player.name);
    sheet.getRange(rowIndex, 3).setValue(player.scores);
    sheet.getRange(rowIndex, 4).setValue(player.points);
    sheet.getRange(rowIndex, 5).setValue(player.matches);
    sheet.getRange(rowIndex, 6).setValue(player.winRate + '%');
    
    // Add color coding for positions
    if (i === 0) {
      sheet.getRange(rowIndex, 1, 1, 5).setBackground('#FFD700'); // Gold for 1st
    } else if (i === 1) {
      sheet.getRange(rowIndex, 1, 1, 5).setBackground('#C0C0C0'); // Silver for 2nd
    } else if (i === 2) {
      sheet.getRange(rowIndex, 1, 1, 5).setBackground('#CD7F32'); // Bronze for 3rd
    }
  }
}

// Function to automatically update leaderboard when scores change
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Check if the edit was in a score position (columns 2 or 4, and it's a number)
  if ((range.getColumn() === 2 || range.getColumn() === 4)) {
    const editedValue = range.getValue();
    // Check if it's a number (score) and not text (team names)
    if (typeof editedValue === 'number' || (!isNaN(editedValue) && editedValue !== '')) {
      // Delay update to allow for both scores to be entered
      Utilities.sleep(1000);
      updateLeaderboard();
    }
  }
}

// Manual function to recalculate all points
function recalculateAllPoints() {
  updateLeaderboard();
  SpreadsheetApp.getUi().alert('Leaderboard updated successfully!');
}

// Utility functions for mobile optimization
function optimizeForMobile() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  sheets.forEach(sheet => {
    if (sheet.getName().startsWith('Tournament_')) {
      // Set optimal column widths for mobile
      sheet.setColumnWidth(1, 80);  // Court/Round
      sheet.setColumnWidth(2, 120); // Team 1
      sheet.setColumnWidth(3, 30);  // VS
      sheet.setColumnWidth(4, 120); // Team 2
      sheet.setColumnWidth(5, 50);  // Score label
      sheet.setColumnWidth(6, 40);  // Score 1
      sheet.setColumnWidth(7, 20);  // Dash
      sheet.setColumnWidth(8, 40);  // Score 2
      
      // Freeze header rows
      sheet.setFrozenRows(3);
      
      // Set text wrapping
      sheet.getRange('A:H').setWrap(true);
    }
  });
}

function calculateAllPlayerStats() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tournamentSheets = ss.getSheets().filter(s => s.getName().startsWith("Tournament_"));

  const playerTotals = {};

  tournamentSheets.forEach(sheet => {
    const data = sheet.getDataRange().getValues();

    // Find leaderboard or player list from sheet
    const players = extractPlayersFromTournamentSheet(data);

    players.forEach(player => {
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
          tournaments: 0
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
    goalsAgainst: 0
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
      if (score1 > score2) { stats.wins++; stats.totalPoints += 3; }
      else if (score1 === score2) { stats.draws++; stats.totalPoints += 1; }
      else { stats.losses++; }
    } else {
      stats.goalsFor += score2;
      stats.goalsAgainst += score1;
      stats.totalScores += score2;
      if (score2 > score1) { stats.wins++; stats.totalPoints += 3; }
      else if (score1 === score2) { stats.draws++; stats.totalPoints += 1; }
      else { stats.losses++; }
    }
  }

  return stats;
}

function extractPlayersFromTournamentSheet(data) {
  const row2 = data[1][0]; // "Players: ..."
  if (!row2) return [];
  const match = row2.match(/Players:\s*(.+)/);
  return match ? match[1].split(',').map(p => p.trim()) : [];
}

