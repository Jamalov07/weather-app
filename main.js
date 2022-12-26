let buttonForInput = document.querySelector(".buttonForInput");
let inputForCity = document.querySelector(".inputForCity");
let iconToday = document.querySelector(".icon-today");
let cityName = document.querySelector(".h1-to-cityname");
let bottomcityName = document.querySelector(".to-city-name");
let latitude = document.querySelector(".to-lat");
let longitude = document.querySelector(".to-lon");
let tocountryCode = document.querySelector(".to-country-code");
let timeZone = document.querySelector(".to-time-zone");
let togradustoday = document.querySelector(".to-gradus-today");
let alltoggles = document.querySelectorAll(".toggle");
let alldates = document.querySelectorAll(".date");
console.log(alldates);
console.log(alltoggles[0].innerText);

buttonForInput.addEventListener("click", (event) => {
  event.preventDefault();
  console.log(inputForCity.value);
  getLatAndLong(inputForCity.value);
});

async function getLatAndLong(cityName) {
  const JSONdata = await await fetch(
    `http://api.positionstack.com/v1/forward?access_key==${cityName}`
  );
  const data = (await JSONdata.json()).data[0];
  getWeather(data.latitude, data.longitude);
}

async function getWeather(lat, lon) {
  const url = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?lat=${lat}&lon=${lon}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "",
      "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com",
    },
  };
  const JSONdata = await await fetch(url, options);
  const data = await JSONdata.json();
  let date = 0;
  let dates = [];
  let lst = [];
  let sum = 0;
  let count = 1;
  let weat = [];
  for (let el of data.data) {
    console.log(el.datetime.toString().slice(0, 10));
    if (el.datetime.toString().slice(0, 10) != date) {
      date = el.datetime.toString().slice(0, 10);
      sum = sum / count;
      weat.push(el.weather.description);
      lst.push(sum.toFixed(1));
      dates.push(el.datetime.toString().slice(5, 10));
      sum = 0;
      count = 0;
    } else {
      count++;
      sum = sum + el.temp;
    }
  }
  let icontoday;
  if (data.data[1].weather.description == "Clear Sky") {
    icontoday = 2;
  } else {
    icontoday = 6;
  }

  appender(
    icontoday,
    lst[1],
    data.city_name,
    data.lat,
    data.lon,
    data.country_code,
    data.timezone,
    dates.slice(1),
    weat.slice(1),
    lst.slice(1)
  );
}

function appender(
  icontoday,
  gradustoday,
  cityname,
  lat,
  lon,
  countryCode,
  timezone,
  dates,
  weat,
  lst
) {
  iconToday.innerText = icontoday;
  togradustoday.innerText = gradustoday;
  alltoggles.forEach((toggle) => {
    if (toggle.innerText == icontoday) {
      toggle.classList.add("on");
    }
  });
  cityName.innerText = cityname;
  latitude.innerText = lat;
  longitude.innerText = lon;
  tocountryCode.innerText = countryCode;
  timeZone.innerText = timezone;
  bottomcityName.innerText = cityname;
  for (let i = 0; i < alldates.length; i++) {
    alldates[i].innerText = dates[i];
    if (weat[i] == "Clear Sky") {
      alldates[i].setAttribute("data-icon", "1");
    } else {
      alldates[i].setAttribute("data-icon", "6");
    }
    alldates[i].setAttribute("data-degrees", lst[i]);
  }
}
