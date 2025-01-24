import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog } from 'lucide-react';

const Atmosphere = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '1949641bdf112e1a355ce846b46dddce'; 

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <Sun className="w-16 h-16 text-yellow-500" />,
      '01n': <Sun className="w-16 h-16 text-blue-300" />,
      '02d': <Cloud className="w-16 h-16 text-gray-500" />,
      '02n': <Cloud className="w-16 h-16 text-gray-400" />,
      '03d': <Cloud className="w-16 h-16 text-gray-600" />,
      '04d': <Cloud className="w-16 h-16 text-gray-700" />,
      '09d': <CloudRain className="w-16 h-16 text-blue-400" />,
      '10d': <CloudRain className="w-16 h-16 text-blue-500" />,
      '11d': <CloudRain className="w-16 h-16 text-purple-500" />,
      '13d': <CloudSnow className="w-16 h-16 text-white" />,
      '50d': <CloudFog className="w-16 h-16 text-gray-400" />,
      default: <Sun className="w-16 h-16 text-yellow-500" />
    };
    return iconMap[iconCode] || iconMap.default;
  };

  const fetchWeatherData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
  
      if (!response.ok) {
        throw new Error('oops, no data found');
      }
  
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [location, API_KEY]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim() !== '') {
      fetchWeatherData();
    }
  };
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);
  
    if (value.trim() === '') {
      setWeatherData(null);
      setError(null);
    }
  };
  
  useEffect(() => {}, []);
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <form onSubmit={handleSearch} className="mb-4 flex">
          <input
            type="text"
            value={location}
            onChange={handleInputChange}
            placeholder="Enter city name"
            className="flex-grow p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="text-center text-blue-700">Loading...</div>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {weatherData && !loading && !error && (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getWeatherIcon(weatherData.weather[0].icon)}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {weatherData.name}, {weatherData.sys.country}
            </h2>
            <p className="text-4xl font-extrabold text-blue-700 my-2">
              {Math.round(weatherData.main.temp)}°C
            </p>
            <p className="text-lg text-gray-600 capitalize">
              {weatherData.weather[0].description}
            </p>
            <div className="flex justify-around mt-4 text-gray-700">
              <div>
                <p>Humidity</p>
                <p className="font-bold">{weatherData.main.humidity}%</p>
              </div>
              <div>
                <p>Wind Speed</p>
                <p className="font-bold">{weatherData.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Atmosphere;