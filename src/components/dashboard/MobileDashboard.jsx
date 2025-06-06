import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Star,
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
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import ShareModal from "../ShareModal";

// Import images
import catGif from "../../assets/pets/pixel-cat.gif";
import dogGif from "../../assets/pets/pixel-dog.gif";
import batGif from "../../assets/pets/pixel-bat.gif";
import duckGif from "../../assets/pets/pixel-duck.gif";
import rainyBg from "../../assets/weather_bg/rainy.gif";
import cloudyBg from "../../assets/weather_bg/cloudy.gif";
import snowBg from "../../assets/weather_bg/snow.png";
import sunnyBg from "../../assets/weather_bg/sunny.jpeg";
import windyBg from "../../assets/weather_bg/windy.gif";
// Import time of day backgrounds
import predawnNight from "../../assets/timeofday/predawn-night.jpg";
import dawn from "../../assets/timeofday/dawn.png";
import sunrise from "../../assets/timeofday/sunrise.png";
import morning from "../../assets/timeofday/morning.webp";
import noon from "../../assets/timeofday/noon.png";
import afternoon from "../../assets/timeofday/afternoon.png";
import evening from "../../assets/timeofday/evening.png";
import sunset from "../../assets/timeofday/sunset.png";
import twilight from "../../assets/timeofday/twlight.webp";
import midnight from "../../assets/timeofday/midnight.webp";

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {boolean} completed
 */

export default function MobileDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [showMenu, setShowMenu] = useState(false);
  const [userName, setUserName] = useState("User");
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentWeather, setCurrentWeather] = useState("Sunny");
  const [weatherImage, setWeatherImage] = useState(sunnyBg);
  const [timeOfDay, setTimeOfDay] = useState("afternoon");
  const [habits, setHabits] = useState([
    { id: "1", name: "Drink Water", completed: false, recurrence: "hourly" },
    { id: "2", name: "Study 1 Hour", completed: false, recurrence: "daily" },
    { id: "3", name: "Stretch", completed: false, recurrence: "weekly" },
  ]);
  const [streak, setStreak] = useState(0);
  const [petStats, setPetStats] = useState({
    happiness: 50,
    energy: 0,
    health: 100,
  });
  const [petName, setPetName] = useState("No Pet");
  const [petType, setPetType] = useState("cat");
  const [petLevel, setPetLevel] = useState(0);
  const [season, setSeason] = useState("spring");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPetStats, setShowPetStats] = useState(true);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitRecurrence, setNewHabitRecurrence] = useState("daily");
  const [isAdding, setIsAdding] = useState(false);
  const formRef = useRef(null);
  const [editHabitId, setEditHabitId] = useState(null);
  const [editHabitName, setEditHabitName] = useState("");
  const [editHabitRecurrence, setEditHabitRecurrence] = useState("daily");
  const editFormRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [accuracy, setAccuracy] = useState(null);

  // Check if the user has a pet
  useEffect(() => {
    const checkPetStatus = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/has-pet`, {
          method: "GET",
          credentials: "include", // Include cookies for session management
        });

        const data = await response.json();

        if (response.ok) {
          if (!data.has_pet) {
            // Redirect to pet creation if the user doesn't have a pet
            navigate("/petcreation");
          }
          // Don't set loading to false here, wait for profile data
        } else {
          console.error("Error checking pet status:", data.message);
          setError(data.message);
        }
      } catch (err) {
        console.error("Error fetching pet status:", err);
        setError("An unexpected error occurred.");
      }
    };

    checkPetStatus();
  }, [navigate]);

  // Load profile data from the API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login')
            return
          }
          throw new Error("Failed to fetch profile data")
        }

        const { data } = await response.json()

        // Set user data from API
        if (data.user) {
          setUserName(data.user.display_name || "User")
        }

        // Set pet data from API
        if (data.pet) {
          setPetName(data.pet.name || "No Pet")
          setPetType(data.pet.type || "cat")
          setPetLevel(data.pet.lvl || 0)
          setPetStats({
            happiness: data.pet.happiness || 50,
            energy: data.pet.xp || 0,
            health: data.pet.health || 100,
          })
        }

        // Set stats data from API
        if (data.stats) {
          setStreak(data.stats.current_streak || 0)
        }

        // Only set loading to false after we have all the data
        setLoading(false)
      } catch (err) {
        console.error("Error fetching profile:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProfileData()

    // Set current date
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString(undefined, options))
  }, [navigate])

  // Update time in real-time
  useEffect(() => {
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

      // Set season based on month
      const month = now.getMonth() // 0-11
      if (month >= 2 && month <= 4) {
        setSeason("spring")
      } else if (month >= 5 && month <= 7) {
        setSeason("summer")
      } else if (month >= 8 && month <= 10) {
        setSeason("autumn")
      } else {
        setSeason("winter")
      }

      // Determine how often to check time
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
      case "autumn":
        return <span className="text-base">🍂</span>
      default:
        return <span className="text-base">🌸</span>
    }
  }

  // Get pet image based on type
  const getPetImage = () => {
    switch(petType.toLowerCase()) {
      case 'cat': return catGif;
      case 'dog': return dogGif;
      case 'duck': return duckGif;
      case 'bat': return batGif;
      default: return catGif; // Default to cat
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

  const getTimeOfDayBackground = () => {
    switch (timeOfDay) {
      case "predawn":
      case "night":
        return predawnNight
      case "dawn":
        return dawn
      case "sunrise":
        return sunrise
      case "morning":
        return morning
      case "noon":
        return noon
      case "afternoon":
        return afternoon
      case "evening":
        return evening
      case "sunset":
        return sunset
      case "twilight":
        return twilight
      case "midnight":
        return midnight
      default:
        return afternoon
    }
  }

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        resetAddHabitForm();
      }
    }

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  const resetAddHabitForm = () => {
    setNewHabitName("");
    setNewHabitRecurrence("daily");
    setIsAdding(false);
  }

  // Close edit popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (editFormRef.current && !editFormRef.current.contains(event.target)) {
        resetEditHabitForm();
      }
    }

    if (editHabitId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editHabitId]);

  const resetEditHabitForm = () => {
    setEditHabitId(null);
    setEditHabitName("");
    setEditHabitRecurrence("daily");
  };

  const openEditHabitForm = (habit) => {
    setEditHabitId(habit.id);
    setEditHabitName(habit.name);
    setEditHabitRecurrence(habit.recurrence || "daily");
  };

  const saveEditedHabit = () => {
    if (editHabitName.trim() !== "") {
      setHabits(habits.map(habit =>
        habit.id === editHabitId
          ? { ...habit, name: editHabitName.trim(), recurrence: editHabitRecurrence }
          : habit
      ));
      resetEditHabitForm();
    }
  };

  const handleSetLocationAutomatically = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setAccuracy(accuracy);

        try {
          const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/set-location`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude, accuracy }),
          });

          if (!response.ok) {
            throw new Error("Failed to update location.");
          }

          setLocationError(null);
          console.log("Location updated successfully.");
        } catch (err) {
          console.error("Error sending location to API:", err);
          setLocationError("Failed to update location automatically.");
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setLocationError("Unable to retrieve your location. Please set it manually.");
      }
    );
  };

  const handleSetLocationManually = async () => {
    if (!latitude || !longitude) {
      setLocationError("Please provide both latitude and longitude.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/set-location`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude: parseFloat(latitude), longitude: parseFloat(longitude), accuracy: null }),
      });

      if (!response.ok) {
        throw new Error("Failed to update location.");
      }

      setLocationError(null);
      console.log("Location updated successfully.");
    } catch (err) {
      console.error("Error sending location to API:", err);
      setLocationError("Failed to update location manually.");
    }
  };

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

        switch (weather.toLowerCase()) {
          case "rainy":
            setWeatherImage(rainyBg);
            break;
          case "cloudy":
            setWeatherImage(cloudyBg);
            break;
          case "snowy":
            setWeatherImage(snowBg);
            break;
          case "sunny":
            setWeatherImage(sunnyBg);
            break;
          case "windy":
            setWeatherImage(windyBg);
            break;
          default:
            setWeatherImage(sunnyBg);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#4abe9c]"></div>
          <p className="text-[#486085] font-sniglet">Loading your pet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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
            <div className="bg-[#fdffe9] rounded-2xl p-5 flex flex-col items-center relative overflow-hidden" style={{ height: "320px" }}>
              {/* Time of day background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={getTimeOfDayBackground()}
                  alt="Time of Day"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col items-center w-full h-full">
                {/* Toggle button */}
                <button
                  onClick={() => setShowPetStats(!showPetStats)}
                  className="absolute top-2 right-2 p-1.5 bg-white/60 backdrop-blur-sm rounded-full hover:bg-white/80 transition-colors z-20"
                >
                  {showPetStats ?
                    <Eye size={18} className="text-gray-700" /> :
                    <EyeOff size={18} className="text-gray-700" />
                  }
                </button>

                <div className={`transition-all duration-300 ${!showPetStats ? 'mt-auto mb-8' : 'mb-3'}`}>
                  <img src={getPetImage()} alt="Pet" className="w-[100px] h-[100px] object-contain" />
                </div>

                {!showPetStats && (
                  <div className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-center mb-2">
                    <h3 className="font-sniglet text-xs">{petName} · Lvl {petLevel}</h3>
                  </div>
                )}

                {showPetStats && (
                  <div className="w-full bg-white/50 backdrop-blur-sm rounded-xl p-3 transition-opacity duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-sniglet text-sm">{petName}</h3>
                      <span className="bg-[#ffe0b2] text-xs px-2 py-0.5 rounded-full font-sniglet">Lvl {petLevel}</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500" />
                            <span className="text-xs font-sniglet">XP</span>
                          </div>
                          <span className="text-xs font-sniglet">{petStats.energy}/100</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400" style={{ width: `${petStats.energy}%` }}></div>
                        </div>
                      </div>

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
                )}
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
              {/* Weather Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={weatherImage}
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
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer ${
                      habit.completed ? "bg-green-100" : "bg-white"
                    }`}
                    onClick={() => toggleHabitCompletion(habit.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`text-sm font-sniglet text-left flex items-center gap-2 ${
                        habit.completed ? "line-through text-gray-500" : ""
                      }`}>
                        {habit.completed && <Check size={16} className="text-green-500" />}
                        <div className="flex flex-col">
                          <span>{habit.name}</span>
                          {habit.recurrence && (
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar size={12} className="mr-1" />
                              {habit.recurrence.charAt(0).toUpperCase() + habit.recurrence.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="p-1 hover:bg-gray-100 rounded-full"
                        onClick={() => openEditHabitForm(habit)}
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
                <button
                  className="w-full bg-[#f8ffea] border border-gray-300 text-black py-2 rounded-full font-sniglet text-sm hover:bg-[#edf5df] transition-colors flex items-center justify-center gap-1"
                  onClick={() => setIsAdding(true)}
                >
                  <Plus size={16} />
                  Add Habit
                </button>
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

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-sniglet text-gray-800">Set Location</h3>
              {locationError && <div className="text-red-500">{locationError}</div>}
              <button
                onClick={handleSetLocationAutomatically}
                className="bg-[#c8c6ff] text-black px-6 py-2 rounded-full font-sniglet text-sm hover:bg-[#b5b3e6] transition-colors border border-[#b5b3e6]"
              >
                Set Location Automatically
              </button>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 font-sniglet text-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 font-sniglet text-sm bg-white/50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
                <button
                  onClick={handleSetLocationManually}
                  className="w-full bg-[#cbffc6] text-black px-6 py-2 rounded-full font-sniglet text-sm hover:bg-[#b8edb3] transition-colors border border-[#b8edb3]"
                >
                  Set Manually
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Habit Popup for Mobile */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div
            ref={formRef}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn"
          >
            <h3 className="text-lg font-medium mb-3">Add New Habit</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 mb-1">
                  Habit name
                </label>
                <input
                  id="habitName"
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
                  Recurrence
                </label>
                <select
                  id="recurrence"
                  value={newHabitRecurrence}
                  onChange={(e) => setNewHabitRecurrence(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="daily">Hourly</option>
                  <option value="weekly">Daily</option>
                  <option value="monthly">Weekly</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={resetAddHabitForm}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newHabitName.trim() !== "") {
                      const newHabit = {
                        id: Date.now().toString(),
                        name: newHabitName.trim(),
                        recurrence: newHabitRecurrence,
                        completed: false
                      };
                      addHabit(newHabit);
                      resetAddHabitForm();
                    }
                  }}
                  className="bg-[#e79c2d] text-white px-3 py-1.5 rounded hover:bg-[#d38c1d]"
                >
                  Add Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Habit Popup */}
      {editHabitId && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div
            ref={editFormRef}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn"
          >
            <h3 className="text-lg font-medium mb-3">Edit Habit</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="editHabitName" className="block text-sm font-medium text-gray-700 mb-1">
                  Habit name
                </label>
                <input
                  id="editHabitName"
                  type="text"
                  value={editHabitName}
                  onChange={(e) => setEditHabitName(e.target.value)}
                  placeholder="Enter habit name"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="editRecurrence" className="block text-sm font-medium text-gray-700 mb-1">
                  Recurrence
                </label>
                <select
                  id="editRecurrence"
                  value={editHabitRecurrence}
                  onChange={(e) => setEditHabitRecurrence(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="weekends">Weekends only</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={resetEditHabitForm}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedHabit}
                  className="bg-[#e79c2d] text-white px-3 py-1.5 rounded hover:bg-[#d38c1d]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

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
