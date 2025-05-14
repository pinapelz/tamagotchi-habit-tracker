import { Heart, Zap, Coffee, Star } from "lucide-react"
import PropTypes from 'prop-types'

export default function PetStats({ petName, petType, petLevel, petStats }) {
  return (
    <div className="bg-white bg-opacity-70 rounded-3xl p-3 md:p-4 lg:p-6 flex-1 flex flex-col justify-between relative w-full h-full min-h-[300px] md:min-h-[250px] lg:min-h-[350px] 2xl:h-[55vh] overflow-hidden">
      <div className="md:-mt-1">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <h3 className="font-sniglet text-base lg:text-2xl 2xl:text-3xl">{petName}</h3>
          <span className="bg-[#ffe0b2] text-xs lg:text-base 2xl:text-lg px-2 py-0.5 lg:px-3 lg:py-1 2xl:px-4 2xl:py-1.5 rounded-full font-sniglet">Lvl {petLevel}</span>
        </div>

        <p className="text-xs lg:text-lg 2xl:text-xl text-gray-600 mb-1 lg:mb-2 font-sniglet">Type: {petType}</p>
      </div>

      <div className="space-y-1.5 lg:space-y-6 2xl:space-y-8 lg:mt-8">
        <div>
          <div className="flex items-center justify-between mb-0.5 lg:mb-2 2xl:mb-3">
            <div className="flex items-center gap-1 lg:gap-2 2xl:gap-3">
              <Star size={14} className="text-yellow-500 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8" />
              <span className="text-[10px] lg:text-base 2xl:text-lg font-sniglet">XP</span>
            </div>
            <span className="text-[10px] lg:text-base 2xl:text-lg font-sniglet">{petStats.energy}/1000</span>
          </div>
          <div className="h-1 lg:h-2 2xl:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${(petStats.energy / 1000) * 100}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-0.5 lg:mb-2 2xl:mb-3">
            <div className="flex items-center gap-1 lg:gap-2 2xl:gap-3">
              <Heart size={14} className="text-pink-500 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8" />
              <span className="text-[10px] lg:text-base 2xl:text-lg font-sniglet">Happiness</span>
            </div>
            <span className="text-[10px] lg:text-base 2xl:text-lg font-sniglet">{petStats.happiness}%</span>
          </div>
          <div className="h-1 lg:h-2 2xl:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400" style={{ width: `${petStats.happiness}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-0.5 lg:mb-2 2xl:mb-3">
            <div className="flex items-center gap-1 lg:gap-2 2xl:gap-3">
              <Coffee size={14} className="text-green-500 lg:w-6 lg:h-6 2xl:w-8 2xl:h-8" />
              <span className="text-[10px] lg:text-base 2xl:text-lg font-sniglet">Health</span>
            </div>
            <span className="text-[10px] lg:text-base 2xl:text-lg font-sniglet">{petStats.health}%</span>
          </div>
          <div className="h-1 lg:h-2 2xl:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-400" style={{ width: `${petStats.health}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
