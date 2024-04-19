document.getElementById('login-btn').addEventListener('click', function(e) {
    e.preventDefault();

    const errorMessage = document.getElementById('error-message');

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var loginData = {
        Email: email,
        Password: password
    };

    fetch('https://localhost:7019/api/v1/Authentication/login', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => {
        if (!response.ok) {
            response.json().then(data => {
                throw new Error(data.message || 'Login failed due to server error'); // Assuming the server sends a message property
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem('authToken', data.Token);
        window.location.href = 'home.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        errorMessage.textContent = error.message; // Display more user-friendly error messages
        errorMessage.style.color = 'red'; // Make the error visually distinctive
    });
});