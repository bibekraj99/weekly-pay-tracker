// Global variables
let weeklyData = {}; // Object to store weekly data
let payRate = 14; // Default pay rate
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Load saved weekly data from localStorage
function loadWeeklyData() {
    const savedData = localStorage.getItem("weeklyData");
    if (savedData) {
        weeklyData = JSON.parse(savedData);
    } else {
        weeklyData = {}; // Initialize empty if no data
    }
}

// Store data for a specific day and save to localStorage
function storeDayData(date) {
    const hoursInput = document.getElementById(date).value;
    weeklyData[date] = parseFloat(hoursInput) || 0; // Store hours for the given date
    localStorage.setItem("weeklyData", JSON.stringify(weeklyData)); // Save to localStorage
}

// Initialize the weekly inputs and pre-fill saved data
function initializeWeek(startDate) {
    const daysContainer = document.getElementById("daysContainer");
    daysContainer.innerHTML = ""; // Clear previous inputs

    daysOfWeek.forEach((day, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        const dateString = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

        // Load saved hours for this date
        const savedHours = weeklyData[dateString] !== undefined ? weeklyData[dateString] : '';
        daysContainer.innerHTML += `
            <div class="form-group">
                <label for="${dateString}">${day} (${dateString}) Hours:</label>
                <input type="number" id="${dateString}" placeholder="Enter hours for ${day}" min="0" value="${savedHours}" onchange="storeDayData('${dateString}')">
            </div>
        `;
    });
}

// Update calendar for the current week
function updateCalendar(startDate) {
    const calendar = document.getElementById("calendar");
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        weekDates.push(currentDate.toDateString());
    }

    calendar.textContent = `Week Starting: ${weekDates[0]} - ${weekDates[6]}`;
}

// Update pay rate and save to localStorage
function updatePayRate() {
    const payRateInput = document.getElementById("payRateInput").value;
    payRate = parseFloat(payRateInput) || 14; // Default to 14 if invalid
    localStorage.setItem("payRate", payRate); // Save pay rate
}

// Update total hours and earnings
function calculateWeeklyPay() {
    let totalHours = 0;

    for (const date in weeklyData) {
        totalHours += weeklyData[date];
    }

    const totalEarnings = (totalHours * payRate).toFixed(2);
    document.getElementById("weeklyPayOutput").value = `$${totalEarnings}`;
}

// Clear data for the current week
function clearData() {
    if (confirm("Are you sure you want to clear the current week's input?")) {
        const inputs = document.querySelectorAll("#daysContainer input");
        inputs.forEach((input) => {
            input.value = "";
            const date = input.id;
            delete weeklyData[date];
        });
        localStorage.setItem("weeklyData", JSON.stringify(weeklyData)); // Update localStorage
        calculateWeeklyPay();
    }
}

// Clear all data (history and current week)
function clearAllHistory() {
    if (confirm("Are you sure you want to clear all saved data?")) {
        localStorage.clear();
        weeklyData = {};
        initializeWeek(new Date());
        calculateWeeklyPay();
    }
}

// Set the week range based on the selected start date
function updateWeekRange() {
    const startDateInput = document.getElementById("startDate").value;
    if (startDateInput) {
        const startDate = new Date(startDateInput);
        updateCalendar(startDate);
        initializeWeek(startDate);
    }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
    loadWeeklyData(); // Load saved data
    const savedPayRate = localStorage.getItem("payRate");
    payRate = savedPayRate ? parseFloat(savedPayRate) : 14;
    document.getElementById("payRateInput").value = payRate;

    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Set to Sunday
    updateCalendar(currentWeekStart);
    initializeWeek(currentWeekStart);
});
