document.addEventListener('DOMContentLoaded', function() {
    const datesList = document.getElementById('dates-items');
    const dateNameInput = document.getElementById('date-name');
    const dateDateInput = document.getElementById('date-date');
    const addButton = document.getElementById('add-date');

    // Ensure all elements are present
    if (!datesList || !dateNameInput || !dateDateInput || !addButton) {
        console.error('One or more essential elements are missing.');
        return;
    }

    // Fetch existing dates
    fetchImportantDates();

    // Add new date
    addButton.addEventListener('click', function() {
        const name = dateNameInput.value.trim();
        const date = dateDateInput.value;
        if (name && date) {
            addImportantDate({ name, date });
            dateNameInput.value = '';
            dateDateInput.value = '';
        } else {
            alert('Please enter both name and date.');
        }
    });


    function fetchImportantDates() {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/ImportantDates?pageNr=1&pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            // Sort dates ascending
            datesList.innerHTML = '';  // Clear existing entries
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            data.forEach(date => {
                createDateElement(date);
            });
        })
        .catch(error => {
            console.error('Error fetching important dates:', error);
            alert('Failed to load important dates: ' + error.message);
        });
    }
    

    function addImportantDate(dateInfo) {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/ImportantDates/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(dateInfo),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                fetchImportantDates();  // Re-fetch and redraw the list
            }
            // createDateElement(data);
        })
        .catch(error => {
            console.error('Error adding important date:', error);
            alert('Failed to add important date: ' + error.message);
        });
    }

   // dateUtils.js

    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = date.toLocaleString('en-US', { month: 'long' }); // Gets the full month name
        const year = date.getFullYear();
        const day = date.getDate();

        // Construct the date with the format "Month DaySuffix Year"
        return `${month} ${getDaySuffix(day)} ${year}`;
    }

    function getDaySuffix(day) {
        let suffix;
        if (day > 3 && day < 21) suffix = 'th';
        else {
            switch (day % 10) {
                case 1:  suffix = "st"; break;
                case 2:  suffix = "nd"; break;
                case 3:  suffix = "rd"; break;
                default: suffix = "th";
            }
        }
        return `${day}${suffix}`;
    }



    function createDateElement(date) {
        const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
        console.log("Comparing:", date.date, "to today's date:", today);

         // Skip dates that are before today
        if (date.date < today) {
        return;
        }

        const li = document.createElement('li');
        li.className = 'date-item';
        
        if (date.date === today) {
            li.classList.add('today-highlight'); // Add class if it's today's date
        }
    
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content-div';
    
        const dateDiv = document.createElement('div');
        dateDiv.textContent = `${formatDate(date.date)}`;
        dateDiv.className = 'date-text';
    
        const nameDiv = document.createElement('div');
        nameDiv.textContent = date.name;
        nameDiv.className = 'name-text';
    
        contentDiv.appendChild(dateDiv);
        contentDiv.appendChild(nameDiv);
    
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = () => deleteImportantDate(date.id, li);
    
        li.appendChild(contentDiv);
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
            if (!response.ok) throw new Error('Failed to delete the important date');
            liElement.remove();
        })
        .catch(error => {
            console.error('Error deleting important date:', error);
            alert('Failed to delete important date: ' + error.message);
        });
    }
});