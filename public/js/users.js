document.addEventListener("DOMContentLoaded", function() {
    fetchUserProfile();
    bindFormEvent();
});

function fetchUserProfile() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error("No token available. Please log in again.");
        displayError("Session has expired. Please log in again.");  // Display error message on the page
        return;
    }

    fetch('https://localhost:7019/api/v1/Users/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 401) {
            console.error('Unauthorized access. Session may be invalid or expired.');
            displayError("Your session has expired or is invalid. Please log in again."); // Friendly error message
            sessionStorage.clear();
            return;
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
        }
        return response.json();
    })
    .then(user => {
        if (user) {
            displayUserProfile(user);
        } else {
            throw new Error('User data is undefined.');
        }
    })
    .catch(error => {
        console.error('Error fetching user profile:', error);
        displayError("An error occurred while fetching profile data. Please try again.");  // Friendly user message
    });
}

function displayUserProfile(user) {
    document.getElementById('profile-name').textContent = user.name || 'Name not available';
    document.getElementById('profile-email').textContent = user.email || 'Email not available';
}

function displayError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';  // Make sure this element is visible
}

function bindFormEvent() {
    document.getElementById('registration-form').addEventListener('submit', function(e) {
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

        fetch('https://localhost:7019/api/v1/Users/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user information. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('update-success-message').textContent = "Updated user information successfully.";
            // Redirect to login page or profile page after a delay
            setTimeout(() => {
                window.location.href = 'user.html'; // redirect back to the profile page or another relevant page
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('update-success-message').textContent = "Failed to update user.";
        });
    });
}