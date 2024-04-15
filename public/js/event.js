async function getListsData() {
    try {
      // Replace 'YOUR_API_URL' with the actual URL of your API's "get all" endpoint
      const response = await fetch('https://localhost:7019/api/v1/Events?pageNr=1&pageSize=10');
      
  
      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors appropriately, like displaying an error message to the user
    }
  }

  async function populateEventsList() {
    const eventsData = await getListsData(); // Assuming your API returns events data
  
    const eventListElement = document.getElementById('eventList');
  
  
    // Loop through events data and create list items
    eventsData.forEach(event => {
      const listItem = document.createElement('li');
      listItem.textContent = event.name; // Replace with appropriate property for event name
      eventListElement.appendChild(listItem);
    });
  }
  
  // Call the populateEventsList function when the page loads
  populateEventsList();
  