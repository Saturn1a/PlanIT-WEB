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
    return new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
}


// Display Dinners Function: Sets the date for each input element
function displayDinners(data) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const today = new Date(currentDate);
    const currentDayOfWeek = today.getDay();
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

    today.setDate(today.getDate() + diffToMonday); // Adjust to start of the week

    days.forEach((day, index) => {
        const dayDate = new Date(today);
        dayDate.setDate(today.getDate() + index);
        const dayElement = document.getElementById(day);
        if (dayElement) {
            dayElement.setAttribute('data-date', dayDate.toISOString().split('T')[0]);
            if (data[day] && data[day].id) {
                dayElement.value = data[day].name;
                dayElement.setAttribute('data-dinner-id', data[day].id);
            } else {
                dayElement.value = ""; // Clear previous value if no dinner data
                dayElement.removeAttribute('data-dinner-id');
            }

            // Ensure each input has a delete button, add if not exists
            if (!dayElement.parentNode.querySelector('button')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', function() {
                    deleteDinner(dayElement.getAttribute('data-dinner-id'), day);
                });
                dayElement.parentNode.appendChild(deleteBtn);
            }
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

                if (value && dinnerId) {
                    // Update existing dinner
                    updateOrCreateDinner(day, value, dinnerId, date);
                } else if (value && !dinnerId) {
                    // Create new dinner
                    updateOrCreateDinner(day, value, null, date);
                }
            }
        });
    });
}


function addDeleteButtonEventListeners() {
    const dinnerItems = document.getElementById('dinner-items'); 
    dinnerItems.addEventListener('click', function(event) {
        if (event.target.tagName === 'BUTTON' && event.target.textContent === 'X') {
            const input = event.target.closest('li').querySelector('input');
            const dinnerId = input.getAttribute('data-dinner-id');
            if (dinnerId) {
                deleteDinner(dinnerId, input.id);
            } else {
                console.log('No dinner ID found or already deleted');
            }
        }
    });
}

function updateOrCreateDinner(day, dinnerName, dinnerId, date) {
    const authToken = localStorage.getItem('authToken');
    // Decide the correct endpoint and method based on the presence of dinnerId
    const isUpdating = dinnerId && dinnerId.trim() !== "";
    const url = isUpdating ? `https://localhost:7019/api/v1/Dinners/${dinnerId}` : 'https://localhost:7019/api/v1/Dinners/register';
    const method = isUpdating ? 'PUT' : 'POST';

    console.log(`URL: ${url} Method: ${method}`);

    fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date,
            name: dinnerName
        })
    }).then(response => {
        if (!response.ok) throw new Error(`Failed to save dinner: ${response.statusText}`);
        return response.json();
    }).then(data => {
        console.log(`${day} dinner saved or updated successfully.`);
        const input = document.getElementById(day);
        if (!isUpdating) { // Only update the dinner ID if it was a new creation
            input.setAttribute('data-dinner-id', data.id);
        }
    }).catch(error => {
        console.error('Error saving dinner:', error);
        document.getElementById('feedback').textContent = `Failed to save ${day} dinner: ` + error.message;
    });
}


function deleteDinner(dinnerId, day) {
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:7019/api/v1/Dinners/${dinnerId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    }).then(response => {
        if (!response.ok) throw new Error('Failed to delete dinner.');
        console.log(`${day} dinner deleted successfully.`);
        document.getElementById(day).value = ""; 
        document.getElementById(day).removeAttribute('data-dinner-id'); 
    }).catch(error => {
        console.error('Error deleting dinner:', error);
        document.getElementById('feedback').textContent = `Failed to delete ${day} dinner: ` + error.message;
    });
}