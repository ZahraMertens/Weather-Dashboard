var submitBtn = $(".btn");
var cityInput = $("#city");
var ulEl = $(".previous-results");
var cardMain = $(".card-result");
var smallContainer = $(".mini-card-container");
var inputPast = [];
var currentDate = moment().format("DD/MM/YYYY");
console.log(currentDate);


$(document).ready(function() {

  
    var reloadInput = JSON.parse(localStorage.getItem("city"));

    console.log(reloadInput)

    if (reloadInput !== null ){
      for (var i = 0; i <reloadInput.length; i++){
        var liEl = $("<li>");
        liEl.addClass("li-el-results");
        liEl.text(reloadInput[i]);
        ulEl.append(liEl);
        console.log(liEl); //only append existing city
      }
   }
});

function handleInput (event){
    event.preventDefault();

    //Empty Card if there was a rseult beforehand 
    cardMain.empty();
    smallContainer.empty();

    var location = cityInput.val().trim();
    console.log(location);

    if (location) {
        getWeather(location);
        cityInput.val("");
        //repoContainerEl.textContent = '';
        
        console.log(location);
        
        var liEl = $("<li>");
        liEl.addClass("li-el-results");
        liEl.text(location);
        ulEl.append(liEl);
        console.log(liEl);
        
        inputPast.push(location)
        console.log(inputPast)
        
        var allInput = JSON.stringify(inputPast)
        localStorage.setItem("city", allInput)
        console.log(localStorage.getItem("city"))
        return;

      } else {

        alert('Please enter location');
    }
};

function handleList (event){
  event.preventDefault();
  
  cardMain.empty();
  smallContainer.empty();

  var location = $(".li-el-results").text();
  console.log(location)

  if (location) {
    getWeather(location);
  };
}

function getWeather (location) {

  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=metric&appid=421ab5767df3d4e8136a4ef1f447616c"
  var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=metric&appid=421ab5767df3d4e8136a4ef1f447616c"

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayWeather(data, location);
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('City does not exist!');
  });

  fetch(forecastUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayCards(data, location);
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('City does not exist!');
  });
  
 
}

function displayCards(weather, location){

  var day = [0, 8, 16, 24, 32];

  smallContainer.addClass("main-result");
  smallContainer.append("<h1 class='col-12 header-forecast'>5 Day Forecast:</h1>")

  day.forEach(function (i) {
    //var date = currentDate.add(1, "day");
    //console.log(date);
    
    var createLi = $("<div>")
    createLi.addClass("col-2 card-mini")
    smallContainer.append(createLi);
    var date = moment(weather.list[i].dt_txt).format("DD/MM/YYYY")
    console.log(date)
    var temp1 = weather.list[i].main.temp;
    var wind1 = weather.list[i].wind.speed;
    var hum1 = weather.list[i].main.humidity;
    
    createLi.append("<h1 id='forecast-header'>" + date + "</h1>");
    createLi.append("<img src='http://openweathermap.org/img/wn/" + weather.list[i].weather[0].icon + "@2x.png'</img>")
    createLi.append("<p class='p-forecast'>Temp: " + temp1 + " C</p>");
    createLi.append("<p class='p-forecast'>Wind: " + wind1 + " MPH</p>");
    createLi.append("<p class='p-forecast'>Humidity: " + hum1 + " %</p>");
  })
}

function displayWeather(weather, location){

  if (weather.length === 0) {
    alert("No Data found")
  }

  var h1El = $("<h1>");
  var imgEl = $("<img>");
  var tempEl = $("<p>");
  var windEl = $("<p>");
  var humidityEl = $("<p>");
  var uvEl = $("<p>");
  
  var icon = weather.weather[0].icon;
  console.log(icon);
   
  var iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
  imgEl.attr("src", iconUrl);
   
    
  h1El.addClass("header-result");
  h1El.text(location + " " + currentDate);
  cardMain.append(h1El);
  h1El.append(imgEl);
  cardMain.addClass("main-result")
   
    
  var temp = weather.main.temp ;
  var wind = weather.wind.speed ;
  var hum = weather.main.humidity;

  tempEl.text("Temp: " + temp + " C");
  windEl.text("Wind: " + wind + " MPH");
  humidityEl.text("Humidity: " + hum + " %");

  cardMain.append(tempEl);
  cardMain.append(windEl);
  cardMain.append(humidityEl);


  var getLat = weather.coord.lat;
  var getLon = weather.coord.lon;

   
  var uvUrl =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + getLat + "&lon=" + getLon + "&exclude=hourly&appid=421ab5767df3d4e8136a4ef1f447616c"

  fetch(uvUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          
          renderUV(data)

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Error');
    });

    function renderUV (coordinates){
    
    if (coordinates.length === 0){
      alert("No Uv index found")
    }

    var uv = coordinates.current.uvi;
    console.log(uv)

    uvEl.text("UV Index: " + uv);
    cardMain.append(uvEl);
    
    if (uv < 2) {
      uvEl.addClass("green")
    } else if (uv >= 2 && uv < 5){
      uvEl.addClass("orange")
    } else if (uv > 5){
      uvEl.addClass("red")
    }
  };

};
/////////////////EVENT DELEGATION
ulEl.on("click", $(".li-el-result"), handleList);
submitBtn.on("click", handleInput);