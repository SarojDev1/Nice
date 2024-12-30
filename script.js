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
// Ensure you have 12 rows in your data array
const data = [
    { rank: 1, teamName: "Team 1", alive: 4, points: 30, kills: 5 },
    { rank: 2, teamName: "Team 2", alive: 3, points: 60, kills: 6 },
    { rank: 3, teamName: "Team 3", alive: 2, points: 55, kills: 5 },
    { rank: 4, teamName: "Team 4", alive: 1, points: 40, kills: 4 },
    { rank: 5, teamName: "Team 5", alive: 0, points: 20, kills: 3 },
    { rank: 6, teamName: "Team 6", alive: 3, points: 50, kills: 4 },
    { rank: 7, teamName: "Team 7", alive: 4, points: 45, kills: 5 },
    { rank: 8, teamName: "Team 8", alive: 0, points: 10, kills: 1 },
    { rank: 9, teamName: "Team 9", alive: 2, points: 35, kills: 2 },
    { rank: 10, teamName: "Team 10", alive: 1, points: 25, kills: 3 },
    { rank: 11, teamName: "Team 11", alive: 4, points: 65, kills: 6 },
    { rank: 12, teamName: "Team 12", alive: 5, points: 5, kills: 9 },
];

// Generate the table rows dynamically
const tableBody = document.getElementById("scoreboard-body");
tableBody.innerHTML = ""; // Clear existing rows

data.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="rank">${row.rank}</td>
        <td class="team-name">${row.teamName}</td>
        <td class="alive"><div class="alive-line" style="width: ${row.alive * 20}px;"></div></td>
        <td class="points">${row.points}</td>
        <td class="kills">${row.kills}</td>
    `;
    tableBody.appendChild(tr);
});
// Example data fetched from the sheet or generated manually
const data = [
    { rank: 1, teamName: "Team 1", alive: 4, points: 30, kills: 5 },
    { rank: 2, teamName: "Team 2", alive: 3, points: 60, kills: 6 },
    { rank: 3, teamName: "Team 3", alive: 2, points: 55, kills: 5 },
    { rank: 4, teamName: "Team 4", alive: 1, points: 40, kills: 4 },
    { rank: 5, teamName: "Team 5", alive: 0, points: 20, kills: 3 }, // Wipeout
    { rank: 6, teamName: "Team 6", alive: 3, points: 50, kills: 4 },
    { rank: 7, teamName: "Team 7", alive: 4, points: 45, kills: 5 },
    { rank: 8, teamName: "Team 8", alive: 0, points: 10, kills: 1 }, // Wipeout
    { rank: 9, teamName: "Team 9", alive: 2, points: 35, kills: 2 },
    { rank: 10, teamName: "Team 10", alive: 1, points: 25, kills: 3 },
    { rank: 11, teamName: "Team 11", alive: 4, points: 65, kills: 6 },
    { rank: 12, teamName: "Team 12", alive: 0, points: 5, kills: 0 }, // Wipeout
];

// Generate and sort the table rows dynamically
function generateTable(data) {
    const tableBody = document.getElementById("scoreboard-body");
    tableBody.innerHTML = ""; // Clear existing rows

    // Separate wipeout teams (alive = 0) and other teams
    const wipeoutTeams = data.filter((team) => team.alive === 0);
    const activeTeams = data.filter((team) => team.alive > 0);

    // Combine active teams followed by wipeout teams
    const sortedData = [...activeTeams, ...wipeoutTeams];

    // Generate rows
    sortedData.forEach((row, index) => {
        const tr = document.createElement("tr");

        // Apply Wipeout style if alive = 0
        const aliveContent =
            row.alive === 0
                ? `<td class="alive wipeout" colspan="1">Wipeout</td>`
                : `<td class="alive"><div class="alive-line" style="width: ${row.alive * 20}px;"></div></td>`;

        // Create table row
        tr.innerHTML = `
            <td class="rank">${index + 1}</td>
            <td class="team-name">${row.teamName}</td>
            ${aliveContent}
            <td class="points">${row.points}</td>
            <td class="kills">${row.kills}</td>
        `;

        // Append to table
        tableBody.appendChild(tr);
    });
}

// Call the function to generate the table
generateTable(data);

