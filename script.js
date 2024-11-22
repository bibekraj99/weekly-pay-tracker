let payRate = 14; // Default hourly pay rate
const daysOfWeek = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];
let weeklyData = {}; // Store hours for each day
let history = JSON.parse(localStorage.getItem("weeklyHistory")) || []; // Retrieve history from localStorage
let startDate = new Date(); // Default start date is today

// Update the week range based on the selected start date
function updateWeekRange() {
    const startDateInput = document.getElementById("startDate").value;
    if (!startDateInput) return;

    startDate = new Date(startDateInput);
    const startDay = startDate.getDay();

    // Ensure the selected date is a Wednesday
    if (startDay !== 3) {
        alert("Please select a Wednesday as the starting date.");
        return;
    }

    updateCalendar();
    initializeWeek();
}

// Display the current week's range
function updateCalendar() {
    const weekRange = getWeekRange(startDate);
    document.getElementById("calendar").innerText = `Current Week: ${weekRange.start} to ${weekRange.end}`;
}

// Get week range (start and end dates)
function getWeekRange(startDate) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
    };
}

// Initialize the weekly input fields and load saved data
function initializeWeek() {
    const daysContainer = document.getElementById("daysContainer");
    daysContainer.innerHTML = ""; // Clear previous inputs

    daysOfWeek.forEach((day, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        const dateString = currentDate.toISOString().split("T")[0];
        const savedHours = weeklyData[dateString] || ''; // Load saved hours
        daysContainer.innerHTML += `
            <div class="form-group">
                <label for="${dateString}">${day} (${dateString}) Hours:</label>
                <input type="number" id="${dateString}" placeholder="Enter hours for ${day}" min="0" value="${savedHours}" onchange="storeDayData('${dateString}')">
            </div>
        `;
    });

    // Load saved pay rate
    const savedPayRate = localStorage.getItem("payRate") || "14";
    payRate = parseFloat(savedPayRate);
    document.getElementById("payRateInput").value = savedPayRate;
}

// Store data for a specific day
function storeDayData(date) {
    const hoursInput = document.getElementById(date).value;
    weeklyData[date] = parseFloat(hoursInput) || 0;
}

// Update pay rate
function updatePayRate() {
    const payRateInput = document.getElementById("payRateInput").value;
    payRate = parseFloat(payRateInput) || 14;
    localStorage.setItem("payRate", payRateInput); // Save pay rate to localStorage
}

// Calculate weekly pay
function calculateWeeklyPay() {
    let totalHours = 0;

    // Sum up hours for all days
    for (const date in weeklyData) {
        totalHours += weeklyData[date] || 0;
    }

    // Calculate pay
    const totalPay = totalHours * payRate;
    document.getElementById("weeklyPayOutput").value = totalPay.toFixed(2);

    // Save to history
    const weekRange = getWeekRange(startDate);
    const currentWeek = {
        dateRange: `${weekRange.start} to ${weekRange.end}`,
        hours: { ...weeklyData },
        pay: totalPay.toFixed(2),
    };

    // Add the current week to history
    history.unshift(currentWeek);
    if (history.length > 3) history.pop(); // Keep only 3 entries

    localStorage.setItem("weeklyHistory", JSON.stringify(history)); // Save history to localStorage
    updateHistory();
    resetWeekData();
}

// Update history display
function updateHistory() {
    const historyContainer = document.getElementById("historyContainer");
    historyContainer.innerHTML = ""; // Clear previous history
    history.forEach((entry, index) => {
        historyContainer.innerHTML += `
            <div class="history-item">
                <strong>Week (${entry.dateRange})</strong>: $${entry.pay}
                <button onclick="viewWeek(${index})">View Details</button>
                <button onclick="clearWeek(${index})">Clear This Week</button>
            </div>
        `;
    });
}

// View a specific week's data
function viewWeek(index) {
    const week = history[index];
    weeklyData = week.hours; // Load hours for the selected week
    startDate = new Date(week.dateRange.split(" to ")[0]); // Update the start date
    updateCalendar();
    initializeWeek();

    // Display daily hours breakdown
    const detailsContainer = document.getElementById("detailsContainer");
    detailsContainer.innerHTML = `
        <h3>Details for ${week.dateRange}</h3>
        <ul>
            ${Object.entries(week.hours)
                .map(([date, hours]) => `<li>${date}: ${hours} hours</li>`)
                .join("")}
        </ul>
    `;
}

// Clear data for the current week only
function clearData() {
    weeklyData = {};
    initializeWeek();
    alert("Current week's input has been cleared.");
}

// Clear a specific week's history
function clearWeek(index) {
    if (confirm("Are you sure you want to clear this week's history?")) {
        history.splice(index, 1); // Remove the selected week
        localStorage.setItem("weeklyHistory", JSON.stringify(history)); // Update localStorage
        updateHistory();
        alert("Selected week's history has been cleared.");
    }
}

// Clear all history
function clearAllHistory() {
    if (confirm("Are you sure you want to clear all history?")) {
        history = [];
        localStorage.removeItem("weeklyHistory"); // Remove from localStorage
        updateHistory();
        alert("All history has been cleared.");
    }
}

// Reset weekly data for the new week
function resetWeekData() {
    weeklyData = {};
    initializeWeek();
}

// Toggle visibility of week details
function toggleDetails(index) {
    const detailsContainer = document.getElementById(`details-${index}`);
    if (detailsContainer.style.display === "none") {
        detailsContainer.style.display = "block";
    } else {
        detailsContainer.style.display = "none";
    }
}

// Delete a specific week's details and history
function deleteWeek(index) {
    if (confirm("Are you sure you want to delete this week's details?")) {
        history.splice(index, 1); // Remove the week from history
        localStorage.setItem("weeklyHistory", JSON.stringify(history)); // Update localStorage
        updateHistory(); // Refresh the displayed history
        alert("Week details deleted successfully.");
    }
}

// Update history display with toggle and delete options
function updateHistory() {
    const historyContainer = document.getElementById("historyContainer");
    historyContainer.innerHTML = ""; // Clear previous history

    history.forEach((entry, index) => {
        historyContainer.innerHTML += `
            <div class="history-item">
                <div>
                    <strong>Week (${entry.dateRange})</strong>: $${entry.pay}
                </div>
                <div>
                    <button onclick="toggleDetails(${index})">Toggle Details</button>
                    <button onclick="deleteWeek(${index})">Delete</button>
                </div>
            </div>
            <div id="details-${index}" style="display: none; margin-top: 10px; background: #f5f5f5; padding: 10px; border-radius: 8px;">
                <h4>Details for ${entry.dateRange}</h4>
                <ul>
                    ${Object.entries(entry.hours)
                        .map(([date, hours]) => `<li>${date}: ${hours} hours</li>`)
                        .join("")}
                </ul>
            </div>
        `;
    });
}


// Initialize the app
updateCalendar();
initializeWeek();
updateHistory();
