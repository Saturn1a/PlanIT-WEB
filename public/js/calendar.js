let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let monthSelect; 
let yearSelect;
const months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

document.addEventListener('DOMContentLoaded', function() {
    monthSelect = document.getElementById('month-select');
    yearSelect = document.getElementById('year-select');

    // Populate month dropdown
    months.forEach((month, index) => {
        const option = new Option(month, index);
        monthSelect.add(option);
    });

    // Populate year dropdown
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        const option = new Option(i, i);
        yearSelect.add(option);
    };

    // Set initial values
    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;

    monthSelect.addEventListener('change', function() {
        currentMonth = parseInt(this.value);
        renderCalendar(currentMonth, currentYear);
    });

    yearSelect.addEventListener('change', function() {
        currentYear = parseInt(this.value);
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById('prev-month').addEventListener('click', () => navigateMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => navigateMonth(1));

    renderCalendar(currentMonth, currentYear); // Initial calendar rendering
});

function navigateMonth(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;
    renderCalendar(currentMonth, currentYear);
}


function renderCalendar(month, year) {
    const daysContainer = document.querySelector('.days');
    daysContainer.innerHTML = '';

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start if your week starts on Monday

    let daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create empty slots at the beginning
    for (let i = 0; i < firstDay; i++) {
        daysContainer.appendChild(document.createElement('li')).className = 'empty-day';
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
        daysContainer.appendChild(document.createElement('li')).className = 'empty-day';
    }
}