document.addEventListener("DOMContentLoaded", function() {
    fetchUserProfile();
    bindFormEvent();
});

function fetchUserProfile() {
    const token = localStorage.getItem('authToken');
    console.log("Retrieved token:", token);  // Log to verify the token

    if (!token) {
        console.error("No token available.");
        displayError("Please log in to view your profile.");
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
                displayError("Unauthorized access. Please verify if your session is still valid.");
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
        displayError(error.message);  // Displays the error message based on the caught exception
    });
}

function displayUserProfile(user) {
    document.getElementById('profile-name').textContent = user.name || 'Name not available';
    document.getElementById('profile-email').textContent = user.email || 'Email not available';
}

function displayError(message) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';  // Ensures the error message is visible
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
            return response.json();
        })
        .then(data => {
            document.getElementById('update-success-message').textContent = "Updated user information successfully.";
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('update-success-message').textContent = error.message;
        });
    });
}
