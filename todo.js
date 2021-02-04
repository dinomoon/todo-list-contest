const todoForm = document.querySelector('#todo-form');
const todoInput = todoForm.querySelector('input');
const todoList = document.querySelector('#todo-list');
const todoBoards = document.querySelectorAll('.todo-board');

for (const todoBoard of todoBoards) {
  todoBoard.addEventListener('dragover', dragOver);
  todoBoard.addEventListener('dragenter', dragEnter);
  todoBoard.addEventListener('dragleave', dragLeave);
  todoBoard.addEventListener('drop', dragDrop);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.className += ' hovered';
}

function dragLeave() {
  this.className = 'empty';
}

function dragDrop(e) {
  this.className = 'empty';
  this.children[1].append(selected);
}

let todos = [];
let selected = null;

const saveTodo = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const addTodo = (todo) => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const button = document.createElement('span');

  let nextId = todos.length + 1;
  const newTodo = {
    id: nextId,
    todo,
  };

  todos.push(newTodo);
  saveTodo(todos);

  span.innerText = todo;
  button.innerHTML = '<i class="far fa-window-close"></i>';

  button.addEventListener('click', (e) => {
    const clickedBtn = e.target;
    const li = clickedBtn.parentNode;
    li.remove();
    todos = todos.filter((todo) => {
      return todo.id !== parseInt(li.id);
    });

    saveTodo(todos);
  });

  li.id = nextId;
  li.appendChild(span);
  li.appendChild(button);
  li.draggable = true;
  li.addEventListener('dragstart', dragStart);
  li.addEventListener('dragend', dragEnd);
  todoList.appendChild(li);
};

function dragStart() {
  this.className += ' hold';
  setTimeout(() => (this.className = 'invisible'), 0);
  selected = this;
}

function dragEnd() {
  this.className = 'visible';
}

const loadTodos = () => {
  const parsedTodos = JSON.parse(localStorage.getItem('todos'));
  if (parsedTodos !== null) {
    parsedTodos.forEach((todo) => {
      addTodo(todo.todo);
    });
  }
};

const handleTodoSubmit = (e) => {
  e.preventDefault();
  const todo = todoInput.value;
  addTodo(todo);
  todoInput.value = '';
};

todoForm.addEventListener('submit', handleTodoSubmit);
loadTodos();
