import { weatherApiKey } from "./config.js";

var lat;
var lon;

// Adding the Leaflet Map
var map = L.map('map').setView([0, 0], 7);

// Capture user input
var query = prompt("Please enter your location");

//Base Layer
L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
}).addTo(map);

// API request for coordinates from user query
fetch('http://127.0.0.1:3000/proxy?url=' + encodeURIComponent(`https://nominatim.openstreetmap.org/?addressdetails=1&q=${query}&format=json&limit=1`))
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var lat = data[0].lat;
        var lon = data[0].lon;

        map.setView([lat, lon], 7);

        getWeather(lat, lon);
        getForecast(lat, lon);
    })
    .catch(function (error) {
        console.error(error);
    });


async function getWeather(lat, lon) {

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`;

    try {
        const response = await fetch('http://127.0.0.1:3000/proxy?url=' + encodeURIComponent(url));
        const data = await response.json();

        console.log(data);
        console.log(`Current Conditions | ${data.weather[0].description}`);
    } catch (error) {
        console.error(error);
        console.log(error.message);
    }

}

async function getForecast(lat, lon) {

    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`

    try {
        const response = await fetch('http://127.0.0.1:3000/proxy?url=' + encodeURIComponent(url));
        const data = await response.json();

        for (var i = 0; i < data.list.length; i++) {
            console.log(`${data.list[i].dt_txt} | ${data.list[i].weather[0].description} with a temperature of ${data.list[i].main.temp} degrees Fahrenheit.`);
        }
    } catch (error) {
        console.error(error);
        console.log(error.message);
    }
}

var layerType = ["clouds", "temp", "precipitation"];

var mapLayers = [
];

// Loop to populate mapLayer objects 
for (var i = 0; i < layerType.length; i++) {

    mapLayers.push({});

    mapLayers[i].buttonID = `${layerType[i]}-button`;

    mapLayers[i].layerName = `${layerType[i]}_new`;

    mapLayers[i].tile = L.tileLayer(`https://tile.openweathermap.org/map/${mapLayers[i]["layerName"]}/{z}/{x}/{y}.png?appid=${weatherApiKey}`, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
}

var button = document.getElementsByTagName("button");

for (var i = 0; i < button.length; i++) {
    let layer = i;
    button[i].addEventListener("click", function () { displayLayer(layer) });
}

var activeLayer;

function displayLayer(layer) {

    if (activeLayer == undefined) {

        mapLayers[layer].tile.addTo(map);
        activeLayer = layer;

    } else if (layer == activeLayer) {

        mapLayers[layer].tile.removeFrom(map);
        activeLayer = undefined;

    } else {

        mapLayers[activeLayer].tile.removeFrom(map);
        mapLayers[layer].tile.addTo(map);
        activeLayer = layer;

    }
}
