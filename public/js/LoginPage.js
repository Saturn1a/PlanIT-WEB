
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
        errorMessage.style.color = 'red'; // Make the error message visually distinct
    });
});




// document.getElementById('login-btn').addEventListener('click', function(e) {
//     e.preventDefault();

//     const errorMessage = document.getElementById('error-message');
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     const loginData = {
//         email: email,
//         password: password
//     };

//     fetch('https://localhost:7019/api/v1/Authentication/login', { 
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(loginData),
//         credentials: 'include' // Viktig for å sikre at cookies sendes med forespørselen og mottas fra serveren
//     })
//     .then(response => {
//         if (!response.ok) {
//             // Handle non-JSON responses before attempting to parse JSON
//             return response.text().then(text => {
//                 throw new Error(text || 'Login failed due to server error');
//             });
//         }
//         return response.json(); // Only parse JSON if the response was OK
//     })
//     .then(data => {
//         console.log('Success:', data);
//         window.location.href = 'home.html'; // Redirect on success
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         errorMessage.textContent = error.message;
//         errorMessage.style.color = 'red';
//     });
// });