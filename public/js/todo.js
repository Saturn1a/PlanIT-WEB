document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todo-items');
    const addItemInput = document.getElementById('new-todo-item');

    if (!todoList || !addItemInput) {
        console.error('Essential element not found!');
        return;
    }

    addItemInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const value = addItemInput.value.trim();
            if (value) {
                addTodo(value);
                addItemInput.value = '';  // Clear input after adding
            }
        }
    });

    function addTodo(Name) {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Todos/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authToken
            },
            body: JSON.stringify({ name: Name }), // Adjusted to match server expectations
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data && data.id && data.name) { // Adjusted to match the ToDoDTO structure
                createTodoElement(data.id, data.name);
            } else {
                throw new Error('Invalid todo data received');
            }
        })
        .catch(error => {
            console.error('Error adding todo:', error);
            alert('Failed to add todo: ' + error.message);  // Show user-friendly error message
        });
    }

    function fetchTodos() {
        const authToken = localStorage.getItem('authToken');
        fetch('https://localhost:7019/api/v1/Todos?pageNr=1&pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch todos: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Todo data:', data); // Add this to see what data is actually returned
            todoList.innerHTML = '';  // Clear the list before appending new items
            data.forEach(todo => {
                createTodoElement(todo.id, todo.name); // Adjusted to correct property name
            });
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
            alert('Failed to load todos: ' + error.message);
        });
    }

    function createTodoElement(id, name) {
        const li = document.createElement('li');
        li.textContent = name; // Display the name

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-button';
        deleteBtn.onclick = () => deleteTodo(id, li);

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    function deleteTodo(id, liElement) {
        const authToken = localStorage.getItem('authToken');
        fetch(`https://localhost:7019/api/v1/Todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete the todo');
            }
            liElement.remove();
        })
        .catch(error => {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo: ' + error.message);  // Show user-friendly error message
        });
    }

    // Initialize fetching todos when page loads
    fetchTodos();
});




// document.addEventListener('DOMContentLoaded', function() {
//     const todoList = document.getElementById('todo-items');
//     const addItemInput = document.getElementById('new-todo-item');

//     if (!addItemInput) {
//         console.error('The input element was not found!');
//         return;
//     }

//     addItemInput.addEventListener('keydown', function(event) {
//         if (event.key === 'Enter') {
//             event.preventDefault();
//             const value = addItemInput.value.trim();
//             if (value) {
//                 addTodo(value);
//                 addItemInput.value = '';  // Clear input after adding
//             }
//         }
//     });

//     function addTodo(description) {
//         fetch('https://localhost:7019/api/v1/Todo/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             body: JSON.stringify({ name: description }), // Adjusted to match server expectations
//             credentials: 'include'
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data && data.id && data.name) { // Adjusted to match the ToDoDTO structure
//                 createTodoElement(data.id, data.name);
//             } else {
//                 throw new Error('Invalid todo data received');
//             }
//         })
//         .catch(error => {
//             console.error('Error adding todo:', error);
//             alert('Failed to add todo: ' + error.message);  // Show user-friendly error message
//         });
//     }

//     function fetchTodos() {
//         fetch('https://localhost:7019/api/v1/Todo?pageNr=1&pageSize=10', {
//             method: 'GET',
//             credentials: 'include'
//         })
//         .then(response => response.json())
//         .then(data => {
//             data.forEach(todo => {
//                 createTodoElement(todo.id, todo.description);
//             });
//         })
//         .catch(error => console.error('Error fetching todos:', error));
//     }

//     function createTodoElement(id, name) { // Updated to use name instead of description
//         const li = document.createElement('li');
//         li.textContent = name; // Display the name

//         const deleteBtn = document.createElement('button');
//         deleteBtn.textContent = 'Delete';
//         deleteBtn.onclick = () => deleteTodo(id, li);

//         li.appendChild(deleteBtn);
//         todoList.appendChild(li);
//     }

//     function deleteTodo(id, liElement) {
//         fetch(`https://localhost:7019/api/v1/Todo/${id}`, {
//             method: 'DELETE',
//             credentials: 'include'
//         })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Failed to delete the todo');
//             }
//             liElement.remove();
//         })
//         .catch(error => {
//             console.error('Error deleting todo:', error);
//             alert('Failed to delete todo: ' + error.message);  // Show user-friendly error message
//         });
//     }

//     // Initialize fetching todos when page loads
//     fetchTodos();
// });