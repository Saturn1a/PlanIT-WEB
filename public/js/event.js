document.addEventListener('DOMContentLoaded', function() {
    const eventList = document.getElementById('eventList');
    const eventDetails = document.getElementById('eventDetails');
    const inviteList = document.getElementById('inviteList');
    const addInviteButton = document.getElementById('add-invite-button');
    const collapsible = document.querySelector('.collapsible');
    const content = collapsible.nextElementSibling;
    let selectedEventId = null;


   
    function fetchEvents() {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Events?pageNr=1&pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch events'))
        .then(data => {
            eventList.innerHTML = '';
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to include all of today's events
    
            // Sort events by date in ascending order
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
    
            data.forEach(event => {
                const eventDate = new Date(event.date);
                if (eventDate >= currentDate) { // Check if the event date is today or in the future
                    createEventElement(event.id, event.name);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
    }
    

    function createEventElement(id, name) {
        const li = document.createElement('li');
        li.textContent = name;
        li.style.cursor = "pointer";
        li.onclick = () => {
            selectedEventId = id;
            fetchEventDetailsById(id);
            inviteList.innerHTML = ''; 
            fetchInvitesByEventId(id)
                .then(displayInvites)
                .catch(error => {
                    console.error('Error fetching invites:', error);
                });
            collapsible.classList.remove("active"); 
            content.style.display = 'none';
        };
        eventList.appendChild(li);
    }

    function displayInvites(invites) {
        inviteList.innerHTML = '';
        invites.forEach(invite => {
            const li = document.createElement('li');

            const nameDiv = document.createElement('div');
            nameDiv.textContent = invite.name;
            nameDiv.className = 'name-text';
            li.appendChild(nameDiv);

            const emailDiv = document.createElement('div');
            emailDiv.textContent = invite.email;
            emailDiv.className = 'email-text';
            li.appendChild(emailDiv);

            
            if (invite.coming) {
                const checkMark = document.createElement('span');
                checkMark.textContent = ' ✔';
                checkMark.style.color = 'green';
                checkMark.className = 'invite-mark';
                li.appendChild(checkMark);
            }
            inviteList.appendChild(li);
        });
    }

    function fetchInvitesByEventId(eventId) {
        const authToken = localStorage.getItem('authToken');
        return fetch(`https://localhost:7019/api/v1/Events/${eventId}/invites?pageNr=1&pageSize=10`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch invites'));
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
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch event details'))
        .then(event => displayEventDetails(event))
        .catch(error => {
            console.error('Error fetching event details:', error);
        });
    }

    function registerInvite(eventId, name, email) {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Invites/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include',
            body: JSON.stringify({
                eventId: eventId,
                name: name,
                email: email,
                coming: false
            })
        })
        .then(response => {
            if (response.ok) {
                displaySuccessMessage('Invite added successfully.');
                document.getElementById('inviteName').value = ''; 
                document.getElementById('inviteEmail').value = ''; 
                fetchInvitesByEventId(eventId); 
            } else {
                return Promise.reject('Failed to register invite');
            }
        })
        .catch(error => {
            displayErrorMessage('Failed to add invite: ' + error);
        });
    }

    function displayEventDetails(event) {
        document.getElementById('detailEventName').textContent = event.name;
        document.getElementById('detailEventLocation').textContent = event.location;
        document.getElementById('detailEventDate').textContent = event.date;
        document.getElementById('detailEventTime').textContent = event.time;
        eventDetails.style.display = "block";
    }

    collapsible.addEventListener('click', function() {
        this.classList.toggle("active");
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
            fetchEvents();
        }
    });

    addInviteButton.addEventListener('click', function() {
        const name = document.getElementById('inviteName').value;
        const email = document.getElementById('inviteEmail').value;
       
        registerInvite(selectedEventId, name, email);
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

        messageDiv.style.zIndex = '9999'; 
        
        messageDiv.style.position = 'fixed'; 
        messageDiv.style.zIndex = '1000'; 
        messageDiv.style.left = '50%';
        messageDiv.style.top = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)'; 
        

        document.body.appendChild(messageDiv);
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000); 
    }
    
    function displayErrorMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.color = 'red';
        messageDiv.style.backgroundColor = 'pink';
        messageDiv.style.padding = '10px';
        messageDiv.style.marginTop = '10px';
        messageDiv.style.borderRadius = '5px';

        messageDiv.style.zIndex = '9999';

        messageDiv.style.position = 'fixed'; 
        messageDiv.style.zIndex = '1000'; 
        messageDiv.style.left = '50%';
        messageDiv.style.top = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)'; 



        messageDiv.style.textAlign = 'center';
        document.body.appendChild(messageDiv);
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000); 
    }
});