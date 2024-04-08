document.getElementById('login-btn').addEventListener('click', function(e) {
    e.preventDefault();

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
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Lagre token i sessionStorage
        sessionStorage.setItem('authToken', data.Token);
        // Omdiriger brukeren til en ny side etter vellykket innlogging
        window.location.href = '/index.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message); // Viser en feilmelding til brukeren
    });
});