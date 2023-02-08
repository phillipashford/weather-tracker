// Imports
import { weatherApiKey } from "./config.js";

// Openweather API Endpoints
  // [0] Current weather
  // [1] 5 day forecast
  // [2] Geocoding
  // [3] Map layers
openweatherEndpoints = [
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`,
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`, 
  `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${country_code}&appid=${weatherApiKey}`, 
  `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${weatherApiKey}`

];

// Capture user input
var valid_input = false

while (valid_input == false) {

    let loc_format = prompt('Enter 1 to use geographic coordinates for your query. Enter 2 to use a zipcode for your query. ')

    // Determine location info format
    if (loc_format == "1") {
        
        valid_input = true;

        // Search by geographic coordinates
        var lat = prompt('Please enter your latitude. ');
        var lon = prompt('Please enter your longitude. ');

        // Access and return current weather conditions to user
        $.ajax({
          type: 'GET',
          url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`,
          success: function(data) {
            console.log(`Current Conditions | ${data.weather[0].description}`);
          },
          error: function(error) {
            console.error(error);
          }
        });

        // Access and return 5 day forecast to user
        $.ajax({
          type: 'GET',
          url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`,
          success: function(data) {
            for (var i = 0; i < data.list.length; i++) {
              console.log(`${data.list[i].dt_txt} | ${data.list[i].weather[0].description} with a temperature of ${data.list[i].main.temp} degrees Fahrenheit.`);
            };
          },
          error: function(error) {
            console.error(error);
          }
        });

    } else if (loc_format == "2") {

        valid_input = true;

        // Search by Zipcode
        var zipcode = prompt('Please enter your zipcode. ');
        var country_code = prompt('Please enter your country code. ');

        // Request geo coords based on provided zipcode
        $.ajax({
          type: 'GET',
          url: `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${country_code}&appid=${weatherApiKey}`,
          success: function(data) {
            
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            // Access and return current weather conditions to user
            $.ajax({
              type: 'GET',
              url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`,
              success: function(data) {
                console.log(data.weather[0].description);
              },
              error: function(error) {
                console.error(error);
              }
            });
    
            // Access and return 5 day forecast to user
            $.ajax({
              type: 'GET',
              url: `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${weatherApiKey}`,
              success: function(data) {
                console.log(data.weather[0].description);
              },
              error: function(error) {
                console.error(error);
              }
            });
    
          },
          error: function(error) {
            console.error(error);
          }
        });
              
    }

}

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

