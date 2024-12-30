// Google Sheets API URL
const sheetId = '141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I'; // Your sheet ID
const range = 'Sheet1!A1:E13'; // The range to fetch (adjust as needed)
const apiKey = 'AIzaSyAhytWe5enZPUd0hiiIrAN8ZbhpO4nbcrs'; // Your API Key

const leaderboardUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

// Simulated teams data (could be updated with real-time data from Google Sheets)
const teams = [
  { rank: 1, team: "Team 1", abbreviation: "LHX", alive: 4, points: 0, kills: 0 },
  { rank: 2, team: "Team 2", abbreviation: "SPE", alive: 2, points: 0, kills: 0 },
  { rank: 3, team: "Team 3", abbreviation: "OLM", alive: 1, points: 0, kills: 0 },
  { rank: 4, team: "Team 4", abbreviation: "THE", alive: 1, points: 0, kills: 0 },
  { rank: 5, team: "Team 5", abbreviation: "HORAA", alive: 0, points: 0, kills: 0 },
  { rank: 6, team: "Team 6", abbreviation: "DRS", alive: 0, points: 0, kills: 0 },
  { rank: 7, team: "Team 7", abbreviation: "HK", alive: 0, points: 0, kills: 0 },
  { rank: 8, team: "Team 8", abbreviation: "HNE", alive: 0, points: 0, kills: 0 },
  { rank: 9, team: "Team 9", abbreviation: "RD", alive: 0, points: 0, kills: 0 },
  { rank: 10, team: "Team 10", abbreviation: "AST", alive: 0, points: 0, kills: 0 },
  { rank: 11, team: "Team 11", abbreviation: "DTD", alive: 0, points: 0, kills: 0 },
  { rank: 12, team: "Team 12", abbreviation: "CMFes", alive: 0, points: 0, kills: 0 },
  { rank: 13, team: "Team 13", abbreviation: "SOLTI", alive: 0, points: 0, kills: 0 },
  { rank: 14, team: "Team 14", abbreviation: "RG", alive: 0, points: 0, kills: 0 },
  { rank: 15, team: "Team 15", abbreviation: "NSK", alive: 0, points: 0, kills: 0 },
  { rank: 16, team: "Team 16", abbreviation: "DK", alive: 0, points: 0, kills: 0 }
];

async function fetchScoreboardData() {
    try {
        const response = await fetch(leaderboardUrl);
        const data = await response.json();

        if (!data.values) {
            throw new Error("No data available");
        }

        const scoreboardBody = document.getElementById('scoreboard-body');
        scoreboardBody.innerHTML = ''; // Clear previous data

        // Parse rows from row 2 to row 12
        const parsedData = data.values.slice(1).map((row, index) => ({
            rank: index + 1,
            teamName: row[1] || "Unknown", // Default to "Unknown" if no team name
            abbreviation: row[0] || "N/A", // Default to "N/A" if no abbreviation
            alive: parseInt(row[2] || 0), // Default to 0 if alive is missing
            points: parseInt(row[3] || 0), // Default to 0 if points are missing
            kills: parseInt(row[4] || 0), // Default to 0 if kills are missing
        }));

        // Separate teams with alive = 0
        const wipeoutTeams = parsedData.filter((team) => team.alive === 0);
        const activeTeams = parsedData.filter((team) => team.alive > 0);

        // Sort active teams and then append wipeout teams
        const sortedData = [...activeTeams, ...wipeoutTeams];

        // Ensure there are always 12 rows (add placeholders if needed)
        while (sortedData.length < 12) {
            sortedData.push({
                rank: sortedData.length + 1,
                teamName: "Placeholder Team",
                abbreviation: "N/A",
                alive: 0,
                points: 0,
                kills: 0,
            });
        }

        // Generate rows dynamically
        sortedData.forEach((row, index) => {
            const rowElement = document.createElement('tr');
            const aliveContent =
                row.alive === 0
                    ? `<td class="alive wipeout">Wipeout</td>`
                    : `<td class="alive"><div class="alive-line" style="width: ${row.alive * 20}px;"></div></td>`;

            rowElement.innerHTML = `
                <td class="rank">${row.rank}</td>
                <td class="team-name">${row.teamName} (${row.abbreviation})</td>
                ${aliveContent}
                <td class="points">${row.points}</td>
                <td class="kills">${row.kills}</td>
            `;

            // Highlight 12th row
            if (row.rank === 12) {
                rowElement.style.backgroundColor = "#550055"; // Highlight color for rank 12
                rowElement.style.color = "#fff";
            }

            scoreboardBody.appendChild(rowElement);
        });
    } catch (error) {
        console.error("Error fetching scoreboard data:", error);
        const errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.textAlign = 'center';
        errorElement.textContent = 'Error loading scoreboard data. Please try again later.';
        document.body.appendChild(errorElement);
    }
}

// Update every 3 seconds (simulate live tracking)
function updateLiveTracker() {
    const scoreboardBody = document.getElementById("scoreboard-body");
    scoreboardBody.innerHTML = ""; // Clear existing rows

    teams.forEach(team => {
        const rowElement = document.createElement("tr");
        const alivePercentage = (team.alive / 4) * 100; // Simulate max of 4 alive players

        rowElement.innerHTML = `
          <td class="rank">#${team.rank}</td>
          <td class="team-name">${team.abbreviation}</td>
          <td class="alive">
            <div class="alive-line" style="width: ${alivePercentage}%"></div>
          </td>
          <td class="points">${team.points || 0}</td>
          <td class="kills">${team.kills || 0}</td>
        `;
        scoreboardBody.appendChild(rowElement);
    });
}

// Fetch data when the page loads
window.onload = function() {
    fetchScoreboardData(); // Fetch initial scoreboard data
    setInterval(fetchScoreboardData, 30000); // Update every 30 seconds

    setInterval(updateLiveTracker, 3000); // Update live tracking every 3 seconds
};
