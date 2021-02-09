const todoForm = document.querySelector('#todo-form');
const todoInput = todoForm.querySelector('input');
const todoBoards = document.querySelectorAll('.todo-board');
const editBtns = document.querySelectorAll('.fa-edit');

let before = [];
let ing = [];
let finish = [];
let selected = null;
let startBoardType = null;

// saveTodo: local storage에 저장
const saveTodo = (type, todos) => {
  localStorage.setItem(type, JSON.stringify(todos));
};

// editTitle: todo board 제목 수정
const editTitle = (e) => {
  const parent = e.target.parentNode;
  const editBtn = e.target;
  const text = parent.children[0].textContent;
  parent.children[0].innerHTML = `<input type="text" value="${text}"/>`;
  // checkbox 만들어서 넣기
  const i = document.createElement('i');
  i.className = 'far fa-check-square';
  i.addEventListener('mouseover', function () {
    i.className = 'fas fa-check-square';
  });
  i.addEventListener('mouseout', function () {
    i.className = 'far fa-check-square';
  });
  const input = parent.children[0].children[0];
  if (typeof input.selectionStart == 'number') {
    input.selectionStart = input.selectionEnd = input.value.length;
    input.focus();
  } else if (typeof input.createTextRange != 'undefined') {
    input.focus();
    var range = input.createTextRange();
    range.collapse(false);
    range.select();
  }
  i.addEventListener('click', (e) => {
    const editText = e.target.parentNode.children[0].children[0].value;
    switch (parent.parentNode.id) {
      case 'before':
        localStorage.setItem('beforeTitle', editText);
        break;
      case 'ing':
        localStorage.setItem('ingTitle', editText);
        break;
      case 'finish':
        localStorage.setItem('finishTitle', editText);
        break;
      default:
        return;
    }
    parent.children[0].innerHTML = editText;
    editBtn.className = 'far fa-edit';
    parent.appendChild(editBtn);
    // checkbox 삭제
    e.target.remove();
  });
  e.target.parentNode.appendChild(i);
  // edit button 삭제
  e.target.remove();
};

for (editBtn of editBtns) {
  editBtn.addEventListener('click', editTitle);
  editBtn.addEventListener('mouseover', (e) => {
    e.target.className = 'fas fa-edit';
  });
  editBtn.addEventListener('mouseout', (e) => {
    e.target.className = 'far fa-edit';
  });
}

// deleteTodo: todo 삭제
function deleteTodo(type, compare) {
  switch (type) {
    case 'before':
      before = before.filter((todo) => {
        return parseInt(todo.id) !== parseInt(compare.id);
      });
      saveTodo('before', before);
      break;
    case 'ing':
      ing = ing.filter((todo) => {
        return parseInt(todo.id) !== parseInt(compare.id);
      });
      saveTodo('ing', ing);
      break;
    case 'finish':
      finish = finish.filter((todo) => {
        return parseInt(todo.id) !== parseInt(compare.id);
      });
      saveTodo('finish', finish);
      break;
  }
}

// addTodo: 화면에 todo추가
const addTodo = (type, todo) => {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const deleteBtn = document.createElement('i');

  let nextId = before.length + ing.length + finish.length + 1;
  const newTodo = {
    id: nextId,
    todo,
  };
  span.innerText = todo;
  deleteBtn.className = 'far fa-window-close';

  // 삭제 버튼만들고 이벤트 추가
  deleteBtn.addEventListener('click', (e) => {
    const clickedBtn = e.target;
    const li = clickedBtn.parentNode;
    const clickedBoard = li.parentNode.parentNode.id;
    li.classList.add('deleted');
    li.addEventListener('transitionend', () => {
      li.remove();
    });
    deleteTodo(clickedBoard, li);
  });

  deleteBtn.addEventListener('mouseover', function () {
    deleteBtn.className = 'fas fa-window-close';
  });

  deleteBtn.addEventListener('mouseout', function () {
    deleteBtn.className = 'far fa-window-close';
  });

  // li, ul에 추가
  li.id = nextId;
  li.appendChild(span);
  li.appendChild(deleteBtn);
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
  this.className = 'hold';
  setTimeout(() => (this.className = 'invisible'), 0);
  selected = this;
  console.log(this);
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
  this.classList.add('hovered');
}

function dragLeave() {
  this.classList.remove('hovered');
}

function dragDrop(e) {
  this.classList.remove('hovered');
  if (selected.className === 'color-box') {
    this.children[1].style.backgroundColor = selected.style.backgroundColor;
    localStorage.setItem(`${this.id}Color`, selected.style.backgroundColor);
    return;
  }
  this.children[1].append(selected);

  const todo = {
    id: parseInt(selected.id),
    todo: selected.children[0].textContent,
  };
  deleteTodo(startBoardId, selected);
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
  if (before == null || ing == null || finish == null) {
    return;
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

const loadTodoTitle = () => {
  const beforeTitle = localStorage.getItem('beforeTitle');
  const ingTitle = localStorage.getItem('ingTitle');
  const finishTitle = localStorage.getItem('finishTitle');

  if (beforeTitle !== null) {
    todoBoards[0].children[0].children[0].innerText = beforeTitle;
  } else {
    localStorage.setItem('beforeTitle', '시작 전');
  }
  if (ingTitle !== null) {
    todoBoards[1].children[0].children[0].innerText = ingTitle;
  } else {
    localStorage.setItem('ingTitle', '하는 중');
  }
  if (finishTitle !== null) {
    todoBoards[2].children[0].children[0].innerText = finishTitle;
  } else {
    localStorage.setItem('finishTitle', '완료');
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
  loadTodoTitle();
}

init();
