"use client"

import { MessageCircle } from "lucide-react"
import PropTypes from 'prop-types'

export default function StatusCard({ userName, weatherIcon, currentWeather }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-sniglet">Hello, "{userName}"!</h2>

        {/* Larger weather display */}
        <div className="flex items-center gap-2 bg-[#f0f9ff] px-4 py-2 rounded-xl">
          <span className="font-sniglet text-sm text-gray-600">Current weather:</span>
          {weatherIcon}
          <p className="font-sniglet text-base">{currentWeather}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <MessageCircle size={18} className="text-[#e79c2d]" />
        <p className="font-sniglet text-base">"You're doing great! Keep going!"</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-lg">🐾</span>
        <p className="font-sniglet text-sm">Your pet looks happy today. Keep up the good habits!</p>
      </div>
    </div>
  )
}

StatusCard.propTypes = {
  userName: PropTypes.string.isRequired,
  weatherIcon: PropTypes.node.isRequired,
  currentWeather: PropTypes.string.isRequired
} 