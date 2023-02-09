# chatGPT prompt
# A weather tracker: Create a program that allows users to input their location and displays the current weather conditions and a 5-day forecast. The program should use an API to access current weather data and display it in a user-friendly format.

########################################
# Imports
########################################

# Import 'requests' library for making calls to the API
import requests

# Import config.py to shelter api key
import config

# Import 'json' library to work with API responses and render data in a user-friendly format
import json

########################################
# Capture user input
########################################

# Determine location format

valid_input = False

while (valid_input == False):
    
    loc_format = input('Enter 1 to use geographic coordinates for your query. Enter 2 to use a zipcode for your query. ')

    if (loc_format == "1"):

        valid_input = True

        # Search by geographic coordinates
        lat = input('Please enter your latitude. ')
        lon = input('Please enter your longitude. ')

    elif (loc_format == "2"):

        valid_input = True

        # Search by Zipcode
        zipcode = input('Please enter your zipcode. ')
        country_code = input('Please enter your country code. ')

        # Make call to OpenWeather's Geocode API, to receive zipcode's geo. coordinates in response.
        zipcode_response = requests.get(f"http://api.openweathermap.org/geo/1.0/zip?zip={zipcode},{country_code}&appid={config.weather_api_key}") 

        # Convert the response to a JSON object
        zipcode_data = zipcode_response.json()
        
        # Assign coordinate values to variables
        lat = zipcode_data["coord"]["lat"]
        lon = zipcode_data["coord"]["lon"]

    else:
        print('Please enter 1 or 2 to continue. ')

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


