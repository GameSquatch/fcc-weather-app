var lat;
var long;
var temp;
var minTemp, maxTemp;
var windDir;
var ForC = $("#degree");
var options = {
  enableHighAccuracy: true,
  timeout: 5500,
  maximumAge: 0
};
var weatherURL = "https://fcc-weather-api.glitch.me/api/current?";
var sunrise;

$(document).ready(function() {
  getLocation();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(posSuccess, posError, options);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function posSuccess(pos) {
  lat = precisionRound(pos.coords.latitude, 4);
  long = precisionRound(pos.coords.longitude, 4);
  
  weatherURL = weatherURL + "lat=" + lat + "&lon=" + long;
  
  $.ajax({
    dataType: "json",
    url: weatherURL,
    success: function(json) {
      $("#city").html(json["name"] + ", " + json["sys"]["country"]);
      temp = json["main"]["temp"];
      minTemp = json["main"]["temp_min"];
      maxTemp = json["main"]["temp_max"];
      $("#temp").html(json["main"]["temp"]);
      $("#weatherDesc").html(json["weather"][0]["description"]);
      $("#pressure").html("<strong>Pressure: </strong>" + json["main"]["pressure"] + " hPa");
      $("#humidity").html("<strong>Humidity: </strong>" + json["main"]["humidity"] + " %");
      $("#maxTemp").html("<strong>Max Temp: </strong>" + json["main"]["temp_max"]);
      $("#visibility").html("<strong>Visibility: </strong>" + json["visibility"] + " m");
      $("#wind-speed").html("<strong>Wind Speed: </strong>" + json["wind"]["speed"] + " m/s");
      findWindDir(json);
      $("#minTemp").html("<strong>Min Temp: </strong>" + json["main"]["temp_min"]);
      
      //if the country is US, set the degrees in Fahrenheit by default
      if (json["sys"]["country"] === "US") {
        ForC.html("<strong>F</strong>");
        temp = precisionRound((temp * 1.8) + 32, 2);
        minTemp = precisionRound((minTemp * 1.8) + 32, 2);
        maxTemp = precisionRound((maxTemp * 1.8) + 32, 2);
        $("#temp").html(temp);
        $("#minTemp").html("<strong>Min Temp: </strong>" + minTemp);
        $("#maxTemp").html("<strong>Max Temp: </strong>" + maxTemp);
      } else {
        ForC.html("<strong>C</strong>");
      }
      
      //add a click function to interchange between C and F degrees
      ForC.click(function() {
        if ($("#degree").text() === 'C') {
          temp = precisionRound((temp * 1.8) + 32, 2);
          minTemp = precisionRound((minTemp * 1.8) + 32, 2);
          maxTemp = precisionRound((maxTemp * 1.8) + 32, 2);
          $("#temp").html(temp);
          $("#minTemp").html("<strong>Min Temp: </strong>" + minTemp);
          $("#maxTemp").html("<strong>Max Temp: </strong>" + maxTemp);
          ForC.html("<strong>F</strong>");
        } else {
          temp = precisionRound((temp - 32) / 1.8, 2);
          minTemp = precisionRound((minTemp - 32) / 1.8, 2);
          maxTemp = precisionRound((maxTemp - 32) / 1.8, 2);
          $("#temp").html(temp);
          $("#minTemp").html("<strong>Min Temp: </strong>" + minTemp);
          $("#maxTemp").html("<strong>Max Temp: </strong>" + maxTemp);
          ForC.html("<strong>C</strong>");
        }
      });
    
      //getting sunrise and sunset data formatted
      var rise = json["sys"]["sunrise"];
      var set = json["sys"]["sunset"];
      var now = new Date();
      var d1 = new Date(rise * 1000);
      var d2 = new Date(set * 1000);
      
      var d1h = d1.getHours();
      var d1m = d1.getMinutes(); var min1Str = "";
      if (d1h > 12) d1h -= 12;
      if (d1m < 10) min1Str = "0";
      min1Str += d1m;
      
      var d2h = d2.getHours();
      var d2m = d2.getMinutes(); var min2Str = "";
      if (d2h > 12) d2h -= 12;
      if (d2m < 10) min2Str = "0";
      min2Str += d2m;
      
      $("#sunrise").html("<strong>Sunrise: </strong>" + d1h + ":" + min1Str + "AM");
      $("#sunset").html("<strong>Sunset: </strong>" + d2h + ":" + min2Str + "PM");
    }
  });
  
}

function posError(err) {
  switch (err) {
    case 1:
      alert("Position request was denied.");
      break;
    case 2:
      alert("Position was unavailable.");
      break;
    case 3:
      alert("Timeout. Took too long to acquire postion.");
      break;
  }
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function findWindDir(js) {
  windDir = js["wind"]["deg"];
  var windDOM = $("#wind-dir");
  var word = "N";
  
  if (windDir >= 16 && windDir <= 84) {
    word = "NE";
  } else if (windDir >= 85 && windDir <= 105) {
    word = "E";
  } else if (windDir >= 106 && windDir <= 164) {
    word = "SE";
  } else if (windDir >= 165 && windDir <= 195) {
    word = "S";
  } else if (windDir >= 196 && windDir <= 254) {
    word = "SW";
  } else if (windDir >= 255 && windDir <= 285) {
    word = "W";
  } else if (windDir >= 286 && windDir < 344) {
    word = "NW";
  }
  
  windDOM.html("<strong>Wind Direction: </strong>" + word);
}