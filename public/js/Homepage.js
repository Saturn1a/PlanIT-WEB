document.addEventListener('DOMContentLoaded', function() {
    const todoList = document.getElementById('todo-items'); // Ensure this element is defined
    const addItemInput = document.getElementById('new-todo-item'); // Input for adding new todo

    if (!addItemInput) {
        console.error('The input element was not found!');
        return;
    }

    addItemInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission with Enter key
            const value = addItemInput.value.trim();
            if (value) {
                addTodo(value);
                addItemInput.value = ''; // Clear the input after adding
            }
        }
    });

    function fetchTodos() {
        fetch('https://localhost:7019/api/v1/Todo?pageNr=1&pageSize=10', { credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(todo => {
                    createTodoElement(todo.id, todo.description);
                });
            })
            .catch(error => console.error('Error fetching todos:', error));
    }

    function addTodo(description) {
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
            if (todo && todo.id && todo.description) {
                createTodoElement(todo.id, todo.description);
            } else {
                throw new Error('Invalid todo data received');
            }
        })
        .catch(error => console.error('Error adding todo:', error));
    }

    function createTodoElement(id, description) {
        const li = document.createElement('li');
        li.textContent = description;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() { deleteTodo(id, li); };

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    function deleteTodo(id, liElement) {
        fetch(`https://localhost:7019/api/v1/Todo/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                liElement.remove();
            } else {
                throw new Error('Failed to delete the todo.');
            }
        })
        .catch(error => console.error('Error deleting todo:', error));
    }

    // Initialize fetching todos when page loads
    fetchTodos();
});