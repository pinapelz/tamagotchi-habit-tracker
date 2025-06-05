export default function EnvironmentDisplay({
  timeOfDayIcon,
  timeOfDay,
  seasonIcon,
  season,
  currentWeather,
  weatherImage,
}) {
  return (
    <div className="bg-gradient-to-b from-[#e6f7ff] to-[#f0f9ff] rounded-3xl p-4 flex-1 flex flex-col justify-between relative w-full h-full min-h-[300px] md:min-h-[250px] lg:min-h-[350px] 2xl:h-[55vh]">
      {/* Weather background image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl opacity-80">
        <img src={weatherImage} alt="Weather" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-4 px-2">
          <div className="bg-white/70 backdrop-blur-sm px-2.5 py-1.5 md:px-2 md:py-1 lg:px-3 lg:py-2 2xl:px-4 2xl:py-3 rounded-lg flex items-center gap-1.5 md:gap-1 lg:gap-2 2xl:gap-3 min-w-[100px] md:min-w-[90px] lg:min-w-[90px] xl:min-w-[95px] 2xl:min-w-[100px] justify-center">
            <div className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 flex items-center justify-center">{timeOfDayIcon}</div>
            <span className="font-sniglet text-xs md:text-xs lg:text-sm 2xl:text-base capitalize">{timeOfDay}</span>
          </div>

          <div className="bg-white/70 backdrop-blur-sm px-2.5 py-1.5 md:px-2 md:py-1 lg:px-3 lg:py-2 2xl:px-4 2xl:py-3 rounded-lg flex items-center gap-1.5 md:gap-1 lg:gap-2 2xl:gap-3 min-w-[100px] md:min-w-[90px] lg:min-w-[90px] xl:min-w-[95px] 2xl:min-w-[100px] justify-center">
            <div className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8 flex items-center justify-center text-lg">{seasonIcon}</div>
            <span className="font-sniglet text-xs md:text-xs lg:text-sm 2xl:text-base capitalize">{season}</span>
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Weather Message */}
      <div className="relative z-10 bg-white/70 backdrop-blur-sm px-3 py-2 md:px-3 md:py-1.5 lg:px-4 lg:py-3 2xl:px-6 2xl:py-4 rounded-lg">
        <p className="font-sniglet text-xs md:text-xs lg:text-sm 2xl:text-lg text-center">
          Your pet {currentWeather.toLowerCase().includes('rain') ? 'is staying dry during the' : 'enjoys the'}{' '}
          {currentWeather.toLowerCase()} weather!
        </p>
      </div>
    </div>
  );
}