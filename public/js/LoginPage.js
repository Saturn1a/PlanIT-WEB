
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
        console.log(data);
        if (data && data.token) { 
            localStorage.setItem('authToken', data.token); // Store the token
            window.location.href = 'home.html'; // Redirect to the home page on success
        } else {
            throw new Error('Token not found in response'); 
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        errorMessage.textContent = error.message; // Display the error message on the page
        errorMessage.style.color = 'red'; 
    });
});