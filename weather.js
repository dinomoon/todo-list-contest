const weather = document.querySelector('#weather');

const API_KEY = '2d268c34de856bb078a27eee3855539f';
const COORDS = 'coords';

const getWeather = (lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const temp = json.main.temp;
      const place = json.name;
      weather.innerText = `${temp} @${place}`;
    });
};

const saveCoords = (coordsObj) => {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
};

const handleGeoSucces = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude,
  };
  saveCoords(coordsObj);
  getWeather(latitude, longitude);
};

const handleGeoError = () => {
  console.log('Cant access geo location');
};

const askForCoords = () => {
  navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);
};

const loadCoords = () => {
  const loadedCoords = localStorage.getItem(COORDS);
  if (loadedCoords === null) {
    askForCoords();
  } else {
    const parsedCoords = JSON.parse(loadedCoords);
    getWeather(parsedCoords.latitude, parsedCoords.longitude);
  }
};

function init() {
  loadCoords();
}

init();
