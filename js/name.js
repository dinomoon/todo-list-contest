const greetingText = document.querySelector('#greeting');
const nameForm = document.querySelector('#name-form');
const nameInput = nameForm.querySelector('input');

const getName = () => {
  return localStorage.getItem('name') || '';
};

const saveName = (name) => {
  localStorage.setItem('name', name);
};

const greeting = (name) => {
  if (name === '') {
    greetingText.innerText = `안녕하세요. 이름을 입력해주세요`;
  } else {
    greetingText.innerText = `${name}님 오늘 하루도 화이팅입니다!`;
  }
};

const handleNameSubmit = (e) => {
  e.preventDefault();
  const name = nameInput.value;
  if (name === '') {
    alert('💥💥💥');
    return;
  }
  greeting(name);
  saveName(name);
  nameForm.classList.add('none');
  todoInput.focus();
};

const loadGreeting = () => {
  const name = getName();
  if (name === '') {
    nameForm.classList.remove('none');
  } else {
    nameForm.classList.add('none');
  }
  greeting(name);
};

function init() {
  nameForm.addEventListener('submit', handleNameSubmit);
  loadGreeting();
}

init();
