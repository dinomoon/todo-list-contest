const sidebar = document.querySelector('.sidebar');
const title = sidebar.querySelector('h3');
const p = sidebar.querySelector('p');
const toggleBtn = document.querySelector('.toggle');

toggleBtn.addEventListener('click', function () {
  sidebar.classList.toggle('active');
  if (sidebar.classList.contains('active')) {
    toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
    bcWrap.style.right = '1rem';
  } else {
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    bcWrap.style.right = '-300px';
  }
});
