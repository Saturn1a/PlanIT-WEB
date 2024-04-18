document.addEventListener('DOMContentLoaded', function() {
    const addItemInput = document.getElementById('new-todo-item');

    if (!addItemInput) {
        console.error('The input element was not found!');
        return;
    }

    addItemInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Always call preventDefault for 'Enter'
            const value = addItemInput.value.trim();
            if (value) {
                addTodo(value);
                addItemInput.value = '';
            }
        }
    });

    // Fetch all todos
    function fetchTodos() {
        fetch('https://localhost:7019/api/v1/Todo?pageNr=1&pageSize=10', { credentials: 'include' })
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
        fetch('https://localhost:7019/api/v1/Todo/register', {
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
        fetch(`https://localhost:7019/api/v1/Todo/${id}`, {
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