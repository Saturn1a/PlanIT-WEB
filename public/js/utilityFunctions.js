
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