const bcColorBtn = document.querySelector('#bc-color-btn');
const bcWrapper = document.querySelector('.bc-wrap');
const body = document.querySelector('body');

bcColorBtn.addEventListener('click', () => {
  bcWrapper.style.display = 'block';
});

body.addEventListener('click', (e) => {
  if (e.target.id !== 'bc-color-btn') {
    bcWrapper.style.display = 'none';
  }
});
