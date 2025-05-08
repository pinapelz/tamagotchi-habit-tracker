import { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import SettingsModal from "../SettingsModal"
import StatusCard from "./StatusCard"
import PetDisplay from "./PetDisplay"
import EnvironmentDisplay from "./EnvironmentDisplay"
import PetStats from "./PetStats"
import DisplayToggle from "./DisplayToggle"
import HabitTracker from "./HabitTracker"
import ProgressBar from "./ProgressBar"
import Layout from "../layout/Layout"
import { getTimeOfDayIcon, getWeatherIcon, getSeasonIcon } from "./WeatherUtils"

export default function DashboardRedesign() {
  const [showSettings, setShowSettings] = useState(false)
  const [userName, setUserName] = useState("Alex")
  const [theme, setTheme] = useState("light")
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("5/5/2025")
  const [currentWeather, setCurrentWeather] = useState("Rainy")
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink Water", completed: false },
    { id: "2", name: "Study 1 Hour", completed: false },
    { id: "3", name: "Stretch", completed: false },
  ])
  const [streak, setStreak] = useState(5)

  // Environment settings
  const [timeOfDay, setTimeOfDay] = useState("morning")
  const [season, setSeason] = useState("spring")

  // Pet stats
  const [petName, setPetName] = useState("Whiskers")
  const [petType, setPetType] = useState("Cat")
  const [petLevel, setPetLevel] = useState(3)
  const [petStats, setPetStats] = useState({
    happiness: 85,
    energy: 70,
    health: 90,
  })

  // Toggle between environment and pet stats views
  const [activeView, setActiveView] = useState("environment")

  // Update time in real-time
  useEffect(() => {
    // Function to format the current time
    const updateTime = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const ampm = hours >= 12 ? "PM" : "AM"

      // Convert to 12-hour format
      hours = hours % 12
      hours = hours ? hours : 12 // the hour '0' should be '12'

      setCurrentTime(`${hours}:${minutes} ${ampm}`)

      // Update timeOfDay based on current hour
      const currentHour = now.getHours()

      if (currentHour >= 0 && currentHour < 3) {
        setTimeOfDay("midnight")
      } else if (currentHour >= 3 && currentHour < 5) {
        setTimeOfDay("predawn")
      } else if (currentHour >= 5 && currentHour < 6) {
        setTimeOfDay("dawn")
      } else if (currentHour >= 6 && currentHour < 7) {
        setTimeOfDay("sunrise")
      } else if (currentHour >= 7 && currentHour < 11) {
        setTimeOfDay("morning")
      } else if (currentHour >= 11 && currentHour < 13) {
        setTimeOfDay("noon")
      } else if (currentHour >= 13 && currentHour < 17) {
        setTimeOfDay("afternoon")
      } else if (currentHour >= 17 && currentHour < 19) {
        setTimeOfDay("evening")
      } else if (currentHour >= 19 && currentHour < 20) {
        setTimeOfDay("sunset")
      } else if (currentHour >= 20 && currentHour < 22) {
        setTimeOfDay("twilight")
      } else {
        setTimeOfDay("night")
      }
    }

    // Update time immediately
    updateTime()

    const intervalId = setInterval(updateTime, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const completedHabits = habits.filter((habit) => habit.completed).length
  const totalHabits = habits.length

  const toggleHabitCompletion = (id) => {
    setHabits(habits.map((habit) => (habit.id === id ? { ...habit, completed: !habit.completed } : habit)))
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings)
  }

  const handleSaveSettings = () => {
    console.log("Saving settings:", { userName, theme })
    setShowSettings(false)
  }

  const handleResetSettings = () => {
    setUserName("")
    setTheme("light")
    // More reset logic here
  }

  const handleToggleView = (view) => {
    setActiveView(view)
  }

  const toggleComponent = <DisplayToggle activeView={activeView} onToggle={handleToggleView} />


  return (
    <Layout userName={userName} onToggleSettings={toggleSettings}>
      <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: "#DEF8FB" }}>
        {/* Main Content */}
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-4 mt-8 max-w-none mx-auto w-full">
          {/* Left Column */}
          <div className="flex flex-col">
            {/* Status Card */}
            <div className="mb-6 lg:-mr-4">
              <StatusCard
                userName={userName}
                weatherIcon={getWeatherIcon(currentWeather)}
                currentWeather={currentWeather}
              />
            </div>

            {/* Pet Display with Environment or Stats */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Pet Display with Toggle */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <PetDisplay
                  petImage={null}
                  toggleComponent={toggleComponent}
                  timeOfDay={timeOfDay}
                />
              </div>

              {/* Environment Display or Pet Stats based on toggle */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                {activeView === "environment" ? (
                  <EnvironmentDisplay
                    timeOfDayIcon={getTimeOfDayIcon(timeOfDay)}
                    timeOfDay={timeOfDay}
                    seasonIcon={getSeasonIcon(season)}
                    season={season}
                    currentWeather={currentWeather}
                    weatherImage={null}
                  />
                ) : (
                  <PetStats petName={petName} petType={petType} petLevel={petLevel} petStats={petStats} />
                )}
              </div>
            </div>
            {/* Pet Emotion Box */}
            <div className="relative bg-white/90 rounded-3xl border-blue-100 px-8 py-6 w-full max-w-4xl mx-auto mt-8 shadow-lg">
              <div className="flex items-center gap-4">
                {/* Pet avatar/icon */}
                <div className="w-14 h-14 rounded-full bg-blue-100 flex-shrink-0 border-2 border-blue-300 overflow-hidden">
                  <img
                    src={`/assets/pets/${petType.toLowerCase()}-icon.png`}
                    alt="Emotion"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/pets/default-pet-icon.png';
                    }}
                  />
                </div>

                {/* Speech bubble */}
                <div className="relative w-full">
                  <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                  </div>
                  <div className="w-full h-32 p-5 rounded-2xl bg-blue-50 border border-blue-200 text-gray-700 flex items-center text-lg font-medium shadow-sm">
                    "I'm feeling happy and energetic today! I love the rainy weather!"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Habit tracker and progress */}
          <div className="flex flex-col gap-4 lg:max-w-[98%] lg:ml-4">
            {/* Habit Tracker */}
            <HabitTracker
              habits={habits}
              currentDate={currentDate}
              toggleHabitCompletion={toggleHabitCompletion}
              deleteHabit={deleteHabit}
            />

            {/* Progress Section */}
            <ProgressBar completedHabits={completedHabits} totalHabits={totalHabits} streak={streak} />
          </div>
        </main>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={toggleSettings}
          userName={userName}
          setUserName={setUserName}
          theme={theme}
          setTheme={setTheme}
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
        />
      </div>
    </Layout>
  )
} 