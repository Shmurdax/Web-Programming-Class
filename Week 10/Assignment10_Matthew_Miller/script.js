const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error-msg");
const resultDiv = document.getElementById("weather-result");

const cityNameDisplay = document.getElementById("display-city");
const weatherIconDisplay = document.getElementById("weather-icon");
const temperatureDisplay = document.getElementById("temperature");
const conditionDisplay = document.getElementById("condition");
const humidityDisplay = document.getElementById("humidity");
const windDisplay = document.getElementById("wind-speed");


// I got these weather codes and descriptions from the Open-Meteo themselves so that it works properly
const weatherCodes = {
    0: { desc: "Clear sky", icon: "☀️" },
    1: { desc: "Mainly clear", icon: "🌤️" },
    2: { desc: "Partly cloudy", icon: "⛅" },
    3: { desc: "Overcast", icon: "☁️" },
    45: { desc: "Fog", icon: "🌫️" },
    48: { desc: "Depositing rime fog", icon: "🌫️" },
    51: { desc: "Light drizzle", icon: "🌦️" },
    53: { desc: "Moderate drizzle", icon: "🌦️" },
    55: { desc: "Dense drizzle", icon: "🌧️" },
    61: { desc: "Light rain", icon: "🌧️" },
    63: { desc: "Moderate rain", icon: "🌧️" },
    65: { desc: "Heavy rain", icon: "🌧️" },
    71: { desc: "Light snow fall", icon: "❄️" },
    73: { desc: "Moderate snow fall", icon: "❄️" },
    75: { desc: "Heavy snow fall", icon: "❄️" },
    80: { desc: "Light rain showers", icon: "🌦️" },
    81: { desc: "Moderate rain showers", icon: "🌦️" },
    82: { desc: "Violent rain showers", icon: "🌧️" },
    85: { desc: "Light snow showers", icon: "❄️" },
    86: { desc: "Heavy snow showers", icon: "❄️" },
    95: { desc: "Thunderstorm", icon: "⛈️" },
    96: { desc: "Thunderstorm with hail", icon: "⛈️" },
    99: { desc: "Thunderstorm with heavy hail", icon: "⛈️" }
};

const getWeatherInfo = (code) => {
    return weatherCodes[code];
};

const showError = (message) => {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    resultDiv.style.display = "none";
};

const hideError = () => {
    errorDiv.style.display = "none";
};

const showLoading = () => {
    loadingDiv.style.display = "flex";
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
};

const hideLoading = () => {
    loadingDiv.style.display = "none";
    searchBtn.disabled = false;
    searchBtn.textContent = "Get Weather";
};

const displayWeather = (city, temp, humidity, wind, condition, icon) => {
    cityNameDisplay.textContent = "📍 " + city;
    weatherIconDisplay.textContent = icon;
    
    temperatureDisplay.innerHTML = "Temperature: <strong>" + temp + "</strong>";
    conditionDisplay.innerHTML = "Condition: <strong>" + condition + "</strong>";
    humidityDisplay.innerHTML = "Humidity: <strong>" + humidity + "%</strong>";
    windDisplay.innerHTML = "Wind: <strong>" + wind + " mph</strong>";
    
    resultDiv.style.display = "block";
};

const fetchWeather = () => {
    console.log("🔍 Starting search...");

    const city = cityInput.value.trim();
    
    if (city === "") {
        showError("Please enter a city name");
        return;
    }
    
    hideError();
    showLoading();

    let displayCityName;

    const geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city);
    
    fetch(geoUrl)
        .then((response) => {
            if (!response.ok) throw new Error("Geocoding failed");
            return response.json();
        })
        
        .then((geoData) => {
            console.log("📍 Geocoding data received:", geoData);
            
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("city-not-found");
            }
            
            const location = geoData.results[0];
            const lat = location.latitude;
            const lon = location.longitude;
            
            displayCityName = location.name;
            if (location.admin1) {
                displayCityName += ", " + location.admin1;
            }
            
            const weatherUrl = "https://api.open-meteo.com/v1/forecast?" +
                "latitude=" + lat +
                "&longitude=" + lon +
                "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m" +
                "&temperature_unit=fahrenheit" +
                "&wind_speed_unit=mph" +
                "&timezone=auto";
            
            return fetch(weatherUrl);
        })
        .then((response) => {
            return response.json();
        })
        .then((weatherData) => {
            console.log("🌤️ Weather data received:", weatherData);
            
            const current = weatherData.current;
            const temperature = current.temperature_2m;
            const humidity = current.relative_humidity_2m;
            const windSpeed = current.wind_speed_10m;
            const weatherCode = current.weather_code;
            
            const weatherInfo = getWeatherInfo(weatherCode);
            
            hideLoading();
            displayWeather(displayCityName, temperature, humidity, windSpeed, weatherInfo.desc, weatherInfo.icon);
        })
        .catch((error) => {
            console.error("❌ Error occurred:", error);
            hideLoading();
            
            if (error.message === "city-not-found") {
                showError("City not found. Please check the spelling and try again.");
            } else {
                showError("Unable to fetch weather data. Please check your connection and try again.");
            }
        });
};

searchBtn.addEventListener("click", fetchWeather);

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeather();
    }
});

window.addEventListener("load", () => {
    cityInput.focus();
});