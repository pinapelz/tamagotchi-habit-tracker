import { X } from 'lucide-react'
import { useState } from 'react'

export default function SettingsModal({ isOpen, onClose, userName, setUserName, theme, setTheme, onSave, onReset }) {
  const [locationError, setLocationError] = useState(null)
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [accuracy, setAccuracy] = useState(null)

  const handleSetLocationAutomatically = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLatitude(latitude)
        setLongitude(longitude)
        setAccuracy(accuracy)

        try {
          const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/set-location`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude, accuracy }),
          })

          if (!response.ok) {
            throw new Error("Failed to update location.")
          }

          setLocationError(null)
          console.log("Location updated successfully.")
        } catch (err) {
          console.error("Error sending location to API:", err)
          setLocationError("Failed to update location automatically.")
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error)
        setLocationError("Unable to retrieve your location. Please set it manually.")
      }
    )
  }

  const handleSetLocationManually = async () => {
    if (!latitude || !longitude) {
      setLocationError("Please provide both latitude and longitude.")
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/set-location`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude: parseFloat(latitude), longitude: parseFloat(longitude), accuracy: null }),
      })

      if (!response.ok) {
        throw new Error("Failed to update location.")
      }

      setLocationError(null)
      console.log("Location updated successfully.")
      window.location.reload()
    } catch (err) {
      console.error("Error sending location to API:", err)
      alert("Failed to update location manually");
      setLocationError("Failed to update location manually. Ensure your inputs are valid latitude and longitude coordinates");
    }
  }

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

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-sniglet text-gray-800">Set Location</h3>
              {locationError && <div className="text-red-500">{locationError}</div>}
              <button
                onClick={handleSetLocationAutomatically}
                className="bg-[#c8c6ff] text-gray-700 px-6 py-2 rounded-full font-sniglet text-base hover:bg-[#b5b3e6] transition-colors border border-[#b5b3e6]"
              >
                Set Location Automatically
              </button>
              <div className="relative">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 flex-1 font-sniglet text-base bg-white/50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2 flex-1 font-sniglet text-base bg-white/50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-start">
                  <button
                    onClick={handleSetLocationManually}
                    className="bg-[#cbffc6] text-gray-700 px-6 py-4 rounded-full font-sniglet text-base hover:bg-[#b8edb3] transition-colors border border-[#b8edb3]"
                  >
                    Set Manually
                  </button>
                </div>
              </div>
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
