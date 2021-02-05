const bcWrap = document.querySelector('.bc-wrap');
const body = document.querySelector('body');
const colorGroups = document.querySelectorAll('.color-group');

const palette = {
  gray: ['#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd'],
  red: ['#ffe3e3', '#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b'],
  orange: ['#ffe8cc', '#ffd8a8', '#ffc078', '#ffa94d', '#ff922b'],
  yellow: ['#fff3bf', '#ffec99', '#ffe066', '#ffd43b', '#fcc419'],
  green: ['#d3f9d8', '#b2f2bb', '#8ce99a', '#69db7c', '#51cf66'],
  blue: ['#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0'],
  indigo: ['#dbe4ff', '#bac8ff', '#91a7ff', '#748ffc', '#5c7cfa'],
  violet: ['#e5dbff', '#d0bfff', '#b197fc', '#9775fa', '#845ef7'],
};

const colorName = [
  'gray',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
];

const COLOR_TYPE_LENGTH = palette.gray.length;

for (let i = 0; i < colorName.length; i++) {
  const colorGroup = document.createElement('section');
  colorGroup.className = 'color-group';
  for (let j = 0; j < COLOR_TYPE_LENGTH; j++) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = palette[colorName[i]][j];

    // click event
    colorBox.addEventListener('click', function () {
      body.style.backgroundColor = palette[colorName[i]][j];
      localStorage.setItem('body-color', palette[colorName[i]][j]);
    });

    // drag event
    colorBox.draggable = true;
    colorBox.addEventListener('dragstart', function () {
      selected = this;
    });
    colorGroup.appendChild(colorBox);
  }
  bcWrap.appendChild(colorGroup);
}

const storedColor = localStorage.getItem('body-color');
body.style.backgroundColor = storedColor;
