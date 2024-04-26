let currentDate; // This will track the current date for the displayed week.

document.addEventListener("DOMContentLoaded", function() {
    currentDate = new Date();
    updateWeekDisplay(currentDate); // Initialize display with current week

    document.getElementById('prevWeek').addEventListener('click', function() {
        console.log("Previous week clicked");
        let newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        currentDate = newDate;
        updateWeekDisplay(currentDate);
    });
    
    document.getElementById('nextWeek').addEventListener('click', function() {
        console.log("Next week clicked");
        let newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        currentDate = newDate;
        updateWeekDisplay(currentDate);
    });

    addInputEventListeners(); // Set up event listeners for dinner item interactions
});

// Update the display based on the current date
function updateWeekDisplay(date) {
    console.log("Updating display for date:", date);
    const { startDate, endDate } = getCurrentWeekDateRange(date);
    console.log("Start Date:", startDate, "End Date:", endDate);
    const weekNumber = getWeekNumber(new Date(startDate));
    console.log("Week Number:", weekNumber);
    document.getElementById('weekLabel').textContent = `Week ${weekNumber}`;
    loadWeeklyDinners(startDate, endDate);
}

// Load weekly dinners from the server
function loadWeeklyDinners(startDate, endDate) {
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:7019/api/v1/Dinners/weekly/${startDate}/${endDate}`, {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + authToken}
    }).then(response => {
        if (response.ok) return response.json();
        throw new Error('Failed to load dinners.');
    })
    .then(data => displayDinners(data))
    .catch(error => {
        console.error('Error loading dinners:', error);
        document.getElementById('feedback').textContent = 'Failed to load weekly dinners: ' + error.message;
    });
}

// Display dinners on the page
function displayDinners(data) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    days.forEach(day => {
        const element = document.getElementById(day);
        if (element) {
            element.value = data[day] && data[day].name ? data[day].name : "";
        } else {
            console.error("Element not found for day:", day);
        }
    });
}

// Set up input event listeners for dinner items
function addInputEventListeners() {
    const inputFields = document.querySelectorAll('.dinner-item');
    inputFields.forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitDinners();
            }
        });

        input.addEventListener('input', function() {
            const day = input.id.charAt(0).toUpperCase() + input.id.slice(1);
            if (input.value.trim() === '') {
                deleteDinner(day); // Delete if the field is emptied
            } else {
                updateDinner(day, input.value); // Update as user types
            }
        });
    });
}

// Submit dinners to the server
function submitDinners() {
    const dinners = {};
    document.querySelectorAll('.dinner-item').forEach(input => {
        dinners[input.id.charAt(0).toUpperCase() + input.id.slice(1)] = input.value;
    });
    const authToken = localStorage.getItem('authToken');
    fetch('https://localhost:7019/api/v1/Dinners/register-weekly-plan', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken},
        body: JSON.stringify({weeklyPlanDTO: dinners})
    }).then(response => {
        if (response.ok) return response.json();
        throw new Error('Failed to submit dinners.');
    })
    .then(data => {
        console.log('Success:', data);
        updateWeekDisplay(currentDate); // Refresh display to show updated data
    })
    .catch(error => {
        console.error('Error submitting dinners:', error);
        document.getElementById('feedback').textContent = 'Failed to submit weekly dinners: ' + error.message;
    });
}

// Update a specific dinner
function updateDinner(day, dinnerName) {
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:7019/api/v1/Dinners/update/${day}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken},
        body: JSON.stringify({Name: dinnerName})
    }).then(response => {
        if (!response.ok) throw new Error('Failed to update dinner.');
    }).catch(error => {
        console.error('Error updating dinner:', error);
        document.getElementById('feedback').textContent = 'Failed to update dinner for ' + day + ': ' + error.message;
    });
}

// Delete a specific dinner
function deleteDinner(day) {
    const authToken = localStorage.getItem('authToken');
    fetch(`https://localhost:7019/api/v1/Dinners/delete/${day}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) throw new Error('Failed to delete dinner.');
    }).catch(error => console.error('Error deleting dinner:', error));
}
