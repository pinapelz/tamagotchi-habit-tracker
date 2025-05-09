import { useState, useEffect } from "react"
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
      const seconds = now.getSeconds()
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
      } else if (currentHour >= 20 && currentHour < 21) {
        setTimeOfDay("twilight")
      } else {
        setTimeOfDay("night")
      }

      // Determine how often to check time based on how close we are to any time transition
      let nextInterval = 60000; // Default is 1 minute
      
      // List of all transition hours
      const transitions = [0, 3, 5, 6, 7, 11, 13, 17, 19, 20, 21, 23];
      
      // Check if we're near any transition (1 minute before or after)
      const isNearTransition = transitions.some(hour => {
        // If we're at the transition hour and within first minute
        if (currentHour === hour && minutes <= 1) return true;
        
        // If we're at the hour before transition and within last minute
        const prevHour = (hour === 0) ? 23 : hour - 1;
        if (currentHour === prevHour && minutes >= 59) return true;
        
        return false;
      });
      
      // Check if we're approaching a transition (10 minutes before or after)
      const isApproachingTransition = transitions.some(hour => {
        // If we're at the transition hour and within first 10 minutes
        if (currentHour === hour && minutes <= 10) return true;
        
        // If we're at the hour before transition and within last 10 minutes
        const prevHour = (hour === 0) ? 23 : hour - 1;
        if (currentHour === prevHour && minutes >= 50) return true;
        
        return false;
      });
      
      if (isNearTransition) {
        nextInterval = 1000; // Check every second right around transitions
      } else if (isApproachingTransition) {
        nextInterval = 5000; // Check every 5 seconds near transitions
      }
      
      return nextInterval;
    }

    // Update time immediately
    let nextCheckDelay = updateTime()
    
    // Use a recursive setTimeout instead of setInterval to allow dynamic timing
    let timeoutId = setTimeout(function checkTime() {
      nextCheckDelay = updateTime();
      timeoutId = setTimeout(checkTime, nextCheckDelay);
    }, nextCheckDelay);

    return () => clearTimeout(timeoutId);
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