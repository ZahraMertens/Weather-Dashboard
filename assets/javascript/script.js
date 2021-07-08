var submitBtn = $(".btn");
var btnClear = $(".btn-storage")
var cityInput = $("#city");
var ulEl = $(".previous-results");
var cardMain = $(".card-result");
var smallContainer = $(".mini-card-container");
var inputPast = [];
var currentDate = moment().format("DD/MM/YYYY");
console.log(currentDate);


//On load of page previous search inputs get extracted from localStorage and get displayed as list elements
$(document).ready(function() {

    var reloadInput = JSON.parse(localStorage.getItem("city"));
    console.log(reloadInput)

    if (reloadInput !== null ){
      for (var i = 0; i <reloadInput.length; i++){
        var liEl = $("<li class='li-el-results'>" + reloadInput[i] + "</li>");
        ulEl.append(liEl);
        console.log(liEl);
      };
    };
});



//Handle input 
function handleInput (event){
  event.preventDefault();

  //Empty container to make sure that if there was a search before the results do not get displayed on top of each other
  cardMain.empty();
  smallContainer.empty();

  var location = cityInput.val().trim();
  console.log(location);

  //Only if location entered fetch can be executed in next function
  if (location) {
    getWeather(location);
    cityInput.val("");

  } else {
    alert('Please enter location');
  }
};


//Fetch API to get data from server 
function getWeather (location) {

  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=metric&appid=421ab5767df3d4e8136a4ef1f447616c"
  var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=metric&appid=421ab5767df3d4e8136a4ef1f447616c"

  //Get data for main card 
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayWeather(data, location); //Display main card function
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('City does not exist!');
  });

  //Get data for 5 day forecast
  fetch(forecastUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayCards(data, location); //Display cards
          
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('City does not exist!');
  });
}


//Display weather for main card
function displayWeather(weather, location){

  //If no data found
  if (weather.length === 0) {
    alert("No Data found")
  };

  //Display seach as list elements and set local storage
  console.log(location);
        
  var liEl = $("<li class='li-el-results'>" + location + "</li>");
  ulEl.append(liEl);
        
  //Push location in empty array;
  inputPast.push(location);
  console.log(inputPast);
        
  var allInput = JSON.stringify(inputPast);
  localStorage.setItem("city", allInput);
  console.log(localStorage.getItem("city"));


  //Append text
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


  //Get coordinates for API, as uv index can only be extracted with a url including coordinates instead of city name
  var getLat = weather.coord.lat;
  var getLon = weather.coord.lon;

  var uvUrl =  "https://api.openweathermap.org/data/2.5/onecall?lat=" + getLat + "&lon=" + getLon + "&exclude=hourly&appid=421ab5767df3d4e8136a4ef1f447616c"

  //Get Data for uv index
  fetch(uvUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          
          renderUV(data)//Render UV index function
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Error');
    });

    //Function to access api data to get uv index
    function renderUV (coordinates){
    
    if (coordinates.length === 0){
      alert("No Uv index found")
    }

    var uv = coordinates.current.uvi;
    console.log(uv)

    //Append data to p element in container 
    uvEl.text("UV Index: " + uv);
    cardMain.append(uvEl);
    
    //Set classes to display colour to show wether the uv index is low,medium or high
    if (uv < 2) {
      uvEl.addClass("green")
    } else if (uv >= 2 && uv < 5){
      uvEl.addClass("orange")
    } else if (uv > 5){
      uvEl.addClass("red")
    }
  };

};


// Display Forecast function from previous fetch with api call for forecast
function displayCards(weather, location){

  //Selecting the index of object with new date as the objects are displayed in 3h time difference
  var day = [0, 8, 16, 24, 32];

  //Add header to container and class
  smallContainer.addClass("main-result");
  smallContainer.append("<h1 class='col-12 header-forecast'>5 Day Forecast:</h1>")

  //Looping over array to get data from each api call object 
  day.forEach(function (i) {
 
    var createDiv = $("<div>")
    createDiv.addClass("col-2 card-mini")
    smallContainer.append(createDiv);
    //Date for each day
    var date = moment(weather.list[i].dt_txt).format("DD/MM/YYYY")
    console.log(date)
    //Details for each day
    var temp1 = weather.list[i].main.temp;
    var wind1 = weather.list[i].wind.speed;
    var hum1 = weather.list[i].main.humidity;
    
    //Append date and details to card container
    createDiv.append("<h1 id='forecast-header'>" + date + "</h1>");
    createDiv.append("<img src='http://openweathermap.org/img/wn/" + weather.list[i].weather[0].icon + "@2x.png'</img>")
    createDiv.append("<p class='p-forecast'>Temp: " + temp1 + " C</p>");
    createDiv.append("<p class='p-forecast'>Wind: " + wind1 + " MPH</p>");
    createDiv.append("<p class='p-forecast'>Humidity: " + hum1 + " %</p>");
  })
}


//When click on list element of previous result  location gets displayed again
function handleList (event){
  event.preventDefault();
  
  cardMain.empty();
  smallContainer.empty();

  var location = $(".li-el-results").text();
  console.log(location) ///////////////////////////////in console.log SydneySydneySyndey

  if (location) {
    getWeather(location);
  };
}

//When click on 'clear search'-button list elemnts get removed and page reloads
function clearStorage (event){
  event.preventDefault();

  localStorage.clear();
  window.location.reload();
}

//On click of buttons events happen;
btnClear.on("click", clearStorage);
ulEl.on("click", $(".li-el-result"), handleList);
submitBtn.on("click", handleInput);