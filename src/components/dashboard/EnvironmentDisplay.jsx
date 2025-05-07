import PropTypes from 'prop-types'
import defaultWeatherBg from '../../assets/pet_bg/rainy.gif'

export default function EnvironmentDisplay({
  timeOfDayIcon,
  timeOfDay,
  seasonIcon,
  season,
  currentWeather,
  weatherImage,
}) {
  return (
    <div className="bg-gradient-to-b from-[#e6f7ff] to-[#f0f9ff] rounded-3xl p-4 flex-1 flex flex-col justify-between relative w-full max-w-[400px] h-[150px] lg:h-[350px] lg:aspect-square">
      {/* Weather background image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl opacity-80">
        <img src={weatherImage || defaultWeatherBg} alt="Weather" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div className="bg-white/70 backdrop-blur-sm px-2.5 py-2 rounded-lg flex items-center gap-1.5 min-w-[100px] lg:min-w-[90px] xl:min-w-[110px] justify-center">
            <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center">{timeOfDayIcon}</div>
            <span className="font-sniglet text-xs lg:text-sm capitalize">{timeOfDay}</span>
          </div>

          <div className="bg-white/70 backdrop-blur-sm px-2.5 py-2 rounded-lg flex items-center gap-1.5 min-w-[100px] lg:min-w-[90px] xl:min-w-[110px] justify-center">
            <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center text-lg">{seasonIcon}</div>
            <span className="font-sniglet text-xs lg:text-sm capitalize">{season}</span>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Weather Message */}
      <div className="relative z-10 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg">
        <p className="font-sniglet text-xs text-center">
          Your pet {currentWeather.toLowerCase().includes("rain") ? "is staying dry during the" : "enjoys the"}{" "}
          {currentWeather.toLowerCase()} weather!
        </p>
      </div>
    </div>
  )
}

EnvironmentDisplay.propTypes = {
  timeOfDayIcon: PropTypes.node.isRequired,
  timeOfDay: PropTypes.string.isRequired,
  seasonIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  season: PropTypes.string.isRequired,
  currentWeather: PropTypes.string.isRequired,
  weatherImage: PropTypes.string
} 