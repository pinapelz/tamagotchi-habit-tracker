import { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import SettingsModal from "../SettingsModal"
import Header from "./Header"
import StatusCard from "./StatusCard"
import PetDisplay from "./PetDisplay"
import EnvironmentDisplay from "./EnvironmentDisplay"
import PetStats from "./PetStats"
import DisplayToggle from "./DisplayToggle"
import HabitTracker from "./HabitTracker"
import ProgressBar from "./ProgressBar"
import SideMenu from "./SideMenu"
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

      if (currentHour >= 4 && currentHour < 5) {
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
      } else if (currentHour >= 20 && currentHour < 21) {
        setTimeOfDay("twilight")
      } else if (currentHour >= 21 && currentHour < 23) {
        setTimeOfDay("night")
      } else {
        setTimeOfDay("midnight")
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
    <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: "#DEF8FB" }}>
      {/* Header */}
      <Header currentTime={currentTime} toggleSettings={toggleSettings} />

      {/* Side Menu */}
      <SideMenu userName={userName} />

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 px-8 py-4 mt-8 max-w-[1400px] mx-auto w-full">
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
  )
} 