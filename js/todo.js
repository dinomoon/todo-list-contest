const todoForm = document.querySelector('#todo-form');
const todoInput = todoForm.querySelector('input');
const todoBoards = document.querySelectorAll('.todo-board');
const editBtns = document.querySelectorAll('.fa-edit');
const todoBoardsTitle = document.querySelectorAll('.todo-board .title');

let before = [];
let ing = [];
let finish = [];
let selected = null;
let startBoardType = null;
let isEditing = false;

// saveTodo: local storage에 저장
const saveTodo = (type, todos) => {
  localStorage.setItem(type, JSON.stringify(todos));
};

// editTitle: todo board 제목 수정
const editTitle = (e) => {
  if (isEditing === false) {
    e.stopPropagation();
    isEditing = true;
    const titleWrap = e.target.parentNode;
    const title = titleWrap.children[0];
    const editBtn = titleWrap.children[1];
    const text = title.textContent;
    const form = document.createElement('form');
    const inputElem = document.createElement('input');
    const buttonElem = document.createElement('button');

    // form 만들어서 넣기
    inputElem.value = text;
    inputElem.type = 'text';
    buttonElem.type = 'submit';
    buttonElem.className = 'far fa-check-square';
    buttonElem.addEventListener('mouseenter', () => {
      buttonElem.className = 'fas fa-check-square';
    });
    buttonElem.addEventListener('mouseleave', () => {
      buttonElem.className = 'far fa-check-square';
    });
    form.appendChild(inputElem);
    form.appendChild(buttonElem);
    titleWrap.innerHTML = '';
    titleWrap.appendChild(form);

    // titleSubmit: submit 함수
    function titleSubmit(e) {
      e.preventDefault();
      const todoBoardId = titleWrap.parentNode.id;
      const editText = inputElem.value;
      switch (todoBoardId) {
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
      titleWrap.innerHTML = '';
      const h3 = document.createElement('h3');
      h3.innerText = editText;
      titleWrap.appendChild(h3);
      editBtn.className = 'far fa-edit';
      titleWrap.appendChild(editBtn);
      isEditing = false;
    }

    form.addEventListener('submit', titleSubmit);
    editBtn.addEventListener('click', titleSubmit);

    // input에 포커스 주기
    if (typeof inputElem.selectionStart == 'number') {
      inputElem.selectionStart = inputElem.selectionEnd =
        inputElem.value.length;
      inputElem.focus();
    } else if (typeof inputElem.createTextRange != 'undefined') {
      inputElem.focus();
      var range = inputElem.createTextRange();
      range.collapse(false);
      range.select();
    }
  } else {
    return;
  }
};

// todoBoardsTitle 돌면서 이벤트 추가하기
todoBoardsTitle.forEach((todoBoardTitle) => {
  todoBoardTitle.addEventListener('click', editTitle);
  todoBoardTitle.addEventListener('mouseenter', (e) => {
    if (isEditing === false) {
      e.target.children[1].className = 'fas fa-edit';
    } else {
      return;
    }
  });
  todoBoardTitle.addEventListener('mouseleave', (e) => {
    if (isEditing === false) {
      e.target.children[1].className = 'far fa-edit';
    } else {
      return;
    }
  });
});

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
