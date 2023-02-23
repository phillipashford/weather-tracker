const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route for getting coordinates based on location
// app.get('/api/coordinates', async (req, res) => {
//   try {
//     const { location } = req.query;
//     const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
//     const response = await axios.get(url);
//     const { lat, lon } = response.data[0];
//     res.json({ lat, lon });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Route for getting weather data based on coordinates
// app.get('/api/weather', async (req, res) => {
//   try {
//     const { lat, lon } = req.query;
//     const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
//     const response = await axios.get(url);
//     res.json(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Route for getting coordinates based on location
app.get('/api/coordinates', async (req, res) => {
  try {
    const { location } = req.query;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await axios.get(url);
    const { lat, lon } = response.data[0];
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;
    const weatherResponse = await axios.get(weatherUrl);
    res.json({ lat, lon, weather: weatherResponse.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
