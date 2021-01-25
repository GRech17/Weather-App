$(document).ready(function(){

    // return current date + 5 extra days
    let getDate = function(days){
        let someDate = new Date();
        let DaysToAdd = days; 
        someDate.setDate(someDate.getDate() + DaysToAdd);

        let dd = someDate.getDate();
        let mm = someDate.getMonth() + 1;
        let y = someDate.getFullYear();

        return mm + '/' + dd + '/' + y;
    }

    // wind speed

    // searched cities
    let searchedCities = [];
    if(localStorage.getItem('citysearch')){
    searchedCities = JSON.parse(localStorage.getItem('citysearch'));
    }

    // last searched city

    // city id seperated for new call of city change

    // weather function
    let weatherFinder = function(cityName, searched){
        // clear search data
        $('#searchError').html('');
        $('#search datalist').html('');
        // disable additional api requests while app is running

        // first call gets city name
        $.ajax({url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`, success: function(result){
        
        // if request was sent from searchfield
        if(searched === true){
            // if value was sent from searchfield form
            
        }
        }})
    }






});    