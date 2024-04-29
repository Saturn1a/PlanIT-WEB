let currentDate;

// Set current date on page load and attach event listeners
document.addEventListener("DOMContentLoaded", function() {
    currentDate = new Date();
    currentDate.setHours(12, 0, 0, 0);  // Set time to noon to avoid day rollover issues
    updateWeekDisplay(currentDate);
    addInputEventListeners();
    document.getElementById('prevWeek').addEventListener('click', handlePrevWeek);
    document.getElementById('nextWeek').addEventListener('click', handleNextWeek);
});

// Navigate to the previous week
function handlePrevWeek() {
    currentDate.setDate(currentDate.getDate() - 7);
    updateWeekDisplay(currentDate);
}

// Navigate to the next week
function handleNextWeek() {
    currentDate.setDate(currentDate.getDate() + 7);
    updateWeekDisplay(currentDate);
}

// Update the display based on the current date
function updateWeekDisplay(date) {
    const { startDate, endDate } = getCurrentWeekDateRange(date);
    console.log("Start Date:", startDate, "End Date:", endDate);
    const weekNumber = getWeekNumber(new Date(startDate));
    document.getElementById('weekLabel').textContent = `Week ${weekNumber}`;
    loadWeeklyDinners(startDate, endDate);
}

function showLoadingIndicator(show) {
    const loader = document.getElementById('loadingIndicator');
    loader.style.visibility = show ? 'visible' : 'hidden';
}

function loadWeeklyDinners(startDate, endDate) {
    showLoadingIndicator(true);
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:7019/api/v1/Dinners/weekly/${startDate}/${endDate}`, {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + authToken}
    }).then(response => {
        showLoadingIndicator(false);
        if (response.ok) return response.json();
        throw new Error('Failed to load dinners.');
    }).then(data => displayDinners(data))
    .catch(error => {
        console.error('Error loading dinners:', error);
        document.getElementById('feedback').textContent = 'Failed to load weekly dinners: ' + error.message;
    });
}

// Function to create a date string in UTC
function getDateForAPI(year, month, day) {
    // This creates a date at midnight UTC
    return new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
}

// Display Dinners Function: Sets the date for each input element
function displayDinners(data) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const today = new Date(currentDate);  // Assuming currentDate is the start of the week being viewed
    const currentDayOfWeek = today.getDay();
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;  // Adjust if Sunday is day 0

    today.setDate(today.getDate() + diffToMonday);  // Set to Monday of the current week

    days.forEach((day, index) => {
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() + index);  // Move to correct day by adding index
        const element = document.getElementById(day);
        if (element) {
            element.setAttribute('data-date', dayDate.toISOString().split('T')[0]);
            element.value = data[day] && data[day].name ? data[day].name : "";
            console.log(day + " date set to: ", element.getAttribute('data-date'));  // Logging for verification
        } else {
            console.error("Element not found for day:", day);
        }
    });
}


function addInputEventListeners() {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    days.forEach(day => {
        const input = document.getElementById(day);
        input.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const value = input.value.trim();
                const date = input.getAttribute('data-date');
                const dinnerId = input.getAttribute('data-dinner-id');
                if (value) {
                    updateOrCreateDinner(day, value, dinnerId, date);
                } else if (dinnerId) {
                    deleteDinner(dinnerId, day);
                }
            }
        });
    });
}


function updateOrCreateDinner(day, dinnerName, dinnerId, date) {
    const authToken = localStorage.getItem('authToken');
    const url = dinnerId ? `https://localhost:7019/api/v1/Dinners/${dinnerId}` : 'https://localhost:7019/api/v1/Dinners/register';
    const method = dinnerId ? 'PUT' : 'POST';

    // Ensure the date is in UTC to prevent timezone issues
    const dateObj = new Date(date + 'T00:00:00Z');

    fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: dateObj.toISOString().split('T')[0], // Format the date as YYYY-MM-DD in UTC
            name: dinnerName
        })
    }).then(response => {
        if (!response.ok) throw new Error(`Failed to save dinner: ${response.statusText}`);
        return response.json();
    }).then(data => {
        console.log(`${day} dinner saved successfully.`);
        const input = document.getElementById(day);
        input.setAttribute('data-dinner-id', data.id);  // Update the input with the new dinner ID
    }).catch(error => {
        console.error('Error saving dinner:', error);
        document.getElementById('feedback').textContent = `Failed to save ${day} dinner: ` + error.message;
    });
}



function deleteDinner(dinnerId, day) {
    const authToken = localStorage.getItem('authToken');
    if (confirm(`Are you sure you want to delete the dinner for ${day}?`)) {
        fetch(`https://localhost:7019/api/v1/Dinners/${dinnerId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        }).then(response => {
            if (!response.ok) throw new Error('Failed to delete dinner.');
            console.log(`${day} dinner deleted successfully.`);
            const input = document.getElementById(day);
            input.value = "";
            input.removeAttribute('data-dinner-id');
        }).catch(error => {
            console.error('Error deleting dinner:', error);
            document.getElementById('feedback').textContent = `Failed to delete ${day} dinner: ` + error.message;
        });
    }
}