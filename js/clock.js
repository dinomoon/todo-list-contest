const time = document.querySelector('#time');
const dateWrap = document.querySelector('#date');

const getTime = () => {
  const date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let session = 'AM';
  let month = date.getMonth() + 1;
  let _date = date.getDate();
  let dayArray = ['일', '월', '화', '수', '목', '금', '토'];
  let day = dayArray[date.getDay()];

  if (hour > 12) {
    hour = hour - 12;
    session = 'PM';
  }

  hour = hour === 0 ? 12 : hour;
  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;

  time.innerHTML = `${hour} : ${min} ${session}`;
  dateWrap.innerHTML = `${month}월 ${_date}일 ${day}요일`;
};

function init() {
  setInterval(getTime, 1000);
}

init();
