document.addEventListener("DOMContentLoaded", function() {
    const {startDate, endDate} = getCurrentWeekDateRange();
    loadWeeklyDinners(startDate, endDate);
});

document.getElementById("submitDinners").addEventListener("click", function() {
    const dinners = {
        Monday: document.getElementById("monday").value,
        Tuesday: document.getElementById("tuesday").value,
        Wednesday: document.getElementById("wednesday").value,
        Thursday: document.getElementById("thursday").value,
        Friday: document.getElementById("friday").value,
        Saturday: document.getElementById("saturday").value,
        Sunday: document.getElementById("sunday").value,
    };

    const authToken = localStorage.getItem('authToken');

    fetch('https://localhost:7019/api/v1/Dinner/register-weekly-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({weeklyPlanDTO: dinners})

    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log('Success:', data);
        const {startDate, endDate} = getCurrentWeekDateRange();
        loadWeeklyDinners(startDate, endDate);
    })
    .catch((error) => console.error('Error:', error));
});

function getCurrentWeekDateRange() {
    const now = new Date();
    const first = now.getDate() - now.getDay() + 1; // Calculate Monday
    const last = first + 6; // Calculate Sunday

    const monday = new Date(now.getFullYear(), now.getMonth(), first).toISOString().split('T')[0];
    const sunday = new Date(now.getFullYear(), now.getMonth(), last).toISOString().split('T')[0];

    return { startDate: monday, endDate: sunday };
}

function loadWeeklyDinners(startDate, endDate) {
    const authToken = localStorage.getItem('authToken');

    fetch(`https://localhost:7019/api/v1/WeeklyDinnerPlan?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    })
    .then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.');
    })
    .then(data => displayDinners(data))
    .catch(error => console.error('Failed to load weekly dinners:', error));
}

function displayDinners(data) {
    document.getElementById("monday").value = data.Monday ? data.Monday.Name : "";
    document.getElementById("tuesday").value = data.Tuesday ? data.Tuesday.Name : "";
    document.getElementById("wednesday").value = data.Wednesday ? data.Wednesday.Name : "";
    document.getElementById("thursday").value = data.Thursday ? data.Thursday.Name : "";
    document.getElementById("friday").value = data.Friday ? data.Friday.Name : "";
    document.getElementById("saturday").value = data.Saturday ? data.Saturday.Name : "";
    document.getElementById("sunday").value = data.Sunday ? data.Sunday.Name : "";
}
