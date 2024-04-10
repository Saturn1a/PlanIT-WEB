let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('prev-month').addEventListener('click', function() {
        navigateMonth(-1);
    });
    document.getElementById('next-month').addEventListener('click', function() {
        navigateMonth(1);
    });
    renderCalendar(currentMonth, currentYear); // Call renderCalendar here with initial values
});

function navigateMonth(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }
    renderCalendar(currentMonth, currentYear);
}

function renderCalendar(month, year) {
    updateCalendarTitle(month, year); // Update the calendar title with the new month and year
    
    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = ''; // Clear previous calendar days
    
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
    
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Corrected to month + 1

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

    // Calculate and add empty slots at the end, if needed, to keep layout uniform
    const totalSlots = firstDay + daysInMonth;
    const emptySlotsAtEnd = totalSlots % 7 ? 7 - (totalSlots % 7) : 0;
    for (let i = 0; i < emptySlotsAtEnd; i++) {
        const emptyDay = document.createElement('li');
        emptyDay.className = 'empty-day';
        daysContainer.appendChild(emptyDay);
    }
}

function updateCalendarTitle(month, year) {
    const calendarTitle = document.querySelector('#calendar-container h3');
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    calendarTitle.textContent = `${monthNames[month]} ${year}`;
}