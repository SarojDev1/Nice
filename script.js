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

        const scoreboardHeader = document.getElementById('scoreboard-header');
        const scoreboardBody = document.getElementById('scoreboard-body');
        scoreboardBody.innerHTML = ''; // Clear previous data

        // Display header row dynamically (Row 1 in Google Sheets)
        const headerRow = data.values[0]; // First row contains column titles
        scoreboardHeader.innerHTML = headerRow
            .map((header) => `<th>${header}</th>`)
            .join('');

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
                <td>${index + 1}</td>
                <td>${row.teamName}</td>
                ${aliveContent}
                <td>${row.points}</td>
                <td>${row.kills}</td>
            `;

            // Highlight 12th row
            if (index + 1 === 12) {
                rowElement.style.backgroundColor = "#550055"; // Highlight color for rank 12
                rowElement.style.color = "#fff";
            }

            scoreboardBody.appendChild(rowElement);
        });
    } catch (error) {
        console.error("Error fetching scoreboard data:", error);
        document.getElementById('error-message').style.display = 'block';
    }
}

// Fetch data when the page loads
window.onload = fetchScoreboardData;
