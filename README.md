# Building a Weather App Utilizing Third Party API's

I built this program to understand how Python and Javascript work with API's, and to share my understanding and work process with others.

I documented:
- [The tools I used](#tools) (regardless of whether I kept them for the final version)
- [My step-by-step process](#process) (mistakes included) 
- [My troublehsooting process](#trouble)

___
<h2 id="contents">Contents</h2>

___
- [Completed Features](#features)
- [Tools I Used](#tools)
- [Process](#process)
- [Troubleshooting](#trouble)
    - [Trouble finding and connecting a reliable geocoding API](#geocoding)
        - [Unsuccessful attempt with server-side proxy](#proxy)
        - [Successful attempt with proxy + Nominatim API](#nominatim)
- [Upcoming Features](#upcoming)

<h2 id="features">Completed Features</h2>

[Return to Contents ^](#contents)

___
- [x] Convert program to JavaScript
- ~~[x] Search by zip code~~
- ~~[ ] Search by city name~~
- [x] Search by free-form query
- [x] Build a webpage to host the script
    - [x] Build UI to display map, current weather, climate charts, and forecast 
- [x] Map of queried location
    - [x] precipitation
    - [x] cloud cover
    - [x] temperature

<h2 id="tools">Tools I Worked with To Build This Project</h2>

[Return to Contents ^](#contents)
___
- Python
- JavaScript
- [Openweather's API's](https://openweathermap.org/)
    - Geocoding API
    - Current weather API
    - 5 day forecast API
    - Map layers API
- [Nominatim API](https://nominatim.org/release-docs/develop/api/Search/) 
- Jupyter Notebook
- jQuery
- Axios
- Leaflet
- Bootstrap
- Node.js/Express


<h2 id="process">Process</h2>

[Return to Contents ^](#contents)

___
I initially built a simple version of this in [Python](https://github.com/phillipashford/weather-tracker/blob/main/weather_tracker.py), which I ran in a Jupyter notebook. 
- It captured user input (geo. coordinates or zipcode)
- Used the values supplied by the user to make GET Requests to Openweather's API
- Received the API's responses
- Worked with the responses to make additional requests if necessary
- Finally, reported back (current weather, and 5 day forecast) to the user. 

After deciding to make a complete weather application, I converted the code to [JavaScript](https://github.com/phillipashford/weather-tracker/blob/main/weather_tracker.js) to add [more features](#upcoming).

### Steps I Took

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
        1. Built server-side [proxy](#proxy)
            1. Initialized new Node.js project and installed the Express framework
            1. Defined proxy endpoint
            1. Wrote http request/response logic in Express app
            1. Edited client-side jquery http requests to communicate with the server-side proxy
        1. Changed GET request library from jQuery to Axios
        1. Replaced Openweather geocodoing API with [Nominatim API](#nominatim)
1. Build [webpage](https://github.com/phillipashford/weather-tracker/blob/main/index.html).



<h2 id="trouble">Troubleshooting</h2>

[Return to Contents ^](#contents)
___
<h3 id="geocoding">Trouble finding and connecting a reliable geocoding API</h3>

___
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
___
<strong><h4 id="proxy">Unsuccessful attempt with server-side proxy</h4></strong>
[Return to Contents ^](#contents)
___

I decided to do this with Node.js and Express because I have a fullstack Javascript certification working with the MEANstack and that's the server option I'm most familiar with.

After building the proxy, I successfully received responses from 3 of the API endpoints - but had a `304 not modified error` from the geocoding API request. So I deleted my browser's cache and retried, with no luck. 

Thinking perhaps the 'request' library had an issue, I updated it to no avail. Then I imported Axios and converted my GET requests to be handled by it instead of jQuery. Alas, no luck still. 
```js
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
```

After much headscratching and sifting through stackoverflow threads, I went back to my Python code and ran it again in a Jupyter notebook. This time it broke because of the GET request to the geocoding API. 

Because the other 3 API's never returned a CORS error and because the Geocoding API had worked previously server-side with my Python script, **I came to the conclusion that the problem was most likely Openweather's Geocoding API itself.**

This was very disappointing after all the effort I put into trying to work around errors that I assumed were on my end. Nevertheless, I turned my attention to finding a suitable (and reliable) geocoding API.
___
<strong><h4 id="nominatim">Successful attempt with Proxy + Nominatim API</h4></strong>
[Return to Contents ^](#contents)
___

[Nominatim](https://nominatim.org/) 'uses OpenStreetMap data to find locations on Earth by name and address (geocoding)'. 

Nominatim is free to use so long as one meets the requirements of their [usage policy] (https://operations.osmfoundation.org/policies/nominatim/). 

- Max 1 request/second (Not a problem since we're just running a single query per user request).
- Provide a valid HTTP Referer or User-Agent identifying the application (Added to Express app.)
- Clearly display attribution as suitable for your medium.
- Data is provided under the [ODbL license](https://opendatacommons.org/licenses/odbl/) which requires to share alike.

Admittedly the proxy that I built is unnecessary for my GET requests to Nominatim (and the three endpoints at Openweather that worked), but it ensures I will avoid CORS issues that may arise due to API updates in the future.

Finally! Using the Nominatim API fixed the issue! Good to know it wasn't my code but rather Openweather's API!

<h2 id="upcoming">Upcoming Features</h2>

[Return to Contents ^](#contents)

___
- [ ] Display the forecast with graphics
- [ ] Clicking on map updates data to coordinates of click
- [ ] Include webcam imagery closest to locale
- [ ] Add weather warning alerts
- [ ] Add in geolocation services
- [ ] Add climate charts (precipitation and temperature) based on historical data
- [ ] Add selection of API's for user to query from (e.g. NOAA, Openweather, NWS, etc.)