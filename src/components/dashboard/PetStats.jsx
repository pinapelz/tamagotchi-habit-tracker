import { Heart, Zap, Coffee } from "lucide-react"
import PropTypes from 'prop-types'

export default function PetStats({ petName, petType, petLevel, petStats }) {
  return (
    <div className="bg-white bg-opacity-70 rounded-3xl p-4 flex-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-sniglet text-lg">{petName}</h3>
        <span className="bg-[#ffe0b2] text-sm px-2 py-1 rounded-full font-sniglet">Lvl {petLevel}</span>
      </div>

      <p className="text-sm text-gray-600 mb-4 font-sniglet">Type: {petType}</p>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Heart size={16} className="text-pink-500" />
              <span className="text-xs font-sniglet">Happiness</span>
            </div>
            <span className="text-xs font-sniglet">{petStats.happiness}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-pink-400" style={{ width: `${petStats.happiness}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Zap size={16} className="text-yellow-500" />
              <span className="text-xs font-sniglet">Energy</span>
            </div>
            <span className="text-xs font-sniglet">{petStats.energy}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400" style={{ width: `${petStats.energy}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Coffee size={16} className="text-green-500" />
              <span className="text-xs font-sniglet">Health</span>
            </div>
            <span className="text-xs font-sniglet">{petStats.health}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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