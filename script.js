// Google Sheets API URL
const sheetId = '141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I';
const range = 'Sheet1!A2:E13'; // Range of cells to get
const apiKey = 'AIzaSyAhytWe5enZPUd0hiiIrAN8ZbhpO4nbcrs'; // Your API Key

const leaderboardUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

async function fetchScoreboardData() {
    try {
        const response = await fetch(leaderboardUrl);
        const data = await response.json();

        if (!data.values) {
            throw new Error("No data available");
        }

        const scoreboardBody = document.getElementById('scoreboard-body');
        scoreboardBody.innerHTML = ''; // Clear previous data

        data.values.slice(0, 11).forEach((row, index) => { // Only take the first 11 rows
            if (row.length < 5) return;

            const rowElement = document.createElement('tr');
            const alive = row[2]; // Alive value

            let aliveContent = '';
            if (alive == 4) {
                aliveContent = `<div class="alive-line" style="height: 4px;"></div>`;
            } else if (alive == 3) {
                aliveContent = `<div class="alive-line" style="height: 3px;"></div>`;
            } else if (alive == 2) {
                aliveContent = `<div class="alive-line" style="height: 2px;"></div>`;
            } else if (alive == 1) {
                aliveContent = `<div class="alive-line" style="height: 1px;"></div>`;
            } else if (alive == 0) {
                aliveContent = 'Wipeout';
            }

            rowElement.innerHTML = `
                <td>${index + 1}</td>
                <td>${row[1]}</td> <!-- Team Name -->
                <td>${aliveContent}</td> <!-- Alive (green line or wipeout) -->
                <td>${row[3]}</td> <!-- Points -->
                <td>${row[4]}</td> <!-- Kills -->
            `;
            scoreboardBody.appendChild(rowElement);
        });
    } catch (error) {
        console.error("Error fetching scoreboard data:", error);
        document.getElementById('error-message').style.display = 'block';
    }
}

// Fetch data when page loads
window.onload = fetchScoreboardData;
