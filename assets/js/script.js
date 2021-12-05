var cities = [];
var searchForm = document.querySelector("#search-city");
var inputEl = document.querySelector("#city-name");
var weatherBlock = document.querySelector("#current-city-container");
var cityName = document.querySelector("#subtitle");
var forecastTitle = document.querySelector("#forecast");
var fullForecastContainer = document.querySelector("#five-container");
var pastButton = document.querySelector("#past-button")

function findWeather(city) {
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=44e4874934e3042ed12da2fec70c85f3"

    fetch(api).then(function (response) {
        response.json().then(function (data) {
            weatherDisplay(data, city)
        });
    });
};

function weatherDisplay(weather, searched) {
    // clear old input
    weatherBlock.textContent = "";
    cityName.textContent = searched;

    // display city name and current date
    var date = document.createElement("span");
    date.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    cityName.appendChild(date);


    // display icon from api/create image
    var icon = document.createElement("img");
    icon.setAttribute("src", "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png");
    cityName.appendChild(icon);

    // temperature, wind, humidity, creating span
    var temp = document.createElement("span");
    temp.classList = "weather-list"
    var wind = document.createElement("span");
    wind.classList = "weather-list"
    var humidity = document.createElement("span");
    humidity.classList = "weather-list"

    temp.textContent = "Temp: " + weather.main.temp + " °F"
    wind.textContent = "Wind: " + weather.wind.speed + " MPH"
    humidity.textContent = "Humidity: " + weather.main.humidity + " %"

    // append temp, wind, humid
    weatherBlock.appendChild(temp)
    weatherBlock.appendChild(wind)
    weatherBlock.appendChild(humid)

    var long = weather.coord.long;
    var lat = weather.coord.lat;
    fetchUV(lat, long);

}

function fetchUV(lat, long) {
    var uvApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&long=" + long + "&appid=afae4319fa1019c142d85c5c40401962"

    fetch(uvApi).then(function (response) {
        response.json().then(function (data) {
            uvIndex(data)
        });
    });
};

function uvIndex(data) {
    // create element for uv
    var index = data.current.uvi;
    // index container
    var uvContainer = document.createElement("div");
    uvContainer.classList = "weather-list";
    uvContainer.textContent = "UV Index: ";
    // index element
    var uv = document.createElement("span");
    uv.textContent = index;

    if (index <= 2) {
        uv.classList = "favorable"
    } else if (index > 2 && index <= 8) {
        uv.classList = "moderate"
    } else if (index > 8) {
        uv.classList = "severe"
    };

    uvContainer.appendChild(uv);

    weatherBlock.appendChild(uvContainer);
}

function fetchForecast(city) {
    var castApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=afae4319fa1019c142d85c5c40401962"

    fetch(castApi).then(function (response) {
        response.json().then(function (data) {
            fiveDayForecast(data);
        });
    });
};

function fiveDayForecast(weather) {
    fullForecastContainer.textContent = "";
    forecastTitle.textContent = "Five Day Forecast:";

    var cast = weather.list;
    for (var i = 5; i < cast.length; i = i + 8) {
        var daily = cast[i];

        var forecastContainer = document.createElement("div")
        forecastContainer.classList = "card m-2";

        var forecastDate = document.createElement("h3");
        forecastDate.textContent = moment.unix(daily.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center";
        forecastContainer.appendChild(forecastDate);

        var forecastIcon = document.createElement("img");
        forecastIcon.classList = "card-body text-center";
        forecastIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + daily.weather[0].icon + ".png");
        forecastContainer.appendChild(forecastIcon);

        var forecastTemp = document.createElement("span");
        forecastTemp.classList = "card-body text-center";
        forecastTemp.textContent = "Temp: " + daily.main.temp + " °F";

        forecastContainer.appendChild(forecastTemp);

        var forecastSpeed = document.createElement("span");
        forecastSpeed.classList = "card-body text-center";
        forecastSpeed.textContent = "Wind: " + daily.wind.speed + " MPH";

        forecastContainer.appendChild(forecastSpeed);

        var forecastHumidity = document.createElement("span");
        forecastHumidity.classList = "card-body text-center";
        forecastHumidity.textContent = "Humidity: " + daily.main.humidity + " %";

        forecastContainer.appendChild(forecastHumidity);

        fullForecastContainer.appendChild(forecastContainer);
    }
}



const newCityList = function(){
    var oldCity = JSON.parse(window.localStorage.getItem("cities"));
    var cityList = [];
    oldCity.forEach(item => cityList.push(item.city));
    var button = document.createElement("button")
    // grabs city name from local storage, and appends it to the button element
    button.append(cityList[0])
    button.classList = "btn btn-primary p-2 w-100"
    button.setAttribute("data-city", cityList[0])
    button.setAttribute("type", "submit")
    // appends button to the button container
    pastButton.appendChild(button)

}

function saveSearch() {
    localStorage.setItem("cities", JSON.stringify(cities));
}

function pastHandler(event) {
    var city = event.target.getAttribute("data-city")
    if(city){
        findWeather(city);
        fetchForecast(city);
    }
} 

function formSubmit(event) {
    event.preventDefault();
    var city = inputEl.value.trim();

    if (city) {
        findWeather(city);
        fetchForecast(city);
        cities.unshift({ city });
        inputEl.value = "";
    } else {
        alert("Please enter a city");
    }

    saveSearch();
    newCityList();
}

searchForm.addEventListener("submit", formSubmit);
pastButton.addEventListener("click", pastHandler);