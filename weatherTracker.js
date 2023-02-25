// import { weatherApiKey } from "./config.js";

// Defining variables for latitude and longitude
var lat;
var lon;

// Adding the Leaflet Map to the HTML element with id "map"
var map = L.map('mapid').setView([0, 0], 7);

// Capturing user input as a location
const query = prompt("Please enter your location");

// Adding the base layer to the map using the ArcGIS service
L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

getWeatherData();

// Async function to retrieve the weather based on the user's query
async function getWeatherData() {

    try {

        const response = await fetch(`http://127.0.0.1:3000/query?query=${query}`);

        const data = await response.json();
        var lat = data.lat;
        var lon = data.lon;
        
        // Setting the map view to the retrieved latitude and longitude
        map.setView([lat, lon], 6);

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
    mapLayers[i].tile = L.tileLayer(`https://tile.openweathermap.org/map/${mapLayers[i]["layerName"]}/{z}/{x}/{y}.png?appid=${process.env.OPENWEATHER_API_KEY}`, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
}

// Getting all buttons in the HTML document
var layerBtnDiv = document.getElementById("layer-selector");
var button = layerBtnDiv.getElementsByTagName("button");

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
