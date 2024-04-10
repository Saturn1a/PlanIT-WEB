document.addEventListener('DOMContentLoaded', function() {
    generateCalendar(new Date().getMonth() + 1, new Date().getFullYear());
});

function generateCalendar(month, year) {
    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = ''; // Clear previous calendar days

    let firstDay = new Date(year, month - 1, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

    const daysInMonth = new Date(year, month, 0).getDate();

    // Create empty slots at the beginning
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('li');
        emptyDay.className = 'empty-day';
        daysContainer.appendChild(emptyDay);
    }

    // Fill in the actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayItem = document.createElement('li');
        dayItem.textContent = day;
        dayItem.className = 'day';
        daysContainer.appendChild(dayItem);
    }

    // Calculate and add empty slots at the end
    const totalSlots = firstDay + daysInMonth;
    const emptySlotsAtEnd = totalSlots % 7 ? 7 - (totalSlots % 7) : 0;
    for (let i = 0; i < emptySlotsAtEnd; i++) {
        const emptyDay = document.createElement('li');
        emptyDay.className = 'empty-day';
        daysContainer.appendChild(emptyDay);
    }
}