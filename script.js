let payRate = 14; // Default hourly pay rate
const daysOfWeek = ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"];
const weeklyData = {}; // Store hours for each day

// Initialize the weekly input fields and load saved data
function initializeWeek() {
    const daysContainer = document.getElementById("daysContainer");
    daysOfWeek.forEach((day) => {
        const savedHours = localStorage.getItem(`hours_${day}`) || ''; // Load saved hours
        weeklyData[day] = parseFloat(savedHours) || 0;

        daysContainer.innerHTML += `
            <div class="form-group">
                <label for="${day}">${day} Hours:</label>
                <input type="number" id="${day}" placeholder="Enter hours for ${day}" min="0" value="${savedHours}" onchange="storeDayData('${day}')">
            </div>
        `;
    });

    // Load saved pay rate
    const savedPayRate = localStorage.getItem('payRate') || '14';
    payRate = parseFloat(savedPayRate);
    document.getElementById("payRateInput").value = savedPayRate;
}

// Store data for a specific day
function storeDayData(day) {
    const hoursInput = document.getElementById(day).value;
    weeklyData[day] = parseFloat(hoursInput) || 0;
    localStorage.setItem(`hours_${day}`, hoursInput); // Save to localStorage
}

// Update pay rate
function updatePayRate() {
    const payRateInput = document.getElementById("payRateInput").value;
    payRate = parseFloat(payRateInput) || 14;
    localStorage.setItem('payRate', payRateInput); // Save pay rate to localStorage
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

// Clear all data
function clearData() {
    localStorage.clear(); // Clear all stored data
    alert("All data cleared!");
    location.reload(); // Reload the app to reset fields
}

// Initialize the app
initializeWeek();
