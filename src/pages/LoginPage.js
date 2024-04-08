document.getElementById('login-btn').addEventListener('click', function(e) {
    e.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var loginData = {
        Email: email,
        Password: password
    };

    fetch('https://localhost:7019/api/v1/authentication/login', { 
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
        alert('Login successful! Token: ' + data.Token);
        // Lagre token for senere bruk, f.eks. i sessionStorage
        // sessionStorage.setItem('authToken', data.Token);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});