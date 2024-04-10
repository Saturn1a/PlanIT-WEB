document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission


    const email = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email pattern
    if (!emailPattern.test(email)) {
        document.getElementById('email-error-message').textContent = "Please enter a valid email address!";
        return; // Stop the form submission
    } else {
        document.getElementById('email-error-message').textContent = ""; // Clear any existing error message
    }

    const name = document.getElementById('name').value;
    if (name < 3) {
        document.getElementById('name-error-message').textContent = "enter a namer over 3 characters!"
    }
    else {
    document.getElementById('email-error-message').textContent = ""; // Clear any existing error message
    }

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value
    };

    fetch('https://localhost:7019/api/v1/Users/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('update-success-message').textContent = "Updated user information";
        // Redirect to login page after a delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});