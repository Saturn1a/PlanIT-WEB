document.addEventListener('DOMContentLoaded', function() {
    const eventList = document.getElementById('eventList');
    const eventDetails = document.getElementById('eventDetails');
    const collapsible = document.querySelector('.collapsible');

    collapsible.addEventListener('click', function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
            fetchEvents();
        }
    });

    // Fetch all events to populate the list
    function fetchEvents() {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Events?pageNr=1&pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            return response.json();
        })
        .then(data => {
            eventList.innerHTML = ''; // Clear the list before appending new items
            data.forEach(event => {
                createEventElement(event.id, event.name);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            alert('Failed to load events: ' + error.message);
        });
    }

    // Create event list item elements
    function createEventElement(id, name) {
        const li = document.createElement('li');
        li.textContent = name;
        li.onclick = () => fetchEventDetailsById(id);
        eventList.appendChild(li);
    }

    // Fetch details for a specific event by ID
    function fetchEventDetailsById(id) {
        const authToken = localStorage.getItem('authToken');
        fetch(`https://localhost:7019/api/v1/Events/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }
            return response.json();
        })
        .then(event => {
            displayEventDetails(event);
        })
        .catch(error => {
            console.error('Error fetching event details:', error);
            alert('Failed to load event details: ' + error.message);
        });
    }

    // Display the fetched event details in the details section
    function displayEventDetails(event) {
        document.getElementById('detailEventName').textContent = event.name;
        document.getElementById('detailEventLocation').textContent = event.location;
        document.getElementById('detailEventDate').textContent = event.date;
        document.getElementById('detailEventTime').textContent = event.time;
        eventDetails.style.display = "block";
    }

    // Optionally, you can fetch events as soon as the page loads
    // fetchEvents();
});
