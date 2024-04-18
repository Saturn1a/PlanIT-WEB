document.addEventListener('DOMContentLoaded', function() {
    const addItemInput = document.getElementById('new-todo-item');
    const todoList = document.getElementById('todo-items');

    // Load existing todos on page load
    fetchTodos();

    // Event listener for adding a new todo item by pressing Enter
    addItemInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTodo(addItemInput.value); // Add the todo
            addItemInput.value = ''; // Clear input after adding
            event.preventDefault(); // Prevent form submission if it's part of a form
        }
    });

    // Fetch all todos
    function fetchTodos() {
        fetch('api/v1/Todo', { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
                data.forEach(todo => {
                    createTodoElement(todo.id, todo.description);
                });
            })
            .catch(error => console.error('Error fetching todos:', error));
    }

    // Add a new todo
    function addTodo(description) {
        if (!description.trim()) return; // Prevent adding empty todos
        fetch('api/v1/Todo/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ description: description }),
            credentials: 'include'
        })
        .then(response => response.json())
        .then(todo => {
            createTodoElement(todo.id, todo.description);
        })
        .catch(error => console.error('Error adding todo:', error));
    }

    // Create a todo list item element
    function createTodoElement(id, description) {
        const li = document.createElement('li');
        li.textContent = description;

        // Delete button for the todo
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() { deleteTodo(id, li); };

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    // Delete a todo
    function deleteTodo(id, liElement) {
        fetch(`api/v1/Todo/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                liElement.remove();
            }
        })
        .catch(error => console.error('Error deleting todo:', error));
    }
});