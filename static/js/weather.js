
const CityForm = document.querySelector("#city-form1");
const citySelection = document.querySelector("#city-form2");
const resetButton = document.getElementById('homeButton');
const image = document.getElementById('image');
let locations = document.getElementById('locations');
let conditions = document.getElementById('conditions');
let temp = document.getElementById('temp');
let weatherApp = document.getElementById('weatherApp');
let startPage = document.getElementById('cityInput1');
let specificCity = document.getElementById('which-city');
let cityIn = document.getElementById('inputCity');

startUp();

CityForm.addEventListener('submit', weatherSubmitted);

citySelection.addEventListener('submit', citySelected);

resetButton.addEventListener('submit', reset);

function weatherSubmitted() {
    event.preventDefault();
    let city = document.getElementById('city-input').value
    document.getElementById('whichText').innerHTML = city + "?"
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
        specificCity.style.display = 'block';
        cityIn.style.display = 'none';
}

function citySelected() {
    event.preventDefault();
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
            return fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=mph')
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            temp.innerHTML = toF(data.current.temperature_2m) + ' F';
            weatherCode = data.current.weather_code;
            locations.innerHTML = city;
            fetch('./static/weatherCodes.json')
                .then((response) => (response.json()))
                .then((data) => {
                    conditions.innerHTML = data[weatherCode];
            })
            document.getElementById('date').innerHTML = getDate();
            document.getElementById('humidity').innerHTML = data.current.relative_humidity_2m + ' %';
            document.getElementById('rain').innerHTML = data.current.precipitation + ' %';
            document.getElementById('wind').innerHTML = Math.round(data.current.wind_speed_10m) + ' - ' + Math.round(data.current.wind_gusts_10m) + ' mph';
            fetch('./static/api.json')
                .then((response) => (response.json()))
                .then((data) => {
                    console.log(data[0]);
                    return fetch('https://api.unsplash.com/search/photos/?query=' + city + '&client_id=' + data[0])
                })
                .then((response) => response.json())
                .then((data) => (data.results))
                .then((result)=>{
                    const imageUrl = result[0].urls.regular;
                    document.getElementById('backdrop').src = imageUrl;
                });
            switchPage();
        })
        
        
}

function toF(celsius) {
    let F = (celsius * 1.8) + 32;
    return Math.round(F);
}

function startUp() {
    document.getElementById('backdrop').display = 'none';
    weatherApp.style.display = 'none';
    specificCity.style.display = 'none';
    console.log("done");
}

function switchPage() {
    document.getElementById('backdrop').display = 'block';
    weatherApp.style.display = 'block';
    startPage.style.display = 'none';
    console.log("done");
}

function getDate() {
    const today = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
    let month = today.getMonth();
    let day = today.getDate();
    let year = today.getFullYear();
    let date = months[month] + ' ' + day + ', ' + year;
    console.log(date);
    return date
}

function reset() {
    document.getElementById('backdrop').display = 'none';
    specificCity.style.display = 'none';
    weatherApp.style.display = 'none';
    startPage.style.display = 'block';
}