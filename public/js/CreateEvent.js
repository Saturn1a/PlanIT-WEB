// Create an event based on form input
document.getElementById("create").addEventListener("click", async () => {
    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;


    const timeWithSeconds = `${time}:00`;

    const eventData = {
        name,
        location,
        date,
        time: timeWithSeconds
    };

    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch("https://localhost:7019/api/v1/Events/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify(eventData)
            // body: JSON.stringify(eventData)
        });

        if (response.ok) {
            console.log("Event created successfully!");
        } else {
            console.error("Error creating event:", response.statusText);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
});
