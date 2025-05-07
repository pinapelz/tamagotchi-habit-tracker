import { Heart, Zap, Coffee } from "lucide-react"
import PropTypes from 'prop-types'

export default function PetStats({ petName, petType, petLevel, petStats }) {
  return (
    <div className="bg-white bg-opacity-70 rounded-3xl p-3 md:p-4 lg:p-6 flex-1 flex flex-col justify-between relative w-full max-w-[400px] h-[150px] lg:h-[350px] lg:aspect-square overflow-hidden">
      <div className="md:-mt-1">
        <div className="flex items-center justify-between mb-1 lg:mb-2">
          <h3 className="font-sniglet text-base lg:text-2xl">{petName}</h3>
          <span className="bg-[#ffe0b2] text-xs lg:text-base px-2 py-0.5 lg:px-3 lg:py-1 rounded-full font-sniglet">Lvl {petLevel}</span>
        </div>

        <p className="text-xs lg:text-lg text-gray-600 mb-1 lg:mb-2 font-sniglet">Type: {petType}</p>
      </div>

      <div className="space-y-1.5 lg:space-y-6 lg:mt-8">
        <div>
          <div className="flex items-center justify-between mb-0.5 lg:mb-2">
            <div className="flex items-center gap-1 lg:gap-2">
              <Heart size={14} className="text-pink-500 lg:w-6 lg:h-6" />
              <span className="text-[10px] lg:text-base font-sniglet">Happiness</span>
            </div>
            <span className="text-[10px] lg:text-base font-sniglet">{petStats.happiness}%</span>
          </div>
          <div className="h-1 lg:h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400" style={{ width: `${petStats.happiness}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-0.5 lg:mb-2">
            <div className="flex items-center gap-1 lg:gap-2">
              <Zap size={14} className="text-yellow-500 lg:w-6 lg:h-6" />
              <span className="text-[10px] lg:text-base font-sniglet">Energy</span>
            </div>
            <span className="text-[10px] lg:text-base font-sniglet">{petStats.energy}%</span>
          </div>
          <div className="h-1 lg:h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${petStats.energy}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-0.5 lg:mb-2">
            <div className="flex items-center gap-1 lg:gap-2">
              <Coffee size={14} className="text-green-500 lg:w-6 lg:h-6" />
              <span className="text-[10px] lg:text-base font-sniglet">Health</span>
            </div>
            <span className="text-[10px] lg:text-base font-sniglet">{petStats.health}%</span>
          </div>
          <div className="h-1 lg:h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-400" style={{ width: `${petStats.health}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

PetStats.propTypes = {
  petName: PropTypes.string.isRequired,
  petType: PropTypes.string.isRequired,
  petLevel: PropTypes.number.isRequired,
  petStats: PropTypes.shape({
    happiness: PropTypes.number.isRequired,
    energy: PropTypes.number.isRequired,
    health: PropTypes.number.isRequired
  }).isRequired
} 