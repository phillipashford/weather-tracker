import { weatherApiKey } from "./config.js";

// Defining variables for latitude and longitude
var lat;
var lon;

// Adding the Leaflet Map to the HTML element with id "map"
var map = L.map('map').setView([0, 0], 7);

// Capturing user input as a location
var query = prompt("Please enter your location");

// Adding the base layer to the map using the ArcGIS service
L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// Making an API request to retrieve coordinates from the user's location query
fetch('http://127.0.0.1:3000/proxy?url=' + encodeURIComponent(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${query}&format=json&limit=1`))
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        
        // Setting the map view to the retrieved latitude and longitude
        map.setView([lat, lon], 7);

        // Getting the current weather and forecast for the location
        getWeather(lat, lon);
        getForecast(lat, lon);
    })
    .catch(function (error) {
        console.error(error);
    });

// Async function to retrieve the current weather from the OpenWeatherMap API
async function getWeather(lat, lon) {

    // Defining the URL for the API request
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`;

    try {
        const response = await fetch('http://127.0.0.1:3000/proxy?url=' + encodeURIComponent(url));
        const data = await response.json();

        // Logging the weather data and a description of the current conditions
        console.log(data);
        console.log(`Current Conditions | ${data.weather[0].description}`);
    } catch (error) {
        console.error(error);
        console.log(error.message);
    }

}

// Async function to retrieve the weather forecast from the OpenWeatherMap API
async function getForecast(lat, lon) {

    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`

    try {
        const response = await fetch('http://127.0.0.1:3000/proxy?url=' + encodeURIComponent(url));
        const data = await response.json();

        // Looping through the list of forecast data and logging the date, time, weather description, and temperature
        for (var i = 0; i < data.list.length; i++) {
            console.log(`${data.list[i].dt_txt} | ${data.list[i].weather[0].description} with a temperature of ${data.list[i].main.temp} degrees Fahrenheit.`);
        }
    } catch (error) {
        console.error(error);
        console.log(error.message);
    }
}

// Array of layer types for the map
var layerType = ["clouds", "temp", "precipitation"];

// Array to store the map layer objects
var mapLayers = [
];

// Loop to populate mapLayer objects with information for each layer type 
for (var i = 0; i < layerType.length; i++) {

    mapLayers.push({});

    // Adding the button ID for each layer
    mapLayers[i].buttonID = `${layerType[i]}-button`;

    // Adding the layer name for each layer
    mapLayers[i].layerName = `${layerType[i]}_new`;

    // Adding the tile layer for each layer using the OpenWeatherMap API
    mapLayers[i].tile = L.tileLayer(`https://tile.openweathermap.org/map/${mapLayers[i]["layerName"]}/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
}

// Getting all buttons in the HTML document
var button = document.getElementsByTagName("button");

// Loop to add click event listeners to each button
for (var i = 0; i < button.length; i++) {

    let layer = i;
    button[i].addEventListener("click", function () { displayLayer(layer) });

}

// Variable to keep track of the currently active layer
var activeLayer;

// Function to display the selected layer on the map
function displayLayer(layer) {

    if (activeLayer == undefined) {

        mapLayers[layer].tile.addTo(map);
        button[layer].classList.add("active");
        button[layer].ariaPressed = true; // WORKING? Maybe just through bootstrap.js
        activeLayer = layer;

    } else if (layer == activeLayer) {

        mapLayers[layer].tile.removeFrom(map);
        button[layer].classList.remove("active");
        button[layer].ariaPressed = false; // NOT WORKING
        activeLayer = undefined;

    } else {

        mapLayers[activeLayer].tile.removeFrom(map);
        button[activeLayer].classList.remove("active");
        button[activeLayer].ariaPressed = false; // NOT WORKING
        
        mapLayers[layer].tile.addTo(map);
        button[layer].classList.add("active");
        button[layer].ariaPressed = true; // WORKING? Maybe just through bootstrap.js
        activeLayer = layer;

    }
}
