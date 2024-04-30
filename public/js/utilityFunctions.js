
// Calculate the current week's date range based on a provided date
function getCurrentWeekDateRange(date) {
    let dayOfWeek = date.getDay();
    let diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() + diffToMonday);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    return { 
        startDate: firstDayOfWeek.toISOString().split('T')[0], 
        endDate: lastDayOfWeek.toISOString().split('T')[0] 
    };
}

function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000 + 1; // +1 to include the start day
    return Math.ceil(pastDaysOfYear / 7);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    // const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const month = date.toLocaleString('en-US', { month: 'long' }); // Gets the full month name
    const year = date.getFullYear();
    const day = date.getDate();

    // Construct the date with the format "Month DaySuffix Year"
    return `${month} ${getDaySuffix(day)} ${year}`;
}


function getDaySuffix(day) {
    let suffix = day > 3 && day < 21 ? 'th' : 
                 day % 10 === 1 ? "st" : 
                 day % 10 === 2 ? "nd" : 
                 day % 10 === 3 ? "rd" : "th";
    console.log(`Suffix for day ${day}: ${suffix}`);
    return day + suffix;
}


function insertDateInOrder(newLi, newDate) {
    const items = datesList.children;
    let inserted = false;
    for (let i = 0; i < items.length; i++) {
        const existingDate = items[i].getElementsByClassName('date-text')[0].textContent.replace('DATE: ', '');
        if (new Date(newDate) < new Date(formatDate(existingDate))) {
            datesList.insertBefore(newLi, items[i]);
            inserted = true;
            break;
        }
    }
    if (!inserted) { // If it's the latest date or the first item
        datesList.appendChild(newLi);
    }
}