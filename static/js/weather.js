const weatherForm = document.querySelector("#weatherForm");
const image = document.getElementById('image');
let locations = document.getElementById('location');
let conditions = document.getElementById('conditions');
let temp = document.getElementById('temp');

weatherForm.addEventListener('submit', weatherSubmitted);

citySelection.addEventListener('click', citySelected);

function weatherSubmitted() {
    event.preventDefault();
    let city = document.getElementById('weatherInput').value
    const formattedCity = city.replace("/ /g", "%20")
    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + formattedCity + '&count=5&language=en&format=json')
        .then((response) => response.json())
        .then((data) => {
            console.log(data.results);
            for (var i = 0; i < data.results.length; i++) {
                var select = document.getElementById("options");
                var option = document.createElement("option");
                option.text = data.results[i].name + ', ' + data.results[i].admin1;
                option.value = data.results[i].id;
                select.add(option);
            }
        })
}

function citySelected() {
    let cityId = document.getElementById('options').value
    if (cityId == 'none') {
        return console.log("No City Selected");
    }
    let lon;
    let lat;
    let city;
    let weatherCode;
    fetch('https://geocoding-api.open-meteo.com/v1/get?id=' + cityId)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            lat = data.latitude;
            lon = data.longitude;
            city = data.name + ', ' + data.admin1;
            return fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m')
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            temp.innerHTML = 'Current Temperature: ' + toF(data.current.temperature_2m) + ' F ' + data.current.temperature_2m + ' C';
            weatherCode = data.current.weather_code;
            locations.innerHTML = city;
            fetch('./static/weatherCodes.json')
                .then((response) => (response.json()))
                .then((data) => {
                    conditions.innerHTML = 'Today The Weather Is ' + data[weatherCode];
                })
        })
}

function toF(celsius) {
    let F = (celsius * 1.8) + 32;
    return Math.round(F);
}