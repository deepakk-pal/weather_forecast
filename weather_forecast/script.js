function getWeather() {
    var cityInput = $('#city').val().trim();

    if (cityInput !== '') {
        //  ajax call for weather report
        $.ajax({
            url: 'weather.php',
            type: 'GET',
            data: { city: cityInput },
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    handleError(data.error);
                } else {
                    displayWeatherInfo(data);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching weather data:', error);

                if (xhr.responseJSON && xhr.responseJSON.message && xhr.responseJSON.message.toLowerCase().includes('city not found')) {
                    handleError('City not found. Please enter a valid city name.');
                } else {
                    handleError('Error fetching weather data. Please try again.');
                }
            }
        });
    } else {
        handleError('Please enter a city name.');
    }
}

function handleError(errorMessage) {
    var inputContainer = $('#input-container');
    var displayContainer = $('#display-container');
    var forecastContainer = $('#forecast');

    inputContainer.hide();
    displayContainer.show();

    forecastContainer.html(`<div class="error-message">${errorMessage}</div>`);
}

function displayWeatherInfo(weatherData) {
    var inputContainer = $('#input-container');
    var displayContainer = $('#display-container');
    var forecastContainer = $('#forecast');


    inputContainer.hide();
    displayContainer.show();

    if (weatherData) {
        forecastContainer.empty();

        var groupedData = groupBy(weatherData, 'date');


        $.each(groupedData, function (date, data) {
            var line = '';
            $.each(data, function (index, entry) {
                var weatherIcon = getWeatherIcon(entry.description);
                // alert(weatherIcon)
                line += `<div class="forecast-item">
                            <p><strong>Date:</strong> ${entry.date}</p>
                            <p><strong>Temperature:</strong> ${entry.temperature}°C</p>
                            <p><strong>Condition:</strong> ${entry.description}</p>
                            <p><strong>Humidity:</strong> ${entry.humidity}%</p>
                            <p><strong>Wind Speed:</strong> ${entry.windSpeed} m/s</p>
                        </div>`;
            });


            forecastContainer.append(line + '<hr><br>');
        });
    } else {
        handleError('Error decoding or processing weather data.');
    }
}


function groupBy(array, key) {
    return array.reduce(function (acc, obj) {
        var property = obj[key];
        acc[property] = acc[property] || [];
        acc[property].push(obj);
        return acc;
    }, {});
}

function getWeatherIcon(description) {
    const iconMapping = {
        'Clear': '< class="fa-solid fa-sun"></i>',
        'Clouds': '<i class="fa-solid fa-cloud"></i>',
        'Rain': '<i class="fa-solid fa-cloud-rain"></i>',
        'Snow': '<i class="fa-regular fa-snowflake"></i>',
    };

    return iconMapping[description] || '<i class="fas fa-question"></i>';
}
