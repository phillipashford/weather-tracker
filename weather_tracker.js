// Imports

import { weatherApiKey } from "./config.js";

var lat;
var lon;

// Capture user input
var valid_input = false

while (valid_input == false) {

  let loc_format = prompt('Enter 1 to use geographic coordinates for your query. Enter 2 to use a zipcode for your query. ');

  // Determine location info format
  if (loc_format == "1") {
      
      valid_input = true;
  
      // Search by geographic coordinates
      var lat = prompt('Please enter your latitude. ');
      var lon = prompt('Please enter your longitude. ');
  
  } else if (loc_format == "2") {
  
      valid_input = true;
  
      // Search by Zipcode
      var zipcode = prompt('Please enter your zipcode. ');
      var country_code = prompt('Please enter your country code. ');
      let url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${country_code}&appid=${weatherApiKey}`;
  
      axios.get('http://127.0.0.1:3000/proxy', {
          params: {
              url: url
          }
      })
      .then(function (response) {
          var lat = response.data.coord.lat;
          var lon = response.data.coord.lon;
      })
      .catch(function (error) {
          console.error(error);
      });
            
  }  

} 

getWeather();
getForecast();
getMapLayers();

async function getWeather() {

  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`;

  try {
      const response = await axios.get('http://127.0.0.1:3000/proxy', {
          params: {
              url: url
          }
      });
      console.log(response.data);
      console.log(`Current Conditions | ${response.data.weather[0].description}`);
  } catch (error) {
      console.error(error);
      console.log(error.message);
  }
  
}

async function getForecast() {
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


function getMapLayers() {
  // Adding the Leaflet Map
var map = L.map('map').setView([lat, lon], 7);

//Base Layer
L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
              attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
              maxZoom: 16
            }).addTo(map);

const openWeatherLayers = ["clouds_new", "precipitation_new", "temp_new"];          

///Openweather Layer Template
L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
              maxZoom: 19,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

}