import PropTypes from 'prop-types'
import defaultPet from '../../assets/pets/pixel-cat.gif'

// Import time of day backgrounds
import predawnNight from '../../assets/timeofday/predawn-night.jpg'
import dawn from '../../assets/timeofday/dawn.png'
import sunrise from '../../assets/timeofday/sunrise.png'
import morning from '../../assets/timeofday/morning.webp'
import noon from '../../assets/timeofday/noon.png'
import afternoon from '../../assets/timeofday/afternoon.png'
import evening from '../../assets/timeofday/evening.png'
import sunset from '../../assets/timeofday/sunset.png'
import twilight from '../../assets/timeofday/twlight.webp'
import midnight from '../../assets/timeofday/midnight.webp'

export default function PetDisplay({ petImage, toggleComponent, timeOfDay }) {
  const getTimeOfDayBackground = () => {
    switch (timeOfDay) {
      case "predawn":
      case "night":
        return predawnNight
      case "dawn":
        return dawn
      case "sunrise":
        return sunrise
      case "morning":
        return morning
      case "noon":
        return noon
      case "afternoon":
        return afternoon
      case "evening":
        return evening
      case "sunset":
        return sunset
      case "twilight":
        return twilight
      case "midnight":
        return midnight
      default:
        return morning
    }
  }

  return (
    <div
      className="rounded-3xl flex items-center justify-center relative w-full max-w-[400px] h-[150px] lg:h-[350px] lg:aspect-square"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <img 
          src={getTimeOfDayBackground()} 
          alt="Time of Day Background" 
          className="w-full h-full object-cover"
        />
      </div>
      {toggleComponent && <div className="absolute top-3 left-0 right-0 flex justify-center z-20">{toggleComponent}</div>}
      <img 
        src={petImage || defaultPet} 
        alt="Pet" 
        className="object-contain z-10 relative w-16 h-16 md:w-20 md:h-20 lg:w-32 lg:h-32" 
      />
    </div>
  )
}

PetDisplay.propTypes = {
  petImage: PropTypes.string,
  toggleComponent: PropTypes.node,
  timeOfDay: PropTypes.string
} 