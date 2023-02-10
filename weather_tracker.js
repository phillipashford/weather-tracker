// Imports

import { weatherApiKey } from "./config.js";


var lat;
var lon;

// Capture user input
var query = prompt("Please enter your location");

// Adding the Leaflet Map
var map = L.map('map').setView([0, 0], 7);

//Base Layer
L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
            maxZoom: 16
            }).addTo(map);



axios.get('http://127.0.0.1:3000/proxy', {
    params: {
        url: `https://nominatim.openstreetmap.org/?addressdetails=1&q=${query}&format=json&limit=1`
    }
})
.then(function (response) {
    var lat = response.data[0].lat;
    var lon = response.data[0].lon;

    map.setView([lat, lon], 7);

    getWeather(lat, lon);
    getForecast(lat, lon);
    getMapLayers(lat, lon);
})
.catch(function (error) {
    console.error(error);
});


async function getWeather(lat, lon) {

  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`;

  try {
      const response = await axios.get('http://127.0.0.1:3000/proxy', {
          params: {
              url: url
          }
      });
      console.log(response.data);
      console.log(`Current Conditions | ${response.data.weather[0].description}`);
  } catch (error) {x
      console.error(error);
      console.log(error.message);
  }
  
}

async function getForecast(lat, lon) {
  try {
      const response = await axios.get('http://127.0.0.1:3000/proxy', {
          params: {
              url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`
          }
      });
      for (var i = 0; i < response.data.list.length; i++) {
          console.log(`${response.data.list[i].dt_txt} | ${response.data.list[i].weather[0].description} with a temperature of ${response.data.list[i].main.temp} degrees Fahrenheit.`);
      }
  } catch (error) {
      console.error(error);
      console.log(error.message);
  }
}


async function getMapLayers(lat, lon) {
    try {




        const openWeatherLayers = ["clouds_new", "precipitation_new", "temp_new"];          

        ///Openweather Layer Template
        L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
                    maxZoom: 19,
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    }).addTo(map);
        
    } catch (error) {
        console.error(error);
        console.log(error.message);
    }

}

  