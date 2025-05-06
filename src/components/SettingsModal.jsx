import PropTypes from 'prop-types'
import { X } from 'lucide-react'

export default function SettingsModal({ isOpen, onClose, userName, setUserName, theme, setTheme, onSave, onReset }) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-xl w-full relative pointer-events-auto shadow-xl border border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8">
            <button
              className="text-[#f51616] text-base border border-[#f51616] px-4 py-2 rounded-md font-sniglet hover:bg-red-50 transition-colors"
              onClick={onReset}
            >
              Reset
            </button>
            <h2 className="text-2xl font-sniglet text-gray-800">Settings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <label htmlFor="name" className="text-base font-sniglet w-28 text-gray-700">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 flex-1 font-sniglet text-base bg-white/50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-base font-sniglet w-28 text-gray-700">Theme:</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-6 py-2 rounded-full font-sniglet text-base transition-all ${
                    theme === "light"
                      ? "bg-white border-2 border-purple-200 text-purple-600"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-6 py-2 rounded-full font-sniglet text-base transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 text-white border-2 border-gray-600"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-base font-sniglet w-28 text-gray-700">Change Pet:</label>
              <button className="bg-[#cbffc6] text-gray-700 px-6 py-2 rounded-full font-sniglet text-base hover:bg-[#b8edb3] transition-colors border border-[#b8edb3]">
                Choose New Pet
              </button>
            </div>

            <div className="flex justify-center mt-10">
              <button
                onClick={onSave}
                className="bg-[#c8c6ff] text-gray-700 px-10 py-3 rounded-full font-sniglet text-lg hover:bg-[#b5b3e6] transition-colors border border-[#b5b3e6]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  setUserName: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  setTheme: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
} 