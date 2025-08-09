/* eslint-disable no-unused-vars */
function runTests() {
  // eslint-disable-next-line no-undef
  GSUnit.runSuite();
}

const schedule12Player3Court = [
  [
    [11, 0, 1, 10],
    [2, 9, 3, 8],
    [4, 7, 5, 6],
  ],
  [
    [11, 10, 0, 9],
    [1, 8, 2, 7],
    [3, 6, 4, 5],
  ],
  [
    [11, 9, 10, 8],
    [0, 7, 1, 6],
    [2, 5, 3, 4],
  ],
  [
    [11, 8, 9, 7],
    [10, 6, 0, 5],
    [1, 4, 2, 3],
  ],
  [
    [11, 7, 8, 6],
    [9, 5, 10, 4],
    [0, 3, 1, 2],
  ],
  [
    [11, 6, 7, 5],
    [8, 4, 9, 3],
    [10, 2, 0, 1],
  ],
  [
    [11, 5, 6, 4],
    [7, 3, 8, 2],
    [9, 1, 10, 0],
  ],
  [
    [11, 4, 5, 3],
    [6, 2, 7, 1],
    [8, 0, 9, 10],
  ],
  [
    [11, 3, 4, 2],
    [5, 1, 6, 0],
    [7, 10, 8, 9],
  ],
  [
    [11, 2, 3, 1],
    [4, 0, 5, 10],
    [6, 9, 7, 8],
  ],
  [
    [11, 1, 2, 0],
    [3, 10, 4, 9],
    [5, 8, 6, 7],
  ],
];

function testAmericanoSchedule12Players3Courts() {
  const result = examinateAmericanoSchedule(schedule12Player3Court);
  console.log(result);
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
        duplicates.push(
          `DUPLICATE: Team ${team1Key} appears in ${previousLocation} and Round ${roundIndex + 1}, Court ${courtIndex + 1}`
        );
      } else {
        partnerships.set(team1Key, `Round ${roundIndex + 1}, Court ${courtIndex + 1}`);
      }

      if (partnerships.has(team2Key)) {
        const previousLocation = partnerships.get(team2Key);
        duplicates.push(
          `DUPLICATE: Team ${team2Key} appears in ${previousLocation} and Round ${roundIndex + 1}, Court ${courtIndex + 1}`
        );
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
    duplicates.forEach((duplicate) => console.log(duplicate));
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
    duplicates: duplicates,
  };
}
