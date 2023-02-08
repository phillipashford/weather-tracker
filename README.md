# Working with [Open Weather's API](https://openweathermap.org/) with Python and JavaScript

A weather application, using the OpenWeather API.

I initially built a simple version of this in [Python](https://github.com/phillipashford/weather-tracker/blob/main/weather_tracker.py), which I ran in a Jupyter notebook. 
- It captures user input (geo. coordinates or zipcode)
- Uses the values supplied by the user to make GET Requests to Openweather's API
- Receives the API's responses
- Works with the responses to make additional requests if necessary
- Finally, reports back (current weather, and 5 day forecast) to the user. 

After deciding to make a complete weather application, I converted the code to [JavaScript](https://github.com/phillipashford/weather-tracker/blob/main/weather_tracker.js) to add [more features](#improvements).

<h2 id="contents">Contents</h2>

___
- [Upcoming and Completed Improvements](#improvements)
- [Tools I Used](#tools)
- [Process](#process)
- [Troubleshooting](#trouble)
    - [Openweather geocoding API error response](#geocoding-error)

<h2 id="improvements">Upcoming and Completed Improvements</h2>

[Return to Contents ^](#contents)

___
- [x] Convert program to JavaScript
- [x] Search by zip code
- [x] Build a webpage to host the script
    - [ ] Build UI to display map, current weather, climate charts, and forecast 
    - [ ] Display the forecast with graphics
    - [ ] Clicking on map updates data to coordinates of click
- [ ] Search by city name
- [x] Map of queried location
    - [x] precipitation
    - [x] cloud cover
    - [x] temperature
- [ ] Include webcam imagery closest to locale
- [ ] Add weather warning alerts
- [ ] Add climate charts (precipitation and temperature) based on historical data
- [ ] Add selection of API's for user to query from (e.g. NOAA, Openweather, NWS, etc.)

<h2 id="tools">Tools I Used</h2>

[Return to Contents ^](#contents)
___
- Openweather's API's
    - Geocoding API
    - Current weather API
    - 5 day forecast API
    - Map layers API
- jQuery
- Leaflet
- Bootstrap
- Node.js/Express


<h2 id="process">Process</h2>

[Return to Contents ^](#contents)

___

1. Write [Python script](https://github.com/phillipashford/weather-tracker/blob/main/weather_tracker.py).
1. Convert to JavaScript.
    1. Accidental API key exposure to public repo
        1. Deactivated exposed key on Openweather's dashboard
        1. Replaced naked key with variable in js file
        1. Pushed changes to repo
        1. Doublechecked all project code for exposed keys
        1. Generated new key at Openweather
        1. Replaced old key with new key in config file.
        1. Added config file to gitignore
    1. [Troubleshoot geocoding API error](#trouble)
        1. Checked syntax/endpoint/variables
        1. Made proxy requests
        1. Built server-side proxy
1. Create server-side proxy.
    1. Initialized new Node.js project and installed the Express framework
    1. 
1. Shifting from jQuery to Axios for API requests
1. Create server with Node.js and Express.
1. Build [webpage](https://github.com/phillipashford/weather-tracker/blob/main/index.html).



<h2 id="trouble">Troubleshooting</h2>

[Return to Contents ^](#contents)
___
<h3 id="geocoding-error">Errors in Openweather's Geocoding API response</h3>

In running Python in a Notebook, [Openweather's geocoding API](https://openweathermap.org/api/geocoding-api) endpoint worked flawlessly in returning a GET response.

```py
# Make call to Openweather's Geocode API, to receive zipcode's geo. coordinates in response.
zipcode_response = requests.get(f"http://api.openweathermap.org/geo/1.0/zip?zip={zipcode},{country_code}&appid={config.weather_api_key}") 

```

But with client-side Javascript, when I wrote the same request...
```js
// Request geo coords based on provided zipcode

$.ajax({
    type: 'GET',
    url: `https://api.openweathermap.org/geo/1.0/zip?zip=${zipcode},${country_code}&appid=${weatherApiKey}`,
    success: function(data) {
    
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    // ...follow up GET requests for current weather and forecast

    },
    error: function(error) {
    console.error(error);
    }
});
```
...I was met with a 404 error.

This surprised me because the other three API's that I'd sent requests to returned no errors. So, I... 
- Checked my syntax
- Checked the URL endpoint against the API docs
- Double checked my variable assignments. 

And everything checked out. Since, as I mentioned above, the request to this same endpoint was receiving a good response in Python on the server side, **I realized the error was probably due to a CORS restriction**. So I...
- Made three attempts to use a third party proxy server to bypass any possible CORS restrictions.
    - The first service returned a 404 error
    - The second service returned a 403 error
    - The third service returned a CORS error.

No luck with third parties, so **I decided I needed to create a server-side proxy to bypass any CORS restrictions** that Openweather had in place.

I decided to do this with Node.js and Express because I have a fullstack Javascript certification working with the MEANstack and that's the server option I'm most familiar with.