document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value
        };

        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Contacts/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add contact: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Contact added:', data);
            displaySuccessMessage('Contact added successfully!');
            fetchContacts(); // Refresh the list of contacts
            // Clear the input fields after successful addition
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
        })
        .catch(error => {
            console.error('Error adding contact:', error);
            displayErrorMessage('Failed to add contact.');
        });
    });

    function fetchContacts() {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Contacts?pageNr=1&pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch contacts: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Contacts data:', data);
            const contactList = document.getElementById('contact-list');
            contactList.innerHTML = '';  // Clear the list before appending new items
            data.forEach(contact => {
                createContactElement(contact.id, contact.name, contact.email);
            });
        })
        .catch(error => {
            console.error('Error fetching contacts:', error);
            alert('Failed to load contacts: ' + error.message);
        });
    }


    function createContactElement(id, name, email) {
        const li = document.createElement('li');
        li.className = 'contact-item';
    
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content-div';
    
        const nameDiv = document.createElement('div');
        nameDiv.textContent = name;
        nameDiv.className = 'name-text';
    
        const emailDiv = document.createElement('div');
        emailDiv.textContent = email;
        emailDiv.className = 'email-text';
    
        contentDiv.appendChild(nameDiv);
        contentDiv.appendChild(emailDiv);
    
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = () => deleteContact(id, li);
    
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        document.getElementById('contact-list').appendChild(li);
    }
    

    function deleteContact(id, liElement) {
        const authToken = localStorage.getItem('authToken');
        fetch(`https://localhost:7019/api/v1/Contacts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete contact');
            }
            liElement.remove();
        })
        .catch(error => {
            console.error('Error deleting contact:', error);
            alert('Failed to delete contact: ' + error.message);
        });
    }

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
    
        // Remove the message after 5 seconds
        setTimeout(function() {
            document.body.removeChild(messageDiv);
        }, 5000);
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
        document.body.appendChild(messageDiv);
    
        // Remove the message after 5 seconds
        setTimeout(function() {
            document.body.removeChild(messageDiv);
        }, 5000);
    }
    

    // Fetch and display contacts as soon as the page is ready
    fetchContacts();
});
