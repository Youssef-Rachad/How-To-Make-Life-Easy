// Selectors
//querySelector() returns the first Element within the document that matches the specified selector
//const saveButton = document.querySelector('.save-button');
const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const filterOption = document.querySelector('.filter-todo')

// Event Listeners

//wait for the page to load
if( document.readyState !== 'loading' ) {
    getTodos();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        getTodos();
    });
}
//When we click on a button, an action will happen
//saveButton.addEventListener('click', saveTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('change', filterTodo);


// Functions
//Console log all of the todos saved
// function saveTodos(event){
//     event.preventDefault();
//     console.log("THE LIST BEGINS");
//     let length = document.getElementsByClassName('todo-list')[0].getElementsByTagName("li").length;
//     for (let n = 0; n < length; n++) {
//         console.log(document.getElementsByClassName('todo-list')[0].getElementsByTagName("li")[n].innerText);
        
//     }
//     console.log("TERMINUS!!")
// }
//This function allows you to add a entry
function addTodo(event){
    event.preventDefault();         //Prevent form from submitting, it'll have nowhere to go

    if(todoInput.value === "") {
        console.log("The input is empty");
    }
    else {
    
        if(duplicateTodoCheck(todoInput.value) != "duplicate") {
            //create the physical todo entry
            const todoDiv = document.createElement("div");
            todoDiv.classList.add("todo");

            const newTodo = document.createElement("li");
            newTodo.innerText = todoInput.value;
            newTodo.classList.add("todo-item");
            todoDiv.appendChild(newTodo);

            saveLocalTodos(todoInput.value);

            const completedButton = document.createElement("button");
            completedButton.innerHTML = '<i class="fa fa-check"></i>';
            completedButton.classList.add("completed-btn")
            todoDiv.appendChild(completedButton);
            
            const deletedButton = document.createElement("button");
            deletedButton.innerHTML = '<i class="fa fa-trash"></i>';
            deletedButton.classList.add("deleted-btn")
            todoDiv.appendChild(deletedButton);
            //add the todo to the list
            todoList.appendChild(todoDiv);
            todoInput.value = "";

        }

    }

}
//This function allows you to delete a todo
function deleteCheck(e) {
    const item = e.target;
    if(item.classList[0] === "deleted-btn") {
        const todo = item.parentElement;
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function(){
            todo.remove();
        });
    }
    //The easiest way to mark if completed or not since we are checking on the state of the todo
    if(item.classList[0] === "completed-btn") {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
        markCompleted(todo);
    }
}
//This function allows the browser to recognise the state of a todo
function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;

            case "completed":
                if(todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                }
                else {
                    todo.style.display = "none";
                }
                break;

            case "uncompleted":
                if(!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                }
                else {
                    todo.style.display = "none";
                }
                break;
        }
    })

}
//This funtion stores the todos in LOCAL STORAGE
function saveLocalTodos(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    
    let data = {
        todo: todo,
        status: "uncompleted"
    };
    todos.push(data);
    localStorage.setItem('todos', JSON.stringify(todos));
}
//Load the todos from LOCAL STORAGE and into the list
function getTodos() {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    todos.forEach(function(todo){

        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");

        const newTodo = document.createElement("li");
        newTodo.innerText = todo["todo"];
        newTodo.classList.add("todo-item");
        todoDiv.appendChild(newTodo);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fa fa-check"></i>';
        completedButton.classList.add("completed-btn")
        todoDiv.appendChild(completedButton);
        
        const deletedButton = document.createElement("button");
        deletedButton.innerHTML = '<i class="fa fa-trash"></i>';
        deletedButton.classList.add("deleted-btn")
        todoDiv.appendChild(deletedButton);

        todoList.appendChild(todoDiv);
        let status = todo.status;
        if(status === "completed") {
            todoDiv.classList.toggle("completed");
            console.log(status);
        }
    });
}
//When we delete a todo, we want it GONE
//This allows us to remove it from LOCAL STORAGE
function removeLocalTodos(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    let index = todos.findIndex(obj => obj.todo==todoIndex);
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}
//This is how we mark a duplicate for the function: addTodo(event)
function duplicateTodoCheck(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    for (var i = 0; i < todos.length; i++){
        if (todos[i]["todo"] === todo) {
            return "duplicate";
        }
    }
}

function markCompleted(todo) {
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    const todoIndex = todo.children[0].innerText;
    let index = todos.findIndex(obj => obj.todo==todoIndex);
    if(todos[index].status === "uncompleted") {
        todos[index].status = "completed";
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    else {
        todos[index].status = "uncompleted";
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}