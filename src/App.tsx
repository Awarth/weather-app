import axios from "axios";
import { LoaderCircle, Search } from "lucide-react";
import React, { useState } from "react";

interface WeatherData {
  resolvedAddress: string;
  currentConditions: {
    temp: string;
    conditions: string;
  };
}

const WeatherCard = ({ weather }: { weather: WeatherData }) => (
  <div className="bg-white mt-6 p-6 rounded shadow-md w-full max-w-[450px] text-center">
    <h3 className="text-xl font-bold text-gray-800 mb-2">
      Weather in {weather.resolvedAddress}
    </h3>
    <p className="text-lg text-gray-700">
      <span className="font-semibold">Temperature:</span>{" "}
      {weather.currentConditions.temp}°C
    </p>
    <p className="text-lg text-gray-700">
      <span className="font-semibold">Conditions:</span>{" "}
      {weather.currentConditions.conditions}
    </p>
  </div>
);

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const fetchWeatherData = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setError("Please enter a city name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=metric&key=${
          import.meta.env.VITE_API_KEY
        }&contentType=json`
      );
      setWeather(res.data);
      setError("");
      setQuery("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setError("City not found. Please try again.");
      } else {
        setError("Error fetching weather data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchWeatherData(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      <div className="bg-white max-w-[450px] w-full p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Weather App
        </h1>
        <form
          onSubmit={handleQuerySubmit}
          className="w-full flex items-center bg-white shadow-sm rounded overflow-hidden"
        >
          <input
            type="search"
            value={query}
            onChange={handleInputChange}
            className="w-full p-3 text-lg border-none outline-none text-gray-800 placeholder-gray-500"
            placeholder="Enter city name"
            aria-label="City name"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 flex items-center justify-center"
            disabled={loading}
          >
            <Search />
          </button>
        </form>

        {loading && (
          <div className="mt-6 flex justify-center items-center">
            <LoaderCircle className="animate-spin text-blue-600 w-8 h-8" />
          </div>
        )}

        {error && (
          <p className="text-red-600 text-center mt-4 font-medium">{error}</p>
        )}

        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

export default App;
