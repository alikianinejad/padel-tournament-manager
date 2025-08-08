# padel-tournament-manager

A Google Sheets add-on for organizing, scheduling, and tracking Padel Americano tournaments with automated leaderboards and player management.

## Features

- Create tournaments for 4, 8, or 12 players (1–3 courts)
- Automated round-robin scheduling (Americano format)
- Leaderboard generation and score tracking
- Player management: add and store players in a dedicated sheet
- User-friendly dialogs for tournament and player creation

## Getting Started

### 1. Setup

1. Open your Google Spreadsheet.
2. Go to **Extensions > Apps Script**.
3. Copy all `.gs` files (e.g., `create_tournament.gs`, `players.gs`, etc.) into the Apps Script editor.
4. Add the HTML files (`tournament_dialog.html`, `player_dialog.html`) via **File > New > HTML file** and paste their contents.
5. Save the project.

### 2. Usage

- Reload your spreadsheet.
- A new menu **🎾 Padel Tournament** will appear.
- Use **Create New Tournament** to set up a tournament.
- Use **Add New Player** to add players to the `Players` sheet.

## File Structure

- `create_tournament.gs` – Tournament creation and scheduling logic
- `players.gs` – Player management functions
- `tournament_dialog.html` – Dialog for creating tournaments
- `player_dialog.html` – Dialog for adding new players

## Customization

- Edit the scheduling logic or UI dialogs as needed for your club or tournament format.

## License

MIT License
