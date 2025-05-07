import { Link } from "react-router-dom"
import { Settings } from "lucide-react"
import PropTypes from 'prop-types'

export default function Header({ currentTime, toggleSettings }) {
  return (
    <header className="w-full px-4 py-4 flex justify-between items-center border-b border-blue-100">
      <div className="flex items-center gap-4">
        <div className="w-10"></div> 
        <Link to="/" className="text-[#000000] text-2xl font-sniglet hover:opacity-80 transition-opacity">
          Tamagotchi Tracker
        </Link>
      </div>
      <div className="flex items-center gap-4 mr-4">
        <span className="text-blue-600 font-sniglet text-2xl">{currentTime}</span>
        <button 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
          onClick={toggleSettings}
        >
          <Settings size={32} className="text-gray-600" />
        </button>
        <Link to="/" className="bg-[#ff7f7f] text-black px-4 py-2 rounded-full font-sniglet text-base">
          Logout
        </Link>
      </div>
    </header>
  )
}

Header.propTypes = {
  currentTime: PropTypes.string.isRequired,
  toggleSettings: PropTypes.func.isRequired
} 