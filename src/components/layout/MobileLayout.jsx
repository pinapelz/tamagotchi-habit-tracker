import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Home, User, Users, Trophy, Bell, HelpCircle, Settings, LogOut, Cloud, CloudRain, Sun, Moon } from 'lucide-react'

export default function MobileLayout({ children, userName, onToggleSettings }) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [currentWeather, setCurrentWeather] = useState("")
  const [timeOfDay, setTimeOfDay] = useState("morning")

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/');
    }
  };

  // Update time in real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      let hours = now.getHours()
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12
      hours = hours ? hours : 12
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

    updateTime()
    const intervalId = setInterval(updateTime, 1000)
    return () => clearInterval(intervalId)
  }, [])

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/weather`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const weather = data.weather;
        const formattedWeather = weather.charAt(0).toUpperCase() + weather.slice(1);
        setCurrentWeather(formattedWeather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setCurrentWeather("Sunny"); // Fallback weather
      }
    };

    fetchWeather();
  }, []);

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

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', action: () => navigate('/dashboard') },
    { icon: <User size={20} />, label: 'Profile', action: () => navigate('/profile') },
    { icon: <Users size={20} />, label: 'Friends', action: () => navigate('/friends') },
    { icon: <Trophy size={20} />, label: 'Leaderboard', action: () => navigate('/leaderboard') },
    { icon: <Bell size={20} />, label: 'Notifications', action: () => navigate('/notifications') },
    { icon: <HelpCircle size={20} />, label: 'Help', action: () => navigate('/help') },
    { icon: <Settings size={20} />, label: 'Settings', action: () => navigate('/settings') },
    { icon: <LogOut size={20} />, label: 'Logout', action: handleLogout },
  ]

  return (
    <div className="min-h-screen bg-[#def8fb] flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 rounded-full hover:bg-gray-100">
            {showMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="text-lg font-sniglet">Tamagotchi Tracker</h1>
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
                      {item.action ? (
                        <button
                          onClick={() => {
                            item.action();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-3"
                        >
                          {item.icon}
                          <span className="font-sniglet">{item.label}</span>
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors flex items-center gap-3"
                          onClick={() => setShowMenu(false)}
                        >
                          {item.icon}
                          <span className="font-sniglet">{item.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
