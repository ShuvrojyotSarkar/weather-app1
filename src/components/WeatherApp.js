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

      // Filter forecast to get one entry per day (closest to 12:00 PM)
      const filteredForecast = forecastData.list.filter((entry) =>
        entry.dt_txt.includes("12:00:00")
      );

      // Get the next four distinct days
      const nextFourDays = [];
      const seenDates = new Set();

      for (const entry of filteredForecast) {
        const date = new Date(entry.dt_txt).toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (!seenDates.has(date)) {
          seenDates.add(date);
          nextFourDays.push(entry);
        }

        if (nextFourDays.length === 4) break;
      }

      setForecast(nextFourDays);
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
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, []); // The empty array ensures this only happens once on initial load

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, [unit]); // This hook listens to unit change

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
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
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
            <h2 className="text-xl font-bold text-center sm:text-left">
              {weather.name}
            </h2>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">4-Day Forecast</h2>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={unit === "imperial"}
                  onChange={handleToggleUnit}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {unit === "metric" ? "Celsius" : "Fahrenheit"}
                </span>
              </label>
            </div>
          </div>
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
    </div>
  );
};

export default WeatherApp;
