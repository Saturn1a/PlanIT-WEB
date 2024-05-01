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
    const month = date.toLocaleString('en-US', { month: 'long' }); // Gets the full month name
    const year = date.getFullYear();
    const day = date.getDate();

    // Construct the date with the format "Month DaySuffix Year"
    return `${month} ${getDaySuffix(day)} ${year}`;
}

function getDaySuffix(day) {
    let suffix;
    if (day > 3 && day < 21) suffix = 'th';
    else {
        switch (day % 10) {
            case 1:  suffix = "st"; break;
            case 2:  suffix = "nd"; break;
            case 3:  suffix = "rd"; break;
            default: suffix = "th";
        }
    }
    return `${day}${suffix}`;
}