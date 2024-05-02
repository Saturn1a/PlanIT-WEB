document.addEventListener('DOMContentLoaded', function() {
    const eventList = document.getElementById('eventList');
    const eventDetails = document.getElementById('eventDetails');
    const inviteList = document.getElementById('inviteList'); // Get the invite list element
    const collapsible = document.querySelector('.collapsible');
    const content = collapsible.nextElementSibling;

    collapsible.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click from bubbling to the document
        this.classList.toggle("active");
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
            fetchEvents();
        }
    });

    // Close the collapsible when clicking outside
    document.addEventListener('click', function(event) {
        if (!collapsible.contains(event.target) && !content.contains(event.target)) {
            content.style.display = 'none';
            collapsible.classList.remove("active");
        }
    });

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

    function createEventElement(id, name) {
        const li = document.createElement('li');
        li.textContent = name;
        li.onclick = () => {
            fetchEventDetailsById(id);
            fetchInvitesByEventId(id); // Fetch and display invites related to the selected event
        };
        eventList.appendChild(li);
    }

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

    function fetchInvitesByEventId(eventId) {
        const authToken = localStorage.getItem('authToken');
        fetch(`https://localhost:7019/api/v1/Invites?pageNr=1&pageSize=10`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch invites');
            }
            return response.json();
        })
        .then(invites => {
            inviteList.innerHTML = ''; // Clear the list before appending new items
            invites.forEach(invite => {
                const li = document.createElement('li');
                li.textContent = `${invite.name} ${invite.email}`;
                inviteList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching invites:', error);
            alert('Failed to load invites: ' + error.message);
        });
    }

    function displayEventDetails(event) {
        document.getElementById('detailEventName').textContent = event.name;
        document.getElementById('detailEventLocation').textContent = event.location;
        document.getElementById('detailEventDate').textContent = event.date;
        document.getElementById('detailEventTime').textContent = event.time;
        eventDetails.style.display = "block";
    }
});
