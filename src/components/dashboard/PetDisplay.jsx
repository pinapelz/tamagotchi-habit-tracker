import PropTypes from 'prop-types'
import petBg from '../../assets/pet_bg/meadow_day.png'
import defaultPet from '../../assets/pets/pixel-cat.gif'

export default function PetDisplay({ petImage, toggleComponent }) {
  return (
    <div
      className="rounded-3xl flex items-center justify-center relative"
      style={{ width: "240px", height: "240px" }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <img 
          src={petBg} 
          alt="Meadow Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {toggleComponent && <div className="absolute top-3 left-0 right-0 flex justify-center z-10">{toggleComponent}</div>}
      <img src={petImage || defaultPet} alt="Pet" width={80} height={80} className="object-contain z-10 relative" />
    </div>
  )
}

PetDisplay.propTypes = {
  petImage: PropTypes.string,
  toggleComponent: PropTypes.node
} 