document.getElementById('login-btn').addEventListener('click', function(e) {
    e.preventDefault();

    const errorMessage = document.getElementById('error-message');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password
    };

    fetch('https://localhost:7019/api/v1/Authentication/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data); // Debug output to see what is received
        if (data && data.token) { // Make sure this matches the key "token" exactly as it appears in the response
            localStorage.setItem('authToken', data.token); // Store the token
            window.location.href = 'home.html'; // Redirect to the home page on success
        } else {
            throw new Error('Token not found in response'); // Handle cases where the token is not present
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        errorMessage.textContent = error.message; // Display the error message on the page
        errorMessage.style.color = 'red'; // Make the error message visually distinct
    });
});