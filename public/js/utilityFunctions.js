
// Calculate the current week's date range based on a provided date
function getCurrentWeekDateRange(date) {
    let dayOfWeek = date.getDay();
    let diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;  // Adjust for Sunday being day 0

    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(date.getDate() + diffToMonday); // Set to start of this week's Monday

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Set to end of this week's Sunday

    const startDate = firstDayOfWeek.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    const endDate = lastDayOfWeek.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    return { startDate, endDate };
}


// Calculate the week number of the year for a given date
function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
