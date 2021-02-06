const infoBtn = document.querySelector('.info');
const closeBtn = document.querySelector('.close');

infoBtn.addEventListener('click', showPopup);
closeBtn.addEventListener('click', closePopup);

function showPopup() {
  const popup = document.querySelector('#popup');
  popup.classList.remove('hide');
}

function closePopup() {
  const popup = document.querySelector('#popup');
  popup.classList.add('hide');
}
