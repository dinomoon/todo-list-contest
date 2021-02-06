const clock = document.querySelector('#clock');

const getTime = () => {
  const date = new Date();
  let hour = date.getHours();
  let min = date.getMinutes();
  let sec = date.getSeconds();
  let session = 'AM';

  if (hour > 12) {
    hour = hour - 12;
    session = 'PM';
  }

  hour = hour === 0 ? 12 : hour;
  hour = hour < 10 ? `0${hour}` : hour;
  min = min < 10 ? `0${min}` : min;
  sec = sec < 10 ? `0${sec}` : sec;

  clock.innerHTML = `${hour}:${min}:${sec} ${session}`;
};

function init() {
  setInterval(getTime, 1000);
}

init();
