// Google Sheets API URL
const sheetId = '141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I';
const range = 'Sheet1!A1:E13'; // Include header row and rows up to 12
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

        // Parse rows from row 2 to row 12
        const parsedData = data.values.slice(1).map((row, index) => ({
            rank: index + 1,
            teamName: row[1] || "Unknown", // Default to "Unknown" if no team name
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
                <td class="team-name">${row.teamName}</td>
                ${aliveContent}
                <td class="points">${row.points}</td>
                <td class="kills">${row.kills}</td>
            `;

            // Highlight 12th row
            if (row.rank === 12) {
                rowElement.style.backgroundColor = "#550055"; // Highlight color for rank 12
                rowElement.style.color = "#fff";
            }

            // Append the row to the scoreboard
            scoreboardBody.appendChild(rowElement);
        });
    } catch (error) {
        console.error("Error fetching scoreboard data:", error);

        // Create and display an error message
        const errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.textAlign = 'center';
        errorElement.style.fontSize = '1.2rem';
        errorElement.textContent = 'Error loading scoreboard data. Please try again later.';
        document.body.appendChild(errorElement);
    }
}

// Fetch data when the page loads
window.onload = fetchScoreboardData;
