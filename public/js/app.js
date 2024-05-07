
// logout
document.addEventListener('DOMContentLoaded', (event) => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('authToken'); // Removes token from sessionStorage
            window.location.href = 'index.html'; // Reverts back to login page
        });
    }
});