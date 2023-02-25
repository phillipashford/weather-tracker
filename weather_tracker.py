# chatGPT prompt
# A weather tracker: Create a program that allows users to input their location and displays the current weather conditions and a 5-day forecast. The program should use an API to access current weather data and display it in a user-friendly format.

########################################
# Imports
########################################

# Import 'requests' library for making calls to the API
import requests

# Import config.py to shelter api key
# import config

# Import 'json' library to work with API responses and render data in a user-friendly format
import json

########################################
# Capture user input
########################################


# Search by free-form query
query = input('Please enter your query. ')

# Make call to Nominatim's Geocode API, to receive zipcode's geo. coordinates in response.
query_response = requests.get(f"https://nominatim.openstreetmap.org/?addressdetails=1&q=${query}&format=json&limit=1") 

# Convert the response to a JSON object
query_data = query_response.json()

# Assign coordinate values to variables
lat = query_data[0]["lat"]
lon = query_data[0]["lon"]

########################################
# Access current weather conditions
########################################

# API Documentation: https://openweathermap.org/current

# Make call to API
response_current = requests.get(f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={config.weather_api_key}&units=metric")

# Convert the response to a JSON object
current_data = response_current.json()

# The following code can be used to prettify JSON strings and make them more readable for accessing elements within
# print(json.dumps(current_data, indent=4))

# Access the 'weather' and 'main' elements in the 'current_data' json object
current_weather = current_data['weather']
main = current_data['main']

# Display current weather conditions to user
print(f"Current conditions at your requested locale: {current_weather[0]['description'].capitalize()}")
print(f"The current temperature is {main['temp']} degrees celsius.")

########################################
# Access 5 day forecast
########################################

# API Documentation: https://openweathermap.org/forecast5

# Make call to API
response_five_day = requests.get(f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={config.weather_api_key}&units=metric")

# Convert the response to a JSON object
five_day_data = response_five_day.json()

# Access the 'list' element in the 'five_day_data' json object

forecasts = five_day_data['list']

# Display 5 day forecast to user
# Loop through the forecasts included in the JSON object, printing the date and time of the forecast, the description of the weather and the temperature to the user.

for i in range(len(forecasts)):
    weather = forecasts[i]['weather']
    forecast_main = forecasts[i]['main']
    print(f"{forecasts[i]['dt_txt']} | {weather[0]['description'].capitalize()} with a temperature of {forecast_main['temp']}" )


