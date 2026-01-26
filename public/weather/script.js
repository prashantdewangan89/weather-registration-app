document.getElementById("getWeatherBtn").addEventListener("click", getWeather);

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const apiKey = "46e4d3c8baab612e7ba656b417b67237";

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentURL),
      fetch(forecastURL)
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    if (currentData.cod !== 200) {
      alert("City not found! Please check spelling.");
      return;
    }

    // 🌡️ Display current weather
    document.getElementById("temp").textContent = `${Math.round(currentData.main.temp)}°C`;
    document.getElementById("condition").textContent = currentData.weather[0].description;
    document.getElementById("humidity").textContent = `💧 Humidity: ${currentData.main.humidity}%`;
    document.getElementById("wind").textContent = `🌬️ Wind: ${currentData.wind.speed.toFixed(1)} m/s`;

    // 🕒 Next 24-hour forecast
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";

    for (let i = 0; i < 8; i++) {
      const f = forecastData.list[i];
      const time = new Date(f.dt * 1000).getHours().toString().padStart(2, "0");
      forecastContainer.innerHTML += `
        <div class="hour-box">
          <p>${time}:00</p>
          <p>${Math.round(f.main.temp)}°C</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Something went wrong. Please try again later.");
  }
}
