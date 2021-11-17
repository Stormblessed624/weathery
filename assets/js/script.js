var cities = [];
var searchForm = document.querySelector("#search-city");
var inputEl = document.querySelector("#city-name");
var weatherContainer = document.querySelector("#current-city-container");
var titleCityName = document.querySelector("#subtitle");
var forecastTitle = document.querySelector("#forecast");
var foreContainer = document.querySelector("#five-container");
var pastButton = document.querySelector("#past-button")

function getWeather(city) {
    var api = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=afae4319fa1019c142d85c5c40401962"

    fetch(api).then(function (response) {
        response.json().then(function (data) {
            displayWeather(data, city)
        });
    });
};

function formSubmit(event) {
    event.preventDefault();
    var city = inputEl.value.trim();

    if (city) {
        getWeather(city);
        fetchForecast(city);
        cities.unshift({ city });
        inputEl.value = "";
    } else {
        alert("Please enter a city");
    }

    saveSearch();
    newCityList();
}

function saveSearch() {
    localStorage.setItem("cities", JSON.stringify(cities));
}


function displayWeather(weather, searched) {
    // clear old input
    weatherContainer.textContent = "";
    titleCityName.textContent = searched;

    // display city name and current date
    var date = document.createElement("span");
    date.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    titleCityName.appendChild(date);


    // display icon from api/create image
    var icon = document.createElement("img");
    icon.setAttribute("src", "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png");
    titleCityName.appendChild(icon);

    // temperature, wind, humidity, creating span
    var temp = document.createElement("span");
    temp.classList = "weather-list"
    var wind = document.createElement("span");
    wind.classList = "weather-list"
    var humid = document.createElement("span");
    humid.classList = "weather-list"

    temp.textContent = "Temp: " + weather.main.temp + " °F"
    wind.textContent = "Wind: " + weather.wind.speed + " MPH"
    humid.textContent = "Humidity: " + weather.main.humidity + " %"

    // append temp, wind, humid
    weatherContainer.appendChild(temp)
    weatherContainer.appendChild(wind)
    weatherContainer.appendChild(humid)

    var lon = weather.coord.lon;
    var lat = weather.coord.lat;
    getUV(lat, lon);

}

function getUV(lat, lon) {
    var uvApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=afae4319fa1019c142d85c5c40401962"

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

    weatherContainer.appendChild(uvContainer);
}

function fetchForecast(city) {
    var castApi = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=afae4319fa1019c142d85c5c40401962"

    fetch(castApi).then(function (response) {
        response.json().then(function (data) {
            fiveDay(data);
        });
    });
};

function fiveDay(weather) {
    foreContainer.textContent = "";
    forecastTitle.textContent = "Five Day Forecast:";

    var cast = weather.list;
    for (var i = 5; i < cast.length; i = i + 8) {
        var daily = cast[i];

        var castContain = document.createElement("div")
        castContain.classList = "card m-2";

        var castDate = document.createElement("h3");
        castDate.textContent = moment.unix(daily.dt).format("MMM D, YYYY");
        castDate.classList = "card-header text-center";
        castContain.appendChild(castDate);

        var castIcon = document.createElement("img");
        castIcon.classList = "card-body text-center";
        castIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + daily.weather[0].icon + ".png");
        castContain.appendChild(castIcon);

        var foreTemp = document.createElement("span");
        foreTemp.classList = "card-body text-center";
        foreTemp.textContent = "Temp: " + daily.main.temp + " °F";

        castContain.appendChild(foreTemp);

        var foreSpeed = document.createElement("span");
        foreSpeed.classList = "card-body text-center";
        foreSpeed.textContent = "Wind: " + daily.wind.speed + " MPH";

        castContain.appendChild(foreSpeed);

        var foreHum = document.createElement("span");
        foreHum.classList = "card-body text-center";
        foreHum.textContent = "Humidity: " + daily.main.humidity + " %";

        castContain.appendChild(foreHum);

        foreContainer.appendChild(castContain);
    }
}



const newCityList = function(){
    var oldCity = JSON.parse(window.localStorage.getItem("cities"));
    var cityList = [];
    oldCity.forEach(element => cityList.push(element.city));
    var button = document.createElement("button")
    // grabs city name from local storage, and appends it to the button element
    button.append(cityList[0])
    button.classList = "btn btn-primary p-2 w-100"
    button.setAttribute("data-city", cityList[0])
    button.setAttribute("type", "submit")
    // appends button to the button container
    pastButton.appendChild(button)

}


function pastHandler(event) {
    var city = event.target.getAttribute("data-city")
    if(city){
        getWeather(city);
        fetchForecast(city);
    }
} 

searchForm.addEventListener("submit", formSubmit);
pastButton.addEventListener("click", pastHandler);