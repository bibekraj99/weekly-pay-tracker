// Global variables
let weeklyData = {}; // Object to store weekly data
let payRate = 14; // Default pay rate
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const startDate = new Date(); // Starting date of the week

// Load saved weekly data from localStorage
function loadWeeklyData() {
    const savedData = JSON.parse(localStorage.getItem("weeklyData"));
    if (savedData) {
        weeklyData = savedData;
    }
}

// Store data for a specific day and save to localStorage
function storeDayData(date) {
    const hoursInput = document.getElementById(date).value;
    weeklyData[date] = parseFloat(hoursInput) || 0;
    localStorage.setItem("weeklyData", JSON.stringify(weeklyData)); // Save to localStorage
}

// Initialize the weekly inputs and pre-fill saved data
function initializeWeek() {
    const daysContainer = document.getElementById("daysContainer");
    daysContainer.innerHTML = ""; // Clear previous inputs

    daysOfWeek.forEach((day, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        const dateString = currentDate.toISOString().split("T")[0];
        const savedHours = weeklyData[dateString] || ''; // Load saved hours from weeklyData
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

// Update calendar for the current week
function updateCalendar() {
    const calendar = document.getElementById("calendar");
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        weekDates.push(currentDate.toDateString());
    }

    calendar.textContent = `Week Starting: ${weekDates[0]} - ${weekDates[6]}`;
}

// Update the total and earnings
function updateHistory() {
    let totalHours = 0;

    for (const date in weeklyData) {
        totalHours += weeklyData[date];
    }

    const totalEarnings = (totalHours * payRate).toFixed(2);
    document.getElementById("totalHours").textContent = `Total Hours: ${totalHours}`;
    document.getElementById("totalEarnings").textContent = `Total Earnings: $${totalEarnings}`;
}

// Update pay rate and save to localStorage
function updatePayRate() {
    const payRateInput = document.getElementById("payRateInput").value;
    payRate = parseFloat(payRateInput) || 14; // Default to 14 if invalid
    localStorage.setItem("payRate", payRate);
    updateHistory();
}

// Initialize the app
loadWeeklyData(); // Load saved weekly data
updateCalendar();
initializeWeek();
updateHistory();
