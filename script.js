// Define constants for elements and API key
const API_KEY = '8e454f587d6b73ba1498482f7e996d05';
const cityNameElement = document.getElementById('city-name');
const currentWeatherDetails = document.getElementById('current-weather-details');
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const searchHistory = document.querySelector('.search-history');
const unitSwitcher = document.getElementById('unit-switcher');
let isCelsius = true;

// Function to fetch weather data for a given city
function fetchWeatherData(cityName, isCelsius) {
    const unit = isCelsius ? 'metric' : 'imperial';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch weather data');
            }
        })
        .then(weatherData => {
            displayWeatherData(weatherData, cityName);
            saveCityToLocalStorage(cityName);
            displaySearchHistory();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayWeatherData(weatherData, cityName) {
    const iconCode = weatherData.list[0].weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    const temperature = weatherData.list[0].main.temp;
    const temperatureUnit = isCelsius ? '°C' : '°F';
    const humidity = weatherData.list[0].main.humidity;
    const windSpeed = weatherData.list[0].wind.speed;
    const date = moment(weatherData.list[0].dt_txt).format('MMM DD, YYYY hh:mm A');

    cityNameElement.textContent = cityName;
    currentWeatherDetails.innerHTML = `
        <p>${date}</p>
        <img src="${iconUrl}" alt="Weather icon">
        <p>Temperature: ${temperature}${temperatureUnit}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

    for (let i = 0; i < 40; i += 8) {
        const forecastItem = weatherData.list[i];

        const date = moment(forecastItem.dt_txt).format('MMM DD, YYYY');
        const iconCode = forecastItem.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const temperature = forecastItem.main.temp;
        const humidity = forecastItem.main.humidity;

        const forecastContent = `
            <p>${date}</p>
            <img src="${iconUrl}" alt="Weather icon">
            <p>Temperature: ${temperature}${temperatureUnit}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed}m/s</p>
        `;

        document.getElementById(`day-${i / 8 + 1}`).innerHTML = forecastContent;
    }
}

function saveCityToLocalStorage(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        if (searchHistory.length > 5) {
            searchHistory.shift();
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

function displaySearchHistory() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory = searchHistory.slice(-5);
    searchHistory.reverse();
    
    const searchHistoryElement = document.querySelector('.search-history');
    searchHistoryElement.innerHTML = '';
    
    searchHistory.forEach(cityName => {
        const cityListItem = document.createElement('p');
        cityListItem.textContent = cityName;
        cityListItem.addEventListener('click', () => {
            fetchWeatherData(cityName, isCelsius);
        });
        searchHistoryElement.appendChild(cityListItem);
    });
    }
    
    function getLastSearchedCity() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (searchHistory.length > 0) {
    return searchHistory[searchHistory.length - 1];
    }
    return null;
    }
    
    const lastSearchedCity = getLastSearchedCity();
    if (lastSearchedCity) {
    fetchWeatherData(lastSearchedCity, isCelsius);
    }
    
    searchButton.addEventListener('click', () => {
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
    fetchWeatherData(cityName, isCelsius);
    }
    });
    
    cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
    event.preventDefault();
    searchButton.click();
    }
    });
    
    unitSwitcher.addEventListener('click', () => {
    isCelsius = !isCelsius;
    const currentCity = cityNameElement.textContent;
    if (currentCity) {
    fetchWeatherData(currentCity, isCelsius);
    }
    });
    
    displaySearchHistory();
