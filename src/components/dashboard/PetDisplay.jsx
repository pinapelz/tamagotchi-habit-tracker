"use client"

import PropTypes from 'prop-types'

export default function PetDisplay({ petImage, toggleComponent }) {
  return (
    <div
      className="bg-[#fdffe9] rounded-3xl flex items-center justify-center relative"
      style={{ width: "240px", height: "240px" }}
    >
      {toggleComponent && <div className="absolute top-3 left-0 right-0 flex justify-center">{toggleComponent}</div>}
      <img src={petImage || "/src/assets/pets/pixel-cat.gif"} alt="Pet" width={80} height={80} className="object-contain" />
    </div>
  )
}

PetDisplay.propTypes = {
  petImage: PropTypes.string.isRequired,
  toggleComponent: PropTypes.node
} 