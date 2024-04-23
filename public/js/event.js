document.addEventListener('DOMContentLoaded', function() {
  const eventList = document.getElementById('eventList');
  eventName.className = 'event-name'; // Assign a class for styling
  //const inviteList = document.getElementById('inviteList');

 

  // Function to fetch events
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
              throw new Error('Failed to fetch events: ' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          console.log('Event data:', data);
          eventList.innerHTML = '';  // Clear the list before appending new items
          data.forEach(event => {
              createEventElement(event.id, event.name);
          });
      })
      .catch(error => {
          console.error('Error fetching events:', error);
          alert('Failed to load events: ' + error.message);
      });
  }

  // Function to create event element
  function createEventElement(id, name) {
      const li = document.createElement('li');
      li.textContent = name;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✖';
      deleteBtn.className = 'delete-button';
      deleteBtn.onclick = () => deleteEvent(id, li);

      li.appendChild(deleteBtn);
      eventList.appendChild(li);

  }

  // Function to delete an event
  function deleteEvent(id, liElement) {
      const authToken = localStorage.getItem('authToken');
      fetch(`https://localhost:7019/api/v1/Events/${id}`, {
          method: 'DELETE',
          headers: {
              'Authorization': 'Bearer ' + authToken
          },
          credentials: 'include'
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to delete the event');
          }
          liElement.remove();
      })
      .catch(error => {
          console.error('Error deleting event:', error);
          alert('Failed to delete event: ' + error.message);
      });
  }

  fetchEvents();

});
