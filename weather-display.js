function getWeather() {
  $.simpleWeather({
    woeid: '1105779', //2357536
    location: '',
    unit: 'c',
    success: function(weather) {
      html = '<span class="weather-text city-name">'+weather.city+', '+weather.region+'</span>';
      html += '<span class="weather-text temp">';
      html += weather.temp+'&deg;'+weather.units.temp + '</span>';
      html += '<span class="weather-text currently"><small>'+weather.currently+'</small></span>';
      html += '<img class="weather-image" src="'+weather.image+'" />';

      // //Don't forget to include the moment.js plugin.
      // var timestamp = moment(new Date(weather.updated));
      // html += '<p>Weather updated '+moment(timestamp).fromNow()+'</p>';

      // html += '<p>Weather updated at '+moment(timestamp).format('MM/DD/YY h:mma')+'</p>';

      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
};
