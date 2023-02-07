////////////////////////////////////////////////////////////////////////////////
// Imports
////////////////////////////////////////////////////////////////////////////////
import { weatherApiKey } from "./config.js";

////////////////////////////////////////////////////////////////////////////////
// Capture user input
////////////////////////////////////////////////////////////////////////////////
var valid_input = false

while (valid_input == false) {

    let loc_format = prompt('Enter 1 to use geographic coordinates for your query. Enter 2 to use a zipcode for your query. ')

    ////////////////////////////////////////////////////////////////////////////////
    // Determine location info format
    ////////////////////////////////////////////////////////////////////////////////
    if (loc_format == "1") {
        
        valid_input = true;

        // Search by geographic coordinates
        var lat = prompt('Please enter your latitude. ');
        var lon = prompt('Please enter your longitude. ');

        ////////////////////////////////////////////////////////////////////////////////
        // Access and return current weather conditions to user
        ////////////////////////////////////////////////////////////////////////////////
        $.ajax({
          type: 'GET',
          url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`,
          success: function(data) {
            console.log(`Current Conditions | ${data.weather[0].description}`);
            const weather = document.getElementById("Weather");
            weather.innerHTML = `${data.weather[0].description}`; 
          },
          error: function(error) {
            console.error(error);
          }
        });

        ////////////////////////////////////////////////////////////////////////////////
        // Access and return 5 day forecast to user
        ////////////////////////////////////////////////////////////////////////////////
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

        ////////////////////////////////////////////////////////////////////////////////
        // Request geo coords based on provided zipcode
        ////////////////////////////////////////////////////////////////////////////////        
        $.ajax({
          type: 'GET',
          url: `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${country_code}&appid=${weatherApiKey}`,
          success: function(data) {
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            ////////////////////////////////////////////////////////////////////////////////
            // Access and return current weather conditions to user
            ////////////////////////////////////////////////////////////////////////////////
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
    
            ////////////////////////////////////////////////////////////////////////////////
            // Access and return 5 day forecast to user
            //////////////////////////////////////////////////////////////////////////////// 
            $.ajax({
              type: 'GET',
              url: `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={config.weather_api_key}`,
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

