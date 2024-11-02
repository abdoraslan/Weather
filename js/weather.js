var latLot = {}
const loader = document.getElementById("lds-ring")
loader.style.display = "none"

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else {
    alert("Geolocation is not supported by this browser.");
}

function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    latLot.latitude = latitude
    latLot.longitude = longitude
    const your_api = "242e39817553bc0d994fc04f72ab39aa"
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latLot.latitude}&lon=${latLot.longitude}&units=metric&appid=${your_api}`
    const url_air = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latLot.latitude}&lon=${latLot.longitude}&appid=${your_api}`
    const url_forcast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latLot.latitude}&lon=${latLot.longitude}&units=metric&appid=${your_api}`
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
            let time = fifthDay.dt
            console.log(time)
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

function extractDate(day){
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