document.addEventListener('DOMContentLoaded', function() {
    // Date input to prevent past dates
    var dateInput = document.getElementById('date');
    var today = new Date();
    var dateStr = today.toISOString().substring(0, 10);
    dateInput.setAttribute('min', dateStr);

    // Form submission event listener
    document.getElementById('event-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const timeWithSeconds = document.getElementById('time').value + ":00";
        const formData = {
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            date: document.getElementById('date').value,
            time: timeWithSeconds
        };

        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Events/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong on the API server.');
            }
        })
        .then(data => {
            console.log('Event created:', data);
            displaySuccessMessage('Event created successfully!');
            setTimeout(() => {
                window.location.href = 'event.html';
            }, 3000); // Redirect after 3 seconds
        })
        .catch(error => {
            console.error('Error creating event:', error);
            displayErrorMessage('Failed to create event.');
        });
    });

    function displaySuccessMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.color = 'green';
        messageDiv.style.backgroundColor = 'lightgreen';
        messageDiv.style.padding = '10px';
        messageDiv.style.marginTop = '10px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.textAlign = 'center';
        document.body.appendChild(messageDiv);
    }

    function displayErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.color = 'red';
        messageDiv.style.backgroundColor = 'pink';
        messageDiv.style.padding = '10px';
        messageDiv.style.marginTop = '10px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.textAlign = 'center';
        document.body.appendChild(messageDiv)
    }
});