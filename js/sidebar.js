const sidebar = document.querySelector('.sidebar');
const toggleBtn = sidebar.querySelector('.toggle');
const resetBtn = sidebar.querySelector('.reset');
const fontWrap = sidebar.querySelector('.fonts');
const fonts = sidebar.querySelectorAll('.font');

toggleBtn.addEventListener('click', function () {
  if (sidebar.classList.contains('active')) {
    closeNav();
  } else {
    openNav();
  }
  sidebar.classList.toggle('active');
});

function openNav() {
  sidebar.style.width = '316px';
  toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
  bcWrap.style.right = '1rem';
  fontWrap.style.right = '50%';
  fontWrap.style.transform = 'translateX(50%)';
}

function closeNav() {
  sidebar.style.width = '0';
  toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
  bcWrap.style.right = '-300px';
  fontWrap.style.right = '-200px';
}

resetBtn.addEventListener('click', (e) => {
  const real = confirm('정말 초기화하시겠어요?');
  if (real) {
    localStorage.clear();
    window.location.reload();
  } else {
    return;
  }
});

// font

for (font of fonts) {
  const fontName = font.classList[1];
  font.addEventListener('click', (e) => {
    body.style.fontFamily = fontName;
    for (font of fonts) {
      font.classList.remove('current-font');
    }
    e.target.classList.add('current-font');
    localStorage.setItem('font', fontName);
  });
}

function loadFont() {
  const currentFont = localStorage.getItem('font');
  if (currentFont !== null) {
    body.style.fontFamily = currentFont;
    sidebar.querySelector(`.${currentFont}`).classList.add('current-font');
  } else {
    localStorage.setItem('font', 'malang');
    sidebar.querySelector('.malang').classList.add('current-font');
  }
}

function init() {
  loadFont();
}

init();
