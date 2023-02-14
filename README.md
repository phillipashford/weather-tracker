# A Weather Web App Reporting Data from 3rd Party API's

This weather web application was built using JavaScript, Node.js/Express, Leaflet, and Bootstrap. The purpose of this project was to understand how JavaScript works with API's and to document the process for others to learn from.

## Contents
- Features
- Tools Used
- Process
- Troubleshooting
    - Geocoding API
- Upcoming Features

## Features
- Search by free-form query: The user can enter a free-form location query and the program will retrieve weather data for that location.
- Interactive Map: A map of the queried location is displayed, showing precipitation, cloud cover, and temperature.
- Current Weather and 5-Day Forecast: The program uses API's to retrieve the current weather and 5 day forecast for the queried location.
- User-Friendly UI: The application was designed with a user-friendly interface to display the map, current weather, climate charts, and forecast.


## Tools Used
- JavaScript
- Openweather API's
    - Current weather API
    - 5 day forecast API
    - Map layers API
- Nominatim API (for geocoding)
- Leaflet
- Bootstrap
- Node.js/Express

## Process
The application was initially built in Python in a Jupyter Notebook and then converted to JavaScript to add more features. The process also involved troubleshooting a geocoding API error, and building a web page.

The user can enter a free-form query and the program uses API's to retrieve the current weather and 5 day forecast for the queried location. A map of the location is also displayed, showing precipitation, cloud cover, and temperature.

## Troubleshooting
Initially, Openweather's geocoding API was used successfully with Python, but was reponding with errors after conversion to JavaScript (inconsistently 403, 404, or CORS).

After several unsuccessful attempts to use third-party proxy services, I even built my own server-side proxy with Node.js/Express to bypass potential CORS restrictions and ensure reliable API requests. However I was still unable to receive a response from Openweather's geocoding API. 

After much effort and troubleshooting, I double checked the previously successful (and unchanged) Python script, and received the same errors there. I concluded that the problem was most likely that Openweather's geocoding API is unreliable. I finally resolved the issue by using the Nominatim API. I kept the server-side proxy to ensure future third-party API updates do not cause CORS issues.

## Upcoming Features
- Display the forecast with graphics
- Clicking on map updates data to coordinates of click
- Include webcam imagery closest to locale
- Add weather warning alerts
- Add in geolocation services
- Add climate charts (precipitation and temperature) based on historical data
- Add selection of API's for user to query from (e.g. NOAA, Openweather, NWS, etc.)
- Combined API weather and forecasts
