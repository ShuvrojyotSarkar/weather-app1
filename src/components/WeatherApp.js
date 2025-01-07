import React, { useState, useEffect, useCallback } from "react";

const WeatherApp = () => {
  const [city, setCity] = useState("Falakata");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const fetchWeather = useCallback(async () => {
    if (!city.trim()) {
      alert("Please enter a valid city name!");
      return;
    }

    const API_KEY = "f3bfed24ca2d766e54782d801dd66369";
    const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=${unit}&appid=${API_KEY}`;
    const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=${unit}&appid=${API_KEY}`;

    setLoading(true);
    setError(null);

    try {
      const weatherResponse = await fetch(CURRENT_WEATHER_URL);
      if (!weatherResponse.ok) throw new Error("City not found");
      const weatherData = await weatherResponse.json();
      setWeather(weatherData);

      const forecastResponse = await fetch(FORECAST_URL);
      if (!forecastResponse.ok) throw new Error("City not found");
      const forecastData = await forecastResponse.json();

      setForecast(forecastData.list.slice(0, 4)); // Use the first 4 forecasts for simplicity
    } catch (error) {
      setError(error.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  }, [city, unit]);

  const handleSearch = () => {
    fetchWeather();
  };

  const handleKeyDown = (e) => {
    // Trigger search when Enter key is pressed
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  // Perform initial search for Falakata when the component mounts
  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, []); // The empty array makes sure this only happens once on initial load

  return (
    <div className="min-h-screen bg-blue-300 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-700 text-center">
        Weather App
      </h1>

      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-4 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Enter city"
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-auto"
          value={city}
          onChange={(e) => setCity(e.target.value)} // Update city state as user types
          onKeyDown={handleKeyDown} // Listen for Enter key press
        />
        <button
          onClick={handleSearch}
          style={{ backgroundColor: "#4dbfd9" }}
          className="text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-700">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {weather && !loading && (
        <div className="bg-white shadow-lg rounded-md p-6 mb-4 max-w-xl flex flex-col sm:flex-row items-center justify-center">
          <div className="flex-1 flex justify-center items-center">
            <img
              src="https://img.freepik.com/premium-psd/sunny-rainy-cloudy-day-weather-forecast-icon-illustration_47987-10695.jpg?w=740"
              alt="Weather Condition"
              className="w-32 h-32"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-center sm:text-left">{weather.name}</h2>
            <p className="text-gray-600 text-center sm:text-left">
              {weather.main?.temp || "N/A"}° {unit === "metric" ? "C" : "F"}
            </p>
            <p className="text-center sm:text-left">
              Humidity: {weather.main?.humidity || "N/A"}%
            </p>
            <p className="text-center sm:text-left">
              Wind Speed: {weather.wind?.speed || "N/A"}{" "}
              {unit === "metric" ? "m/s" : "mph"}
            </p>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="bg-white shadow-lg rounded-md p-6 w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4 text-center">4-Day Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-md text-center"
              >
                <p className="font-bold">
                  {new Date(day.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </p>
                <p>
                  {day.main.temp}° {unit === "metric" ? "C" : "F"}
                </p>
                <p>Humidity: {day.main.humidity}%</p>
                <p>
                  Wind: {day.wind.speed} {unit === "metric" ? "m/s" : "mph"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleToggleUnit}
        className="mt-4 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 w-full sm:w-auto"
      >
        Toggle to {unit === "metric" ? "Fahrenheit" : "Celsius"}
      </button>
    </div>
  );
};

export default WeatherApp;
