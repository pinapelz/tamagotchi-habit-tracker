import {
  Cloud,
  Sun,
  Moon,
  Snowflake,
  Sunrise,
  Sunset,
  MoonStar,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
} from "lucide-react"

// Get time of day icon
export function getTimeOfDayIcon(timeOfDay) {
  switch (timeOfDay) {
    case "dawn":
    case "daybreak":
      return <Sunrise size={24} className="text-orange-300" />
    case "sunrise":
      return <Sunrise size={24} className="text-yellow-400" />
    case "morning":
      return <Sun size={24} className="text-yellow-400" />
    case "noon":
      return <Sun size={24} className="text-yellow-500" />
    case "afternoon":
      return <Sun size={24} className="text-yellow-400" />
    case "evening":
      return <Sunset size={24} className="text-orange-400" />
    case "sunset":
    case "dusk":
      return <Sunset size={24} className="text-orange-500" />
    case "twilight":
      return <Moon size={24} className="text-blue-300" />
    case "night":
      return <Moon size={24} className="text-indigo-400" />
    case "midnight":
      return <Moon size={24} className="text-indigo-600" />
    case "predawn":
      return <MoonStar size={24} className="text-indigo-500" />
    default:
      return <Sun size={24} className="text-yellow-400" />
  }
}

// Get weather icon
export function getWeatherIcon(currentWeather) {
  if (currentWeather.toLowerCase().includes("cloud")) {
    return <Cloud size={24} className="text-blue-400" />
  } else if (currentWeather.toLowerCase().includes("rain")) {
    return <CloudRain size={24} className="text-blue-500" />
  } else if (currentWeather.toLowerCase().includes("snow")) {
    return <CloudSnow size={24} className="text-blue-200" />
  } else if (currentWeather.toLowerCase().includes("thunder")) {
    return <CloudLightning size={24} className="text-yellow-500" />
  } else if (currentWeather.toLowerCase().includes("fog") || currentWeather.toLowerCase().includes("mist")) {
    return <CloudFog size={24} className="text-gray-400" />
  } else if (currentWeather.toLowerCase().includes("wind")) {
    return <Wind size={24} className="text-blue-300" />
  } else {
    return <Sun size={24} className="text-yellow-400" />
  }
}

// Get season icon
export function getSeasonIcon(season) {
  switch (season) {
    case "winter":
      return <Snowflake size={24} className="text-blue-300" />
    case "spring":
      return "🌸"
    case "summer":
      return "☀️"
    case "fall":
      return "🍂"
    default:
      return "🌸"
  }
} 