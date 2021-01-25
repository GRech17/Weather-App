$(document).ready(function(){

    // return current date + 5 extra days
    let getDate = function(days){
        let someDate = new Date();
        let DaysToAdd = days; 
        someDate.setDate(someDate.getDate()  + DaysToAdd);

        let dd = someDate.getDate();
        let mm = someDate.getMonth() + 1;
        let y = someDate.getFullYear();

        return mm + '/' + dd + '/' + y;
    }

    // wind speed
    let mph = (speed) => {
        return parseFloat(speed * (3600/1609.344)).toFixed(2);
    }

    // searched cities
    let searchedCities = [];
    if(localStorage.getItem('citysearch')){
    searchedCities = JSON.parse(localStorage.getItem('citysearch'));
    }

    // last searched city

    // city id seperated for new call of city change
    const apiKey = "26fbb33b8a517b0acbc32b21c9e60038";

    // weather function
    let weatherFinder = function(cityName, searched){
        // clear search data
        $('#searchError').html('');
        $('#search datalist').html('');
        // disable additional api requests while app is running

        // first call gets city name
        $.ajax({url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`, success: function(result){
        
        // if request was sent from search field
        if(searched === true){
            // if value was sent from search field form
            if(searchedCities.includes($('#search input').val()) != true){
                searchedCities.push($('#search input').val());
                localStorage.setItem('citysearch', JSON.stringify(searchedCities));
            }
            localStorage.setItem('lastCitySearch', $('#search input').val());
        }

        // sets search field presets
        Array.from(searchedCities).forEach(check => {
            $('#search datalist').append(`<option value='${check}'></option>`);
        })

            cityId = result.id;
            // second call uses result.id data from the first to display weather and to pass the third for the uv
            $.ajax({url: `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&APPID=${apiKey}&units=imperial`, success: function(result){
                // empties current day
                $('#currentDay').html('');
                // sets current day information
                $('#currentDay').append(`<div class='blockHeading'><h2>${result.city.name} (${getDate(0)})</h2><img src='https://openweathermap.org/img/w/${result.list[0].weather[0].icon}.png' alt="${result.list[0].weather[0].description}" width='50' height='50'>`);
                // sets temp
                $("#currentDay").append(`<p class="temperature">Temperature: ${result.list[0].main.temp} °F</p>`);
                // sets humidity
                $("#currentDay").append(`<p class="humidity"> Humidity: ${result.list[0].main.humidity} %</p>`);
                // sets wind
                $("#currentDay").append(`<p class="wind_speed">Wind Speed: ${mph(result.list[0].wind.speed)} MPH</p>`);

                // third call uses coordinate data from second call to call uv data
                $.ajax({url: `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=` + result.city.coord.lat + "&lon=" + result.city.coord.lon,
                success: function(result){
                    $("#currentDay").append(`<p class="uv">UV Index: <span>${result.value}</span></p>` );
                    // Call ends re enable api calls
                    $('button').removeClass('wait');
                    $('button').attr('disabled', false);
                }})

                // 5 day forecast
                // clears forecast data
                $('#forecast .days').html('');
                // append forecast data
                for(let i=1; i <= 5; i++){
                    let forecastBlock = function(i){
                        return('<div>' + '<p class="date">' + getDate(i) + '</p>' + `<img src="https://openweathermap.org/img/w/${result.list[i].weather[0].icon}.png" alt="${result.list[i].weather[0].description}" width='50' height='50'>` + `<p class="temperature">Temp: ${result.list[i].main.temp}&nbsp;°F</p>` +
                        `<p class="humidity">Humidity: ${result.list[i].main.humidity}&nbsp;%</p>` +
                        '</div>');
                    }

                    $('#forecast .days').append(forecastBlock(i));
                }
            }});

            // error functions
         }, error: function (xhr, ajaxOptions, throwError) {
                if ($('#search input').val() === ''){
                    $('#searchError').html('Must Enter City Name');
                } else {
                    $('#searchError').html('City Not Found');
                }
                // Call ends reenamble api calls
                $('button').removeClass('wait');
                $('button').attr('disabled', false);
            }
        });
    }

    if( localStorage.getItem("lastCitySearch")){
        weatherFinder( localStorage.getItem("lastCitySearch"), false);
      }else{
        weatherFinder("Atlanta", false);
      }
    
      $("#presetCities button").on( "click", function() {
        weatherFinder($(this).html().toString(), false);
      });
    
      $("#search button").on( "click", function() {
        weatherFinder($("#search input").val(), true);     
      });

});            