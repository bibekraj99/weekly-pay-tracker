let payRate = 14; // Default hourly pay rate
const daysOfWeek = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"]; // Adjusted week
const weeklyData = {}; // Store hours for each day

// Initialize the weekly input fields
function initializeWeek() {
    const daysContainer = document.getElementById("daysContainer");
    daysOfWeek.forEach((day) => {
        daysContainer.innerHTML += `
            <div class="form-group">
                <label for="${day}">${day} Hours:</label>
                <input type="number" id="${day}" placeholder="Enter hours for ${day}" min="0" onchange="storeDayData('${day}')">
            </div>
        `;
    });
}

// Store data for a specific day
function storeDayData(day) {
    const hoursInput = document.getElementById(day).value;
    weeklyData[day] = parseFloat(hoursInput) || 0; // Default to 0 if no input
}

// Update pay rate
function updatePayRate() {
    const payRateInput = document.getElementById("payRateInput").value;
    payRate = parseFloat(payRateInput) || 14; // Default to $14 if invalid
}

// Calculate weekly pay
function calculateWeeklyPay() {
    let totalHours = 0;

    // Sum up hours for all days
    daysOfWeek.forEach((day) => {
        totalHours += weeklyData[day] || 0;
    });

    // Calculate pay
    const totalPay = totalHours * payRate;
    document.getElementById("weeklyPayOutput").value = totalPay.toFixed(2);
}

// Initialize the app
initializeWeek();
