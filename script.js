// Google Sheets API URL
const sheetId = '141Ea_xHBXPi6rItn07EiJMrUjVU7m9AFP8HFJi-Dm8I'; // Your sheet ID
const range = 'Sheet1!A2:E17'; // The range to fetch (adjust as needed)
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

    // Parse rows from row 2 onwards (assuming row 1 contains headers)
    const parsedData = data.values.map((row) => ({
      teamName: row[1] || "Unknown", // Default to "Unknown" if no team name
      abbreviation: row[0] || "N/A", // Default to "N/A" if no abbreviation
      alive: parseInt(row[2] || 0), // Default to 0 if alive is missing
      points: parseInt(row[3] || 0), // Default to 0 if points are missing
      kills: parseInt(row[4] || 0), // Default to 0 if kills are missing
    }));

    // Generate rows dynamically
    parsedData.forEach((row) => {
      const rowElement = document.createElement('tr');
      const aliveContent =
        row.alive === 0
          ? `<td class="alive wipeout">Wipeout</td>`
          : `<td class="alive"><div class="alive-line" style="width: ${row.alive * 20}px;"></div></td>`;

      rowElement.innerHTML = `
        <td class="team-name">${row.abbreviation}</td>
        ${aliveContent}
        <td class="points">${row.points}</td>
        <td class="kills">${row.kills}</td>
      `;
      
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

// Update every 1 second (real-time data)
setInterval(fetchScoreboardData, 1000); // Fetch data every 1 second

// Fetch data when the page loads
window.onload = fetchScoreboardData;

// Slide show logic to cycle through rows
let currentRowIndex = 0;
function slideShow() {
  const rows = document.querySelectorAll('#scoreboard-body tr');
  if (rows.length === 0) return; // Exit if no rows

  // Hide all rows
  rows.forEach(row => row.style.display = 'none');

  // Show the current row
  rows[currentRowIndex].style.display = '';

  // Move to the next row, or loop back to the start
  currentRowIndex = (currentRowIndex + 1) % rows.length;
}

// Slide every 2 seconds
setInterval(slideShow, 2000); // Change every 2 seconds
