const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const PORT = 3000;

app.get('/query', async (req, res) => {
  try {
    const query = req.query.query;
    const url = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${query}&format=json&limit=1`;
    const response = await axios.get(url);
    const data = response.data;
    const lat = data[0].lat;
    const lon = data[0].lon;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;
    // // Make the API call to OpenWeatherMap using axios
    const weatherResponse = await axios.get(weatherUrl);
    const weatherData = weatherResponse.data;
    res.send(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
