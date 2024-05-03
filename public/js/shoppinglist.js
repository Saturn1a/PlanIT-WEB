document.addEventListener('DOMContentLoaded', function() {
    const shoppingList = document.getElementById('shopping-items');
    const addItemInput = document.getElementById('new-shopping-item');

    if (!shoppingList || !addItemInput) {
        console.error('Essential element not found!');
        return;
    }

    addItemInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const value = addItemInput.value.trim();
            if (value) {
                addShopping(value);
                addItemInput.value = '';  // Clear input after adding
            }
        }
    });

    function addShopping(Name) {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/ShoppingLists/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({ name: Name }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.id && data.name) {
                createShoppingElement(data.id, data.name);
            } else {
                throw new Error('Invalid shopping item data received');
            }
        })
        .catch(error => {
            console.error('Error adding shopping item:', error);
            alert('Failed to add shopping item: ' + error.message);
        });
    }

    function fetchShoppingList() {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/ShoppingLists?pageNr=1&pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
               throw new Error('Failed to fetch shopping list: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Shopping list data:', data);
            shoppingList.innerHTML = '';  // Clear the list before appending new items
            data.forEach(item => {
                createShoppingElement(item.id, item.name);
            });
        })
        .catch(error => {
            console.error('Error fetching shopping list:', error);
            // alert('Failed to load shopping list: ' + error.message);
        });
    }

    function createShoppingElement(id, name) {
        const li = document.createElement('li');
        li.textContent = name; // Display the name

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = () => deleteShoppingList(id, li);

        li.appendChild(deleteBtn);
        shoppingList.appendChild(li);
    }

    function deleteShoppingList(id, liElement) {
        const authToken = localStorage.getItem('authToken');
        fetch(`https://localhost:7019/api/v1/ShoppingLists/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the shopping list item');
            }
            liElement.remove();
        })
        .catch(error => {
            console.error('Error deleting shopping list item:', error);
            alert('Failed to delete shopping list item: ' + error.message);
        });
    }

    // Initialize fetching shopping list when page loads
    fetchShoppingList();
});
