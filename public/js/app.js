
// logout
document.addEventListener('DOMContentLoaded', (event) => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('authToken'); // Fjerner token fra sessionStorage
            window.location.href = 'login.html'; // Omdirigerer tilbake til innloggingssiden
        });
    }
});