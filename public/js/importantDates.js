document.addEventListener('DOMContentLoaded', function() {
    console.log('Button clicked');
    const datesList = document.getElementById('dates-items');
    const dateNameInput = document.getElementById('date-name');
    const dateDateInput = document.getElementById('date-date');

    if (!datesList || !dateNameInput || !dateDateInput) {
        console.error('Essential elements not found!');
        return;
    }

    document.getElementById('add-date').addEventListener('click', function() {
        const name = dateNameInput.value.trim();
        const date = dateDateInput.value;
        if (name && date) {
            addImportantDate({ name, date });
            dateNameInput.value = '';
            dateDateInput.value = '';
        }
    });

    function addImportantDate(dateInfo) {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/ImportantDates/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(dateInfo),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.id) {
                createDateElement(data);
            } else {
                throw new Error('Invalid date data received');
            }
        })
        .catch(error => {
            console.error('Error adding important date:', error);
            alert('Failed to add important date: ' + error.message);
        });
    }

    function createDateElement(date) {
        const li = document.createElement('li');
        li.textContent = `${date.name} on ${new Date(date.date).toLocaleDateString()}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.onclick = function() { deleteImportantDate(date.id, li); };

        li.appendChild(deleteBtn);
        datesList.appendChild(li);
    }

    function deleteImportantDate(dateId, liElement) {
        const authToken = localStorage.getItem('authToken');
        fetch(`https://localhost:7019/api/v1/ImportantDates/${dateId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the important date');
            }
            liElement.remove();
        })
        .catch(error => {
            console.error('Error deleting important date:', error);
            alert('Failed to delete important date: ' + error.message);
        });
    }

    function fetchImportantDates() {
        console.log('Fetching important dates...');
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/ImportantDates', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load important dates: status ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Important dates received:', data);
            datesList.innerHTML = '';
            data.forEach(date => createDateElement(date));
        })
        .catch(error => {
            console.error('Error fetching important dates:', error);
            alert('Failed to load important dates: ' + error.message);
        });
    }

    // Initialize fetching important dates when page loads
    fetchImportantDates();
});