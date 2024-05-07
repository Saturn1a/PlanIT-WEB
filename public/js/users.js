document.addEventListener("DOMContentLoaded", function() {
    fetchUserProfile(true); 
    bindFormEvent();
    
    
    document.getElementById('delete-button').addEventListener('click', function() {
        // Show the custom modal
        document.getElementById('custom-modal').style.display = 'block';
    });
    
    // Add event listener to confirm deletion
    document.getElementById('confirm-delete').addEventListener('click', function() {
        deleteUser();
        // Hide the modal after confirmation
        document.getElementById('custom-modal').style.display = 'none';
    });

    // Add event listener to cancel deletion
    document.getElementById('cancel-delete').addEventListener('click', function() {
        // Hide the modal if the user cancels
        document.getElementById('custom-modal').style.display = 'none';
    });
});

function fetchUserProfile(displayError) {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error("No token available.");
        if (displayError) {
            displayError("Please log in to view your profile.");
        }
        return;
    }

    fetch('https://localhost:7019/api/v1/Users/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                console.error('Unauthorized access. Session may be invalid or expired.');
                if (displayError) {
                    displayError("Unauthorized access. Please verify if your session is still valid.");
                }
                return;
            }
            throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(user => {
        if (!user) {
            throw new Error('User data is undefined.');
        }
        displayUserProfile(user);
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
        if (displayError) {
            displayError(error.message);
        }
    });
}

function displayUserProfile(user) {
    document.getElementById('name').value = user.name || ''; 
    document.getElementById('email').value = user.email || ''; 
}

function deleteUser() {
    const token = localStorage.getItem('authToken');

    fetch('https://localhost:7019/api/v1/Users/', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete user. Status: ' + response.status);
        }
        // Remove token from local storage
        localStorage.removeItem('authToken');
        displaySuccessMessage('User deleted successfully.');
        // Redirect to index.html after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000); 
        return response.json();
    })
    .then(data => {
        // Handle successful deletion
        console.log('User deleted successfully');
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        displayErrorMessage('Failed to delete user.');
    });
}

function bindFormEvent() {
    const form = document.getElementById('registration-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            document.getElementById('email-error-message').textContent = "Please enter a valid email address!";
            return;
        } else {
            document.getElementById('email-error-message').textContent = "";
        }

        if (name.length < 3) {
            document.getElementById('name-error-message').textContent = "Enter a name over 3 characters!";
            return;
        } else {
            document.getElementById('name-error-message').textContent = "";
        }

        const userData = { name, email };
        const token = localStorage.getItem('authToken');

        fetch('https://localhost:7019/api/v1/Users/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user information. Status: ' + response.status);
            }
            displaySuccessMessage('User information updated successfully.');
            // Reload the page after successful update
            setTimeout(() => {
                location.reload();
            }, 3000); 
            return response.json();
        })
        .then(data => {
            // Handle successful update
            console.log('User information updated successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            displayErrorMessage('Failed to update user information.');
        });
    });
}

function displayError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';  // Ensures the error message is visible
}

function displaySuccessMessage(message, duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.color = 'green';
    messageDiv.style.backgroundColor = 'lightgreen';
    messageDiv.style.padding = '10px';
    messageDiv.style.marginTop = '10px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';

    const form = document.getElementById('registration-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling);

    setTimeout(() => {
        messageDiv.remove(); // Remove the message after the specified duration
    }, duration);
}


function displayErrorMessage(message, duration = 3000) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.color = 'red';
    messageDiv.style.backgroundColor = 'pink';
    messageDiv.style.padding = '10px';
    messageDiv.style.marginTop = '10px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';

    const form = document.getElementById('registration-form');
    form.parentNode.insertBefore(messageDiv, form.nextSibling); 

    setTimeout(() => {
        messageDiv.remove(); // Remove the message after the specified duration
    }, duration);
}
