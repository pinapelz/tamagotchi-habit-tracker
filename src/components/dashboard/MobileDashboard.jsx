import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Menu,
  X,
  Home,
  BarChart2,
  Settings,
  Plus,
  Cloud,
  CloudRain,
  Sun,
  Moon,
  Trash2,
  MessageCircle,
  Heart,
  Zap,
  Coffee,
  Snowflake,
  Sunrise,
  Sunset,
  User,
  Users,
  Trophy,
  Bell,
  HelpCircle,
  LogOut,
  Share2,
  Check,
  Pencil,
} from "lucide-react"

// Import images
import catGif from "../../assets/pets/pixel-cat.gif"
import rainyBg from "../../assets/pet_bg/rainy.gif"

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {boolean} completed
 */

export default function MobileDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("home")
  const [showMenu, setShowMenu] = useState(false)
  const [userName, setUserName] = useState("Alex")
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("5/6/2025")
  const [currentWeather, setCurrentWeather] = useState("Rainy")
  const [timeOfDay, setTimeOfDay] = useState("afternoon")
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink Water", completed: true },
    { id: "2", name: "Study 1 Hour", completed: false },
    { id: "3", name: "Stretch", completed: false },
  ])
  const [streak, setStreak] = useState(5)
  const [petStats, setPetStats] = useState({
    happiness: 85,
    energy: 70,
    health: 90,
  })
  const [season, setSeason] = useState("spring")
  const [showShareModal, setShowShareModal] = useState(false)
  const [newHabitName, setNewHabitName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Update time in real-time
  useEffect(() => {
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
      } else if (currentHour >= 20 && currentHour < 21) {
        setTimeOfDay("twilight")
      } else {
        setTimeOfDay("night")
      }
    }

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

  const addHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  }
  
  const editHabit = (id, newName) => {
    setHabits(habits.map(habit => habit.id === id ? { ...habit, name: newName } : habit));
  }

  const getWeatherIcon = () => {
    if (currentWeather.toLowerCase().includes("rain")) {
      return <CloudRain className="text-blue-500" size={20} />
    } else if (currentWeather.toLowerCase().includes("cloud")) {
      return <Cloud className="text-blue-400" size={20} />
    } else if (timeOfDay === "night") {
      return <Moon className="text-indigo-400" size={20} />
    } else {
      return <Sun className="text-yellow-400" size={20} />
    }
  }

  const getTimeOfDayIcon = () => {
    switch (timeOfDay) {
      case "morning":
        return <Sunrise className="text-yellow-400" size={20} />
      case "afternoon":
        return <Sun className="text-yellow-500" size={20} />
      case "evening":
        return <Sunset className="text-orange-400" size={20} />
      case "night":
        return <Moon className="text-indigo-400" size={20} />
      default:
        return <Sun className="text-yellow-400" size={20} />
    }
  }

  const getSeasonIcon = () => {
    switch (season) {
      case "winter":
        return <Snowflake className="text-blue-300" size={20} />
      case "spring":
        return <span className="text-base">🌸</span>
      case "summer":
        return <span className="text-base">☀️</span>
      case "fall":
        return <span className="text-base">🍂</span>
      default:
        return <span className="text-base">🌸</span>
    }
  }

  const handleLogout = () => {
    navigate("/")
  }

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/dashboard' },
    { icon: <User size={20} />, label: 'Profile', href: '/profile' },
    { icon: <Users size={20} />, label: 'Friends', href: '/friends' },
    { icon: <Trophy size={20} />, label: 'Leaderboard', href: '/leaderboard' },
    { icon: <Bell size={20} />, label: 'Notifications', href: '/notifications' },
    { icon: <HelpCircle size={20} />, label: 'Help', href: '/not-found' },
    { icon: <Settings size={20} />, label: 'Settings', href: '#', action: () => setActiveTab('settings') },
    { icon: <LogOut size={20} />, label: 'Logout', href: '/logout' },
  ]

  return (
    <div className="min-h-screen bg-[#def8fb] flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full hover:bg-gray-100">
            {showMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button onClick={() => navigate('/')} className="hover:opacity-80 transition">
            <h1 className="text-lg font-sniglet">Tamagotchi Tracker</h1>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {getWeatherIcon()}
          <span className="text-sm font-sniglet">{currentWeather}</span>
          <span className="text-sm font-sniglet border-l border-gray-300 pl-2">{currentTime}</span>
        </div>
      </header>

      {/* Slide-out Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-opacity-50" onClick={() => setShowMenu(false)}>
          <div className="w-64 h-full bg-white p-4 animate-slide-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* User Profile Section */}
              <div className="mb-6 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-medium">{userName[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-gray-500">View Profile</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => {
                          if (item.label === 'Logout') {
                            handleLogout()
                          } else if (item.action) {
                            item.action()
                            setShowMenu(false)
                          } else {
                            navigate(item.href)
                            setShowMenu(false)
                          }
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-3"
                      >
                        {item.icon}
                        <span className="font-sniglet">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 py-5 overflow-auto">
        {activeTab === "home" && (
          <div className="space-y-5">
            {/* Pet Display */}
            <div className="bg-[#fdffe9] rounded-2xl p-5 flex flex-col items-center">
              <div className="mb-3">
                <img src={catGif} alt="Pet" className="w-[100px] h-[100px] object-contain" />
              </div>

              <div className="w-full bg-white bg-opacity-70 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-sniglet text-sm">Whiskers</h3>
                  <span className="bg-[#ffe0b2] text-xs px-2 py-0.5 rounded-full font-sniglet">Lvl 3</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Heart size={14} className="text-pink-500" />
                        <span className="text-xs font-sniglet">Happiness</span>
                      </div>
                      <span className="text-xs font-sniglet">{petStats.happiness}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-400" style={{ width: `${petStats.happiness}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Zap size={14} className="text-yellow-500" />
                        <span className="text-xs font-sniglet">Energy</span>
                      </div>
                      <span className="text-xs font-sniglet">{petStats.energy}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400" style={{ width: `${petStats.energy}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Coffee size={14} className="text-green-500" />
                        <span className="text-xs font-sniglet">Health</span>
                      </div>
                      <span className="text-xs font-sniglet">{petStats.health}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400" style={{ width: `${petStats.health}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white bg-opacity-70 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌱</span>
                  <h3 className="font-sniglet text-sm">Progress</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-sniglet">
                    <span className="font-medium">
                      {completedHabits}/{totalHabits}
                    </span>{" "}
                    Today
                  </span>
                  <span className="font-sniglet border-l border-gray-400 pl-2">
                    <span className="font-medium animate-pulse">{streak}</span> Day Streak
                  </span>
                </div>
              </div>

              <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-400"
                  style={{ width: `${(completedHabits / totalHabits) * 100}%` }}
                ></div>
                <div
                  className="h-full bg-red-400"
                  style={{ width: `${((totalHabits - completedHabits) / totalHabits) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Environment Display */}
            <div
              className="bg-gradient-to-b from-[#e6f7ff] to-[#f0f9ff] rounded-2xl overflow-hidden relative"
              style={{ height: "280px" }}
            >
              {/* Rainy GIF Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={rainyBg}
                  alt="Weather"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div className="bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 min-w-[110px] justify-center">
                    {getTimeOfDayIcon()}
                    <span className="text-sm font-sniglet capitalize">{timeOfDay}</span>
                  </div>

                  <div className="bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center gap-2 min-w-[110px] justify-center">
                    {getSeasonIcon()}
                    <span className="text-sm font-sniglet capitalize">{season}</span>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-sm px-3 py-2 rounded-lg mt-auto">
                  <p className="font-sniglet text-sm text-center">
                    Your pet{" "}
                    {currentWeather.toLowerCase().includes("rain") ? "is staying dry during the" : "enjoys the"}{" "}
                    {currentWeather.toLowerCase()} weather!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "habits" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-medium">Habit Tracker</h2>
                <p className="font-sniglet text-sm text-gray-600">{currentDate}</p>
              </div>
              <button 
                className="bg-[#5dd6e8] text-black px-3 py-1.5 rounded-full font-sniglet text-sm flex items-center"
                onClick={() => setShowShareModal(true)}
              >
                <Share2 size={14} className="mr-1.5" />
                Share
              </button>
            </div>

            <div className="bg-[#f0e8ff] rounded-2xl p-4">
              <div className="space-y-3 mb-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      habit.completed ? "bg-green-100" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => toggleHabitCompletion(habit.id)}
                        className={`text-sm font-sniglet text-left flex items-center gap-2 ${
                          habit.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {habit.completed && <Check size={16} className="text-green-500" />}
                        {habit.name}
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-full"
                        onClick={() => {
                          const newName = prompt("Edit habit name:", habit.name);
                          if (newName !== null && newName.trim() !== "") {
                            editHabit(habit.id, newName);
                          }
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded-full" 
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full">
                {isAdding ? (
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      placeholder="Enter habit name"
                      className="border border-gray-300 rounded px-3 py-1 text-sm w-full"
                    />
                    <button
                      onClick={() => {
                        if (newHabitName.trim() !== "") {
                          const newHabit = {
                            id: Date.now().toString(),
                            name: newHabitName,
                            completed: false
                          };
                          addHabit(newHabit);
                          setNewHabitName("");
                          setIsAdding(false);
                        }
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full bg-[#f8ffea] border border-gray-300 text-black py-2 rounded-full font-sniglet text-sm hover:bg-[#edf5df] transition-colors flex items-center justify-center gap-1"
                    onClick={() => setIsAdding(true)}
                  >
                    <Plus size={16} />
                    Add Habit
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <h3 className="text-sm font-sniglet mb-1">Completed Today</h3>
                <p className="text-xl font-medium">
                  {completedHabits}/{totalHabits}
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <h3 className="text-sm font-sniglet mb-1">Current Streak</h3>
                <p className="text-xl font-medium">{streak} days</p>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={18} className="text-[#e79c2d]" />
                <p className="font-sniglet text-sm">"You're doing great! Keep going!"</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base">🐾</span>
                <p className="font-sniglet text-xs">Your pet looks happy today. Keep up the good habits!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-[#fdffe9] rounded-2xl p-4">
            <h2 className="text-center text-lg font-sniglet mb-4">Settings</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-sniglet">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-2 px-1 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-sniglet">Theme</label>
                <div className="flex gap-3">
                  <button className="px-4 py-1.5 rounded-full text-sm font-sniglet bg-white border-2 border-gray-300">
                    Light
                  </button>
                  <button className="px-4 py-1.5 rounded-full text-sm font-sniglet bg-gray-300 hover:bg-gray-400">
                    Dark
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-sniglet">Change Pet</label>
                <button className="bg-[#cbffc6] text-black px-4 py-1.5 rounded-full font-sniglet text-sm hover:bg-[#b8edb3] transition-colors">
                  Choose New Pet
                </button>
              </div>

              <div className="pt-3 flex justify-center">
                <button className="bg-[#c8c6ff] text-black px-8 py-2 rounded-full font-sniglet text-sm hover:bg-[#b5b3e6] transition-colors">
                  Save Changes
                </button>
              </div>

              <div className="pt-1 flex justify-center">
                <button className="text-[#f51616] border border-[#f51616] px-4 py-1.5 rounded-md font-sniglet text-sm hover:bg-red-50 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center p-1.5 ${activeTab === "home" ? "text-[#e79c2d]" : "text-gray-500"}`}
        >
          <Home size={20} />
          <span className="text-xs font-sniglet mt-0.5">Home</span>
        </button>
        <button
          onClick={() => setActiveTab("habits")}
          className={`flex flex-col items-center p-1.5 ${activeTab === "habits" ? "text-[#e79c2d]" : "text-gray-500"}`}
        >
          <BarChart2 size={20} />
          <span className="text-xs font-sniglet mt-0.5">Habits</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center p-1.5 ${
            activeTab === "settings" ? "text-[#e79c2d]" : "text-gray-500"
          }`}
        >
          <Settings size={20} />
          <span className="text-xs font-sniglet mt-0.5">Settings</span>
        </button>
      </nav>
    </div>
  )
} 