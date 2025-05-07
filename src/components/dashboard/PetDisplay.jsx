import PropTypes from 'prop-types'
import petBg from '../../assets/pet_bg/meadow_day.png'
import defaultPet from '../../assets/pets/pixel-cat.gif'

export default function PetDisplay({ petImage, toggleComponent }) {
  return (
    <div
      className="rounded-3xl flex items-center justify-center relative w-full max-w-[400px] h-[150px] lg:h-[350px] lg:aspect-square"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <img 
          src={petBg} 
          alt="Meadow Background" 
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
  toggleComponent: PropTypes.node
} 