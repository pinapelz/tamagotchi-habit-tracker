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
      className="rounded-3xl flex items-center justify-center relative w-full h-full min-h-[300px] md:min-h-[250px] lg:min-h-[350px] 2xl:h-[55vh]"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <img 
          src={getTimeOfDayBackground()} 
          alt="Time of Day Background" 
          className="w-full h-full object-cover"
        />
      </div>
      {toggleComponent && <div className="absolute top-3 left-0 right-0 flex justify-center z-20 2xl:scale-150 2xl:pt-2">{toggleComponent}</div>}
      <div className="relative z-10 flex items-end h-full pb-8">
        <img 
          src={petImage || defaultPet} 
          alt="Pet" 
          className="object-contain w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 2xl:w-[16vh] 2xl:h-[16vh]" 
        />
      </div>
    </div>
  )
}

PetDisplay.propTypes = {
  petImage: PropTypes.string,
  toggleComponent: PropTypes.node,
  timeOfDay: PropTypes.string
} 