const todoForm = document.querySelector('#todo-form');
const todoInput = todoForm.querySelector('input');
const todoBoards = document.querySelectorAll('.todo-board');

let before = [];
let ing = [];
let finish = [];
let selected = null;
let startBoardType = null;

const saveTodo = (type, todos) => {
  localStorage.setItem(type, JSON.stringify(todos));
};

const addTodo = (type, todo) => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const button = document.createElement('span');

  let nextId = before.length + ing.length + finish.length + 1;
  const newTodo = {
    id: nextId,
    todo,
  };

  span.innerText = todo;
  button.innerHTML = '<i class="far fa-window-close"></i>';

  button.addEventListener('click', (e) => {
    const clickedBtn = e.target;
    const li = clickedBtn.parentNode.parentNode;
    const clickedBoard = li.parentNode.parentNode.id;
    li.remove();

    switch (clickedBoard) {
      case 'before':
        before = before.filter((todo) => {
          return todo.id !== parseInt(li.id);
        });
        saveTodo('before', before);
        break;
      case 'ing':
        ing = ing.filter((todo) => {
          return todo.id !== parseInt(li.id);
        });
        saveTodo('ing', ing);
        break;
      case 'finish':
        finish = finish.filter((todo) => {
          return todo.id !== parseInt(li.id);
        });
        saveTodo('finish', finish);
        break;
    }
  });

  button.addEventListener('mouseover', function () {
    button.children[0].className = 'fas fa-window-close';
  });

  button.addEventListener('mouseout', function () {
    button.children[0].className = 'far fa-window-close';
  });

  li.id = nextId;
  li.appendChild(span);
  li.appendChild(button);
  li.draggable = true;
  li.addEventListener('dragstart', dragStart);
  li.addEventListener('dragend', dragEnd);

  switch (type) {
    case 'before':
      before.push(newTodo);
      saveTodo('before', before);
      todoBoards[0].children[1].appendChild(li);
      break;
    case 'ing':
      ing.push(newTodo);
      saveTodo('ing', ing);
      todoBoards[1].children[1].appendChild(li);
      break;
    case 'finish':
      finish.push(newTodo);
      saveTodo('finish', finish);
      todoBoards[2].children[1].appendChild(li);
      break;
  }
};

// drag and drop
function dragStart() {
  this.className += ' hold';
  setTimeout(() => (this.className = 'invisible'), 0);
  selected = this;
  startBoardId = selected.parentNode.parentNode.id;
}

function dragEnd() {
  this.className = 'visible';
}

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
  if (selected.className === 'color-box') {
    this.children[1].style.backgroundColor = selected.style.backgroundColor;
    localStorage.setItem(`${this.id}Color`, selected.style.backgroundColor);
    return;
  }
  this.children[1].append(selected);

  const todo = {
    id: selected.id,
    todo: selected.children[0].textContent,
  };

  switch (this.id) {
    case 'before':
      before.push(todo);
      saveTodo('before', before);
      break;
    case 'ing':
      ing.push(todo);
      saveTodo('ing', ing);
      break;
    case 'finish':
      finish.push(todo);
      saveTodo('finish', finish);
      break;
  }
  let selectedId = parseInt(selected.id, 10);

  switch (startBoardId) {
    case 'before':
      before = before.filter((todo) => {
        return parseInt(todo.id) !== selectedId;
      });
      saveTodo('before', before);
      break;
    case 'ing':
      ing = ing.filter((todo) => {
        return parseInt(todo.id) !== selectedId;
      });
      saveTodo('ing', ing);
      break;
    case 'finish':
      finish = finish.filter((todo) => {
        return parseInt(todo.id) !== selectedId;
      });
      saveTodo('finish', finish);
      break;
  }
}

const loadTodos = () => {
  const before = JSON.parse(localStorage.getItem('before'));
  const ing = JSON.parse(localStorage.getItem('ing'));
  const finish = JSON.parse(localStorage.getItem('finish'));
  if (before !== null) {
    before.forEach((todo) => {
      addTodo('before', todo.todo);
    });
  }
  if (ing !== null) {
    ing.forEach((todo) => {
      addTodo('ing', todo.todo);
    });
  }
  if (finish !== null) {
    finish.forEach((todo) => {
      addTodo('finish', todo.todo);
    });
  }
};

const loadColors = () => {
  for (let i = 0; i < todoBoards.length; i++) {
    if (localStorage.getItem(`${todoBoards[i].id}Color`)) {
      todoBoards[i].children[1].style.backgroundColor = localStorage.getItem(
        `${todoBoards[i].id}Color`,
      );
    }
  }
};

const handleTodoSubmit = (e) => {
  e.preventDefault();
  const todo = todoInput.value;
  if (todo === '') {
    alert('💥💥💥');
    return;
  }
  addTodo('before', todo);
  todoInput.value = '';
};

function init() {
  todoForm.addEventListener('submit', handleTodoSubmit);
  loadTodos();
  loadColors();
}

init();
