// Simulated 4-Day Weather Forecast Service for AgriMinds
// Weather conditions: sunny, cloudy, rain, heavy_rain

export const WEATHER_TYPES = {
  sunny: { id: 'sunny', labelEn: 'Clear & Sunny', labelHi: 'साफ धूप', icon: '☀️', safe: true },
  cloudy: { id: 'cloudy', labelEn: 'Partly Cloudy', labelHi: 'हल्के बादल', icon: '⛅', safe: true },
  rain: { id: 'rain', labelEn: 'Rain Expected', labelHi: 'बारिश की संभावना', icon: '🌧️', safe: false, alert: true },
  heavy_rain: { id: 'heavy_rain', labelEn: 'Heavy Rainfall Alert', labelHi: 'भारी बारिश की चेतावनी', icon: '⛈️', safe: false, alert: true }
};

export const INITIAL_WEATHER_FORECAST = [
  { dayIndex: 0, dayOffset: 0, type: 'sunny', temp: '31°C', rainfallChance: '10%' },
  { dayIndex: 1, dayOffset: 1, type: 'heavy_rain', temp: '26°C', rainfallChance: '85%' },
  { dayIndex: 2, dayOffset: 2, type: 'rain', temp: '27°C', rainfallChance: '70%' },
  { dayIndex: 3, dayOffset: 3, type: 'sunny', temp: '32°C', rainfallChance: '15%' }
];

export const weatherService = {
  getForecast: (customForecast) => {
    return customForecast || INITIAL_WEATHER_FORECAST;
  },

  getWeatherForDay: (dayOffset, forecastList) => {
    const list = forecastList || INITIAL_WEATHER_FORECAST;
    const match = list.find(f => f.dayOffset === dayOffset);
    return match ? WEATHER_TYPES[match.type] || WEATHER_TYPES.sunny : WEATHER_TYPES.sunny;
  },

  hasRainOnDay: (dayOffset, forecastList) => {
    const list = forecastList || INITIAL_WEATHER_FORECAST;
    const match = list.find(f => f.dayOffset === dayOffset);
    return match ? (match.type === 'rain' || match.type === 'heavy_rain') : false;
  }
};
