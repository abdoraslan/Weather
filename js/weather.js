
const loader = document.getElementById("lds-ring")
loader.style.display = "none"



function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    // Fetch the weather data for the current location
    fetchWeatherData(latitude, longitude);
}

fetchWeatherData(51.509865, -0.118092);

function fetchWeatherData(latitude, longitude) {
    const your_api = "242e39817553bc0d994fc04f72ab39aa"
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${your_api}`
    const url_air = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${your_api}`
    const url_forcast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${your_api}`

    axios.get(url)
        .then(function (response) {
            let data = response.data
            let visibility = Math.floor(data.visibility / 1000)
            let feels_like = Math.floor(data.main.feels_like)
            let sunrise = convertUnixToTime(data.sys.sunrise); // Convert sunrise timestamp
            let sunset = convertUnixToTime(data.sys.sunset);  // Convert sunset timestamp
            // ignore unneeded numbers like 27.25 will be 27 only
            let temp = Math.floor(data.main.temp)
            // Get the weather icon URL
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            // Convert the Unix timestamp to a readable date
            let unix_timestamp = data.dt;
            let date = new Date(unix_timestamp * 1000);
            let options = { weekday: 'long', day: 'numeric', month: 'short' };
            let formattedDate = date.toLocaleDateString('en-US', options);
            formattedDate = `${date.toLocaleDateString('en-US', { weekday: 'long' })} ${date.getDate()}, ${date.toLocaleDateString('en-US', { month: 'short' })}`;
            document.getElementById("first-card").innerHTML = ` <h5>Now</h5>
                    <div class="d-flex justify-content-between align-items-center">
                       <h1 class="d-inline-flex align-items-center" style="font-size: 5em;">${temp}&deg;<span
                                style="font-size: .6em;">C</span></h1>
                        <img style="width:90px;" src="${iconUrl}" alt="">
                    </div>
                    <h6>${data.weather[0].description}</h6>
                    <hr>
                    <div class="mb-2">
                        <i class="fa-regular fa-calendar"></i>
                        <span class="p-1 text-secondary">${formattedDate}</span>
                    </div>
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        <span class="p-1 text-secondary">${data.name}, ${data.sys.country}</span>
                    </div>
            `
            document.getElementById("humidity").innerHTML = data.main.humidity
            document.getElementById("pressure").innerHTML = data.main.pressure
            document.getElementById("visibility").innerHTML = visibility
            document.getElementById("feels").innerHTML = feels_like
            document.getElementById("sunrise").innerHTML = sunrise
            document.getElementById("sunset").innerHTML = sunset
        })
        .catch(function (error) {
            console.log(error);
        })


    axios.get(url_air)
        .then(function (response) {
            let index = response.data.list[0].main.aqi
            let quality = document.getElementById("quality");
            if (index >= 0 && index <= 50) {
                quality.innerHTML = "Good";
                quality.style.backgroundColor = "#28a745";  // Green
                quality.style.color = "#2bcf4a";  // Slightly brighter green
            } else if (index > 50 && index <= 100) {
                quality.innerHTML = "Fair";
                quality.style.backgroundColor = "#ffeb3b";  // Yellow
                quality.style.color = "#f0db28";  // Slightly darker yellow
            } else if (index > 100 && index <= 150) {
                quality.innerHTML = "Moderate";
                quality.style.backgroundColor = "#ff9800";  // Orange
                quality.style.color = "#ff8c00";  // Slightly darker orange
            } else if (index > 150 && index <= 200) {
                quality.innerHTML = "Poor";
                quality.style.backgroundColor = "#f44336";  // Red
                quality.style.color = "#e53935";  // Slightly darker red
            } else if (index > 200 && index <= 300) {
                quality.innerHTML = "Very Poor";
                quality.style.backgroundColor = "#9c27b0";  // Purple
                quality.style.color = "#8e24aa";  // Slightly darker purple
            } else if (index > 300) {
                quality.innerHTML = "Hazardous";
                quality.style.backgroundColor = "#6d1f00";  // Dark Maroon
                quality.style.color = "#5c1a00";  // Slightly darker maroon
            }

            let data = response.data.list[0].components
            document.getElementById("pm2.5").innerHTML = data.pm2_5
            document.getElementById("so2").innerHTML = data.so2
            document.getElementById("no2").innerHTML = data.no2
            document.getElementById("o3").innerHTML = data.o3

        })
        .catch(function (error) {
            console.log(error);
        })

    axios.get(url_forcast)
        .then(function (response) {
            let data = response.data
            let firstDay = data.list[5]
            let secondDay = data.list[13]
            let thirdDay = data.list[21]
            let fourthDay = data.list[29]
            let fifthDay = data.list[37]
            document.getElementById("second-card").innerHTML = `<div class=" d-flex">
                        <div class="col-5">
                            <img height="30px" src="${getIcon(firstDay.weather[0].icon)}" alt="">
                            <span>${Math.floor(firstDay.main.temp)}&deg;</span>
                        </div>
                        <span class="text-secondary col-4">${extractDate(firstDay).formattedDate}</span>
                        <span class="text-secondary  col-3">${extractDate(firstDay).weekday}</span>
                    </div>
                    <div class="d-flex">
                        <div class="col-5">
                            <img height="30px" src="${getIcon(secondDay.weather[0].icon)}" alt="">
                            <span>${Math.floor(secondDay.main.temp)}&deg;</span>
                        </div>
                        <span class="text-secondary col-4">${extractDate(secondDay).formattedDate}</span>
                        <span class="text-secondary  col-3">${extractDate(secondDay).weekday}</span>
                    </div>
                    <div class="d-flex">
                        <div class="col-5">
                            <img height="30px" src="${getIcon(thirdDay.weather[0].icon)}" alt="">
                            <span>${Math.floor(thirdDay.main.temp)}&deg;</span>
                        </div>
                       <span class="text-secondary col-4">${extractDate(thirdDay).formattedDate}</span>
                        <span class="text-secondary  col-3">${extractDate(thirdDay).weekday}</span>
                    </div>
                    <div class=" d-flex">
                        <div class="col-5">
                            <img height="30px" src="${getIcon(fourthDay.weather[0].icon)}" alt="">
                            <span>${Math.floor(fourthDay.main.temp)}&deg;</span>
                        </div>
                       <span class="text-secondary col-4">${extractDate(fourthDay).formattedDate}</span>
                        <span class="text-secondary  col-3">${extractDate(fourthDay).weekday}</span>
                    </div>
                    <div class="d-flex">
                        <div class="col-5">
                            <img height="30px" src="${getIcon(fifthDay.weather[0].icon)}" alt="">
                            <span>${Math.floor(fifthDay.main.temp)}&deg;</span>
                        </div>
                        <span class="text-secondary col-4">${extractDate(fifthDay).formattedDate}</span>
                        <span class="text-secondary  col-3">${extractDate(fifthDay).weekday}</span>
                    </div>
            `

        })
        .catch(function (error) {
            console.log(error);
        })

}

function errorCallback(error) {
    console.error("Error getting location: ", error.message);
}


function convertUnixToTime(unix_timestamp) {
    // Convert Unix timestamp (in seconds) to a JavaScript Date object
    let date = new Date(unix_timestamp * 1000);

    // Extract hours and minutes
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Convert to 12-hour format
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, make it 12

    // Add leading zero to minutes if less than 10
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Return the formatted time
    return `${hours}:${minutes} ${ampm}`;
}

function getIcon(icon) {
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`
    return iconUrl
}

function extractDate(day) {
    let unix_timestamp = day.dt;
    let date = new Date(unix_timestamp * 1000); // Convert Unix timestamp to milliseconds

    // Extract the day of the month (e.g., 2)
    let dayOfMonth = date.getDate();

    // Extract the weekday (e.g., Thursday)
    let weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Extract the month (e.g., Mar)
    let month = date.toLocaleDateString('en-US', { month: 'short' });

    // Format the full date as needed
    let formattedDate = `${dayOfMonth} ${month}`; // e.g., 2 Mar

    let fullDate = {}
    fullDate.formattedDate = formattedDate
    fullDate.weekday = weekday
    return fullDate

}


document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById("input");
    const suggestionsBox = document.getElementById("suggestions");
    const loader = document.getElementById("lds-ring");

    // Hide loader and suggestionsBox initially
    loader.style.display = "none";
    suggestionsBox.style.display = "none";

    // Function to fetch city suggestions
    async function fetchCitySuggestions(query) {
        const apiKey = '242e39817553bc0d994fc04f72ab39aa';
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching city suggestions", error);
            return [];
        }
    }

    // Function to display suggestions
    function displaySuggestions(cities) {
        suggestionsBox.innerHTML = ""; // Clear previous suggestions

        if (cities.length === 0) {
            suggestionsBox.innerHTML = "<p class='text-light'>No cities found</p>";
            return;
        }

        cities.forEach(city => {
            const cityElement = document.createElement("div");
            cityElement.classList.add("suggestion-item", "px-2", "border-bottom", "d-flex", "align-items-center");
            cityElement.style.cursor = "pointer";

            // Create a location icon (use Font Awesome for example)
            const icon = document.createElement("i");
            icon.classList.add("fas", "fa-map-marker-alt", "me-3", "fs-4"); // Adjust classes based on your icon library
            icon.style.color = "grey"; // Icon color set to grey

            // Create a wrapper div for city name and location info
            const infoWrapper = document.createElement("div");
            infoWrapper.classList.add("d-flex", "flex-column");

            // Create city name element
            const cityName = document.createElement("span");
            cityName.textContent = city.name; // First name of the city
            cityName.style.color = "white"; // City name color

            // Create state and country container
            const locationInfo = document.createElement("span");
            locationInfo.style.color = "grey"; // State and country color
            locationInfo.textContent = `${city.state}, ${city.country}`; // Add comma and space between state and country

            // Append elements to infoWrapper
            infoWrapper.appendChild(cityName); // Append city name
            infoWrapper.appendChild(locationInfo); // Append state and country

            // Append icon and infoWrapper to cityElement
            cityElement.appendChild(icon); // Append the icon
            cityElement.appendChild(infoWrapper); // Append the info wrapper

            // Handle city selection
            cityElement.addEventListener("click", function () {
                inputField.value = `${city.name}`;
                suggestionsBox.style.display = "none"; // Hide suggestions after selection
                fetchWeatherData(city.lat, city.lon)
            });

            suggestionsBox.appendChild(cityElement);
        });


        // Show suggestionsBox if there are cities to display
        suggestionsBox.style.display = "block";
    }

    // Event listener for input field
    inputField.addEventListener("input", async function () {
        const query = inputField.value.trim();

        if (query.length > 1) {
            suggestionsBox.style.display = "none"; // Initially hide suggestions box
            loader.style.display = "block"; // Show loader when typing starts

            const cities = await fetchCitySuggestions(query);
            loader.style.display = "none"; // Hide loader once the cities are fetched

            if (cities.length > 0) {
                displaySuggestions(cities);
            } else {
                suggestionsBox.innerHTML = "<p class='text-light'>No cities found</p>";
                suggestionsBox.style.display = "block"; // Show 'No cities found' message
            }
        } else {
            suggestionsBox.style.display = "none"; // Hide suggestions if input is too short or empty
            loader.style.display = "none"; // Hide loader if the input is cleared
        }
    });
});


document.getElementById("current").addEventListener("click", function () {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
})