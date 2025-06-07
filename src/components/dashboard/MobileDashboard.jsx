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
  Wind,
  CloudLightning,
} from "lucide-react";
import ShareModal from "../ShareModal";

// Import images
import catGif from "../../assets/pets/pixel-cat.gif";
import dogGif from "../../assets/pets/pixel-dog.gif";
import batGif from "../../assets/pets/pixel-bat.gif";
import duckGif from "../../assets/pets/pixel-duck.gif";
import rainyBg from "../../assets/weather_bg/rainy.gif";
import cloudyBg from "../../assets/weather_bg/cloudy.gif";
import snowBg from "../../assets/weather_bg/snowy.gif";
import sunnyBg from "../../assets/weather_bg/sunny.jpeg";
import windyBg from "../../assets/weather_bg/windy.gif";
import thunderBg from "../../assets/weather_bg/thunder.gif";
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
  const [habits, setHabits] = useState([]);
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
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [theme, setTheme] = useState("light");
  const [isSaving, setIsSaving] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCompletingHabit, setIsCompletingHabit] = useState(false);
  const [completingHabitId, setCompletingHabitId] = useState(null);
  const [dailyMessage, setDailyMessage] = useState("");

  const getWeatherMessage = (weather) => {
    const weatherType = weather.toLowerCase();
    
    switch (weatherType) {
      case 'sunny':
        return "Your pet is basking in the sunshine!";
      case 'rainy':
        return "Your pet is staying dry and cozy inside!";
      case 'cloudy':
        return "Your pet is enjoying the cool, cloudy day!";
      case 'snowy':
        return "Your pet is watching the snowflakes fall!";
      case 'windy':
        return "Your pet's fur is blowing in the breeze!";
      case 'thunder':
        return "Your pet is safe and sound during the storm!";
      case 'foggy':
        return "Your pet is exploring the misty morning!";
      default:
        return `Your pet is enjoying the ${weatherType} weather!`;
    }
  };

  // Add motivational messages array
  const motivationalMessages = [
    "You're doing great! Keep going!",
    "Every small step counts towards your goals!",
    "Your dedication is inspiring!",
    "You're making amazing progress!",
    "Stay focused, stay motivated!",
    "You've got this! Keep pushing forward!",
    "Your consistency is paying off!",
    "Small steps, big results!",
    "You're stronger than you think!",
    "Keep up the amazing work!",
    "Your future self thanks you!",
    "You're building great habits!",
    "Success is built one day at a time!",
    "You're on the right track!",
    "Your determination is impressive!",
    "Today's effort is tomorrow's success!",
    "You're creating positive change!",
    "Every day is a new opportunity!",
    "Your progress is remarkable!",
    "Keep shining bright!",
    "You're unstoppable!",
    "Your potential is limitless!",
    "Making habits, making history!",
    "You're becoming your best self!",
    "Your journey is inspiring!",
    "Keep that momentum going!",
    "You're crushing it!",
    "Your dedication is paying off!",
    "Making progress, one habit at a time!",
    "You're a habit-forming superstar!",
    "Your consistency is your superpower!",
    "Keep building your success story!",
    "You're making it happen!",
    "Your efforts are creating change!",
    "Stay strong, stay consistent!",
    "You're on fire today!",
    "Your progress is unstoppable!",
    "Keep that positive energy flowing!",
    "You're a habit-building champion!",
    "Your dedication is remarkable!",
    "Making every day count!",
    "You're building a better future!",
    "Your commitment is inspiring!",
    "Keep that winning streak going!",
    "You're a force of positive change!",
    "Your habits are shaping your destiny!",
    "Making progress, one day at a time!",
    "You're a habit-forming hero!",
    "Your consistency is your strength!",
    "Keep building your success!"
  ];

  // Function to get a random message based on the date
  const getDailyMessage = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const messageIndex = dayOfYear % motivationalMessages.length;
    return motivationalMessages[messageIndex];
  };

  // Function to get pet status message based on stats
  const getPetStatusMessage = () => {
    const { happiness, health, energy } = petStats;
    
    // Happiness levels based on percentage:
    // 90-100% = Ecstatic
    // 80-89% = Thriving
    // 70-79% = Great spirits
    // 60-69% = Happy
    // 50-59% = Content
    // 40-49% = Okay
    // 30-39% = Down
    // 20-29% = Sad
    // 10-19% = Struggling
    // 0-9% = Critical
    if (happiness >= 90 && health >= 90 && energy >= 90) {
      return "Your pet is absolutely ecstatic! They're jumping with joy! 🌟";
    } else if (happiness >= 80 && health >= 80 && energy >= 80) {
      return "Your pet is thriving and full of energy! They're so happy! 🎉";
    } else if (happiness >= 70 && health >= 70 && energy >= 70) {
      return "Your pet is in great spirits! They're loving life! 😊";
    } else if (happiness >= 60 && health >= 60 && energy >= 60) {
      return "Your pet looks happy today. Keep up the good habits! 🎆";
    } else if (happiness >= 50 && health >= 50 && energy >= 50) {
      return "Your pet is content, but could use some more attention. 🐱";
    } else if (happiness >= 40 && health >= 40 && energy >= 40) {
      return "Your pet is doing okay, but seems a bit bored. Maybe play with them? ⚽";
    } else if (happiness >= 30 && health >= 30 && energy >= 30) {
      return "Your pet seems a bit down. They could use some extra love! 💕";
    } else if (happiness >= 20 && health >= 20 && energy >= 20) {
      return "Your pet is feeling sad. They miss spending time with you! 😢";
    } else if (happiness >= 10 && health >= 10 && energy >= 10) {
      return "Your pet is really struggling. They need your help right now! 🆘";
    } else {
      return "Your pet is in critical condition! Please complete some habits to cheer them up! 🚨";
    }
  };

  // Set daily message on component mount
  useEffect(() => {
    setDailyMessage(getDailyMessage());
  }, []);

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

  // Move fetchProfileData outside useEffect
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

  // Load profile data from the API
  useEffect(() => {
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

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const todayDate = today.getDate(); // 1-31

  const isHabitCompletedToday = (habit) => {
    if (!habit.last_completed_at) return false;

    const completedDate = new Date(habit.last_completed_at);
    const today = new Date();

    return (
      completedDate.getFullYear() === today.getFullYear() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getDate() === today.getDate()
    );
  };

  const isHabitDueToday = (habit) => {
    const type = habit.recurrence;
    if (!type) return false;

    switch (type) {
      case "daily":
        return true;
      case "weekdays":
        return dayOfWeek >= 1 && dayOfWeek <= 5;
      case "weekends":
        return dayOfWeek === 0 || dayOfWeek === 6;
      case "weekly": {
        // Run weekly habit on same day of the week as it was created
        const created = new Date(habit.created_at);
        return created.getDay() === dayOfWeek;
      }
      case "monthly": {
        // Run monthly habit on the same day of the month as it was created
        const created = new Date(habit.created_at);
        return created.getDate() === todayDate;
      }
      default:
        return false;
    }
  };

  const todaysHabits = habits.filter(isHabitDueToday);
  const completedHabits = todaysHabits.filter(isHabitCompletedToday).length;
  const totalHabits = todaysHabits.length;

  // Add sorting function
  const sortHabits = (habitsList) => {
    return [...habitsList].sort((a, b) => {
      // First sort by completion status (incomplete first)
      const aCompleted = isHabitCompletedToday(a);
      const bCompleted = isHabitCompletedToday(b);
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      // Then sort by creation date (newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  // Fetch habits from the API
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error("Failed to fetch habits");
        }

        const data = await response.json();
        setHabits(sortHabits(data));
      } catch (err) {
        console.error("Error fetching habits:", err);
        setError(err.message);
      }
    };

    fetchHabits();
  }, [navigate]);

  const toggleHabitCompletion = async (id) => {
    if (isCompletingHabit) return; // Prevent multiple clicks
    
    try {
      setIsCompletingHabit(true);
      setCompletingHabitId(id);

      // Optimistically update the UI
      const updatedHabits = habits.map(habit => 
        habit.id === id 
          ? { ...habit, last_completed_at: new Date().toISOString() }
          : habit
      );
      setHabits(sortHabits(updatedHabits));

      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits/complete`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habit_id: id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.message || `Failed to complete habit: ${response.statusText}`);
      }

      const data = await response.json();

      // Calculate happiness increase based on completion rate
      // Happiness is on a 0-100 scale where:
      // 0-20% = Very Sad
      // 21-40% = Sad
      // 41-60% = Neutral
      // 61-80% = Happy
      // 81-100% = Very Happy
      const completionRate = (completedHabits + 1) / totalHabits;
      let happinessIncrease;
      
      if (completionRate >= 0.8) {
        // Completing 80% or more of daily habits
        happinessIncrease = 15; // +15% happiness
      } else if (completionRate >= 0.5) {
        // Completing 50-79% of daily habits
        happinessIncrease = 12; // +12% happiness
      } else if (completionRate >= 0.25) {
        // Completing 25-49% of daily habits
        happinessIncrease = 8; // +8% happiness
      } else {
        // Completing less than 25% of daily habits
        happinessIncrease = 5; // +5% happiness
      }

      // Update pet stats with increased happiness
      setPetStats(prevStats => ({
        ...prevStats,
        // Ensure happiness stays between 0-100%
        happiness: Math.min(100, Math.max(0, prevStats.happiness + happinessIncrease)),
        energy: Math.min(100, prevStats.energy + 10)
      }));

      // After successful completion, fetch the updated habits list
      const habitsResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
        method: "GET",
        credentials: "include",
      });

      if (!habitsResponse.ok) {
        const errorData = await habitsResponse.json().catch(() => ({}));
        console.error('Server error response:', {
          status: habitsResponse.status,
          statusText: habitsResponse.statusText,
          error: errorData
        });
        throw new Error(errorData.message || `Failed to fetch updated habits: ${habitsResponse.statusText}`);
      }

      const habitsData = await habitsResponse.json();
      setHabits(sortHabits(habitsData));

      // Update streak
      setStreak(data.streak);

      // Refresh profile data to update stats including streak
      await fetchProfileData();
    } catch (err) {
      console.error("Error completing habit:", err);
      // Revert optimistic update on error
      const revertedHabits = habits.map(habit => 
        habit.id === id 
          ? { ...habit, last_completed_at: null }
          : habit
      );
      setHabits(sortHabits(revertedHabits));
      setError(err.message);
    } finally {
      setIsCompletingHabit(false);
      setCompletingHabitId(null);
    }
  };

  const deleteHabit = async (id) => {
    try {
      const updatedHabits = habits.filter((habit) => habit.id !== id);
      setHabits(sortHabits(updatedHabits));

      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete habit");
      }

      // After successful deletion, fetch the updated habits list
      const habitsResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
        method: "GET",
        credentials: "include",
      });

      if (!habitsResponse.ok) {
        throw new Error("Failed to fetch updated habits");
      }

      const habitsData = await habitsResponse.json();
      setHabits(sortHabits(habitsData));
    } catch (err) {
      console.error("Error deleting habit:", err);
      setError(err.message);
    }
  };

  const addHabit = async (newHabit) => {
    try {
      const updatedHabits = [...habits, { ...newHabit, created_at: new Date().toISOString() }];
      setHabits(sortHabits(updatedHabits));

      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newHabit.name,
          recurrence: newHabit.recurrence,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create habit");
      }

      // After successful creation, fetch the updated habits list
      const habitsResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
        method: "GET",
        credentials: "include",
      });

      if (!habitsResponse.ok) {
        throw new Error("Failed to fetch updated habits");
      }

      const habitsData = await habitsResponse.json();
      setHabits(sortHabits(habitsData));
      setIsAdding(false);
      setNewHabitName("");
      setNewHabitRecurrence("daily");
    } catch (err) {
      console.error("Error creating habit:", err);
      setError(err.message);
    }
  };

  const editHabit = (id, newName) => {
    setHabits(habits.map(habit => habit.id === id ? { ...habit, name: newName } : habit));
  }

  const getWeatherIcon = () => {
    if (currentWeather.toLowerCase().includes("thunder")) {
      return <CloudLightning className="text-indigo-500" size={20} />
    } else if (currentWeather.toLowerCase().includes("rain")) {
      return <CloudRain className="text-blue-500" size={20} />
    } else if (currentWeather.toLowerCase().includes("cloud")) {
      return <Cloud className="text-blue-400" size={20} />
    } else if (currentWeather.toLowerCase().includes("wind")) {
      return <Wind className="text-gray-400" size={20} />
    } else if (currentWeather.toLowerCase().includes("snow")) {
      return <Snowflake className="text-blue-300" size={20} />
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
    { icon: <Home size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <User size={20} />, label: 'Profile', href: '/profile' },
    { icon: <Users size={20} />, label: 'Friends', href: '/friends' },
    { icon: <Trophy size={20} />, label: 'Leaderboard', href: '/leaderboard' },
    { icon: <Bell size={20} />, label: 'Notifications', href: '/notifications' },
    { icon: <HelpCircle size={20} />, label: 'Help', href: '/help' },
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

  const saveEditedHabit = async () => {
    if (!editHabitId) return;

    try {
      const updatedHabits = habits.map(habit =>
        habit.id === editHabitId
          ? { ...habit, name: editHabitName, recurrence: editHabitRecurrence }
          : habit
      );
      setHabits(sortHabits(updatedHabits));

      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits/${editHabitId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editHabitName,
          recurrence_type: editHabitRecurrence,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update habit");
      }

      // After successful update, fetch the updated habits list
      const habitsResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
        method: "GET",
        credentials: "include",
      });

      if (!habitsResponse.ok) {
        throw new Error("Failed to fetch updated habits");
      }

      const habitsData = await habitsResponse.json();
      setHabits(sortHabits(habitsData));

      setEditHabitId(null);
      setEditHabitName("");
      setEditHabitRecurrence("daily");
    } catch (err) {
      console.error("Error updating habit:", err);
      setError(err.message);
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
          case "thunder":
            setWeatherImage(thunderBg);
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

  const handleReset = async () => {
    try {
      // Fetch the original profile data
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const { data } = await response.json();

      // Reset all settings to their original values
      setUserName(data.user.display_name || "User");
      setTimezone(data.user.timezone || "America/Los_Angeles");
      setTheme(data.user.theme || "light");
      setLatitude("");
      setLongitude("");
      setAccuracy(null);
      setLocationError(null);

    } catch (err) {
      console.error("Error resetting settings:", err);
      alert("Failed to reset settings. Please try again.");
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: userName,
          timezone: timezone,
          theme: theme,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      // Refresh profile data to ensure everything is in sync
      await fetchProfileData();
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings:", err);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

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
                    {getWeatherMessage(currentWeather)}
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
                {habits.map((habit) => {
                  const dueToday = isHabitDueToday(habit);
                  const completedToday = isHabitCompletedToday(habit);
                  const isCompleting = completingHabitId === habit.id;

                  return (
                    <div
                      key={habit.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isCompleting ? 'opacity-50' : 'cursor-pointer'
                      } ${
                        completedToday ? "bg-green-100" : "bg-white"
                      }`}
                      onClick={() => !isCompleting && dueToday && !completedToday && toggleHabitCompletion(habit.id)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`text-sm font-sniglet text-left flex items-center gap-2 ${
                          completedToday ? "line-through text-gray-500" : ""
                        }`}>
                          {completedToday && <Check size={16} className="text-green-500" />}
                          {isCompleting && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-500"></div>}
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
                          disabled={isCompleting}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded-full"
                          onClick={() => deleteHabit(habit.id)}
                          disabled={isCompleting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
              <div className="bg-[#fdffe9] rounded-xl p-3 shadow-sm">
                <h3 className="text-sm font-sniglet mb-1">Completed Today</h3>
                <p className="text-xl font-medium">
                  {completedHabits}/{totalHabits}
                </p>
              </div>
              <div className="bg-[#fdffe9] rounded-xl p-3 shadow-sm">
                <h3 className="text-sm font-sniglet mb-1">Current Streak</h3>
                <p className="text-xl font-medium">{streak} days</p>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-[#fdffe9] rounded-2xl p-4 shadow-sm mt-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={18} className="text-[#e79c2d]" />
                <p className="font-sniglet text-sm">{dailyMessage}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base">🐾</span>
                <p className="font-sniglet text-xs">{getPetStatusMessage()}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-5">
            {/* Settings Header */}
            <div className="bg-[#fdffe9] rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-sniglet">Settings</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded text-sm"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#5dd6e8] text-black px-4 py-1.5 rounded text-sm hover:bg-[#4bc5d7] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
              
              {/* Name Section */}
              <div className="space-y-2 mb-4">
                <label htmlFor="name" className="block text-sm font-sniglet text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
              </div>

              {/* Timezone Section */}
              <div className="space-y-2 mb-4">
                <label htmlFor="timezone" className="block text-sm font-sniglet text-gray-700">
                  Timezone
                </label>
                <select
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                >
                  {Intl.supportedValuesOf('timeZone').map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Section */}
              <div className="space-y-2">
                <label className="block text-sm font-sniglet text-gray-700">Theme</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                      theme === "light"
                        ? "bg-white border-2 border-purple-200 text-purple-600"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                      theme === "dark"
                        ? "bg-gray-800 text-white border-2 border-gray-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* <div className="space-y-2">
              <label className="block text-sm font-sniglet">Change Pet</label>
              <button className="bg-[#cbffc6] text-black px-4 py-1.5 rounded-full font-sniglet text-sm hover:bg-[#b8edb3] transition-colors">
                Choose New Pet
              </button>
            </div> */}

            {/* Location Settings */}
            <div className="bg-[#fdffe9] rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-sniglet text-gray-700 mb-3">Location Settings</h3>
              {locationError && <div className="text-red-500 text-sm mb-3">{locationError}</div>}
              
              <button
                onClick={handleSetLocationAutomatically}
                className="w-full bg-[#c8c6ff] text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#b5b3e6] transition-colors border border-[#b5b3e6] mb-3"
              >
                Set Location Automatically
              </button>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
                <button
                  onClick={handleSetLocationManually}
                  className="w-full bg-[#cbffc6] text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#b8edb3] transition-colors border border-[#b8edb3]"
                >
                  Set Manually
                </button>
              </div>
            </div>

            {/* Data Management Section */}
            <div className="bg-[#fdffe9] rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-sniglet text-gray-700 mb-3">Data Management</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowExportConfirm(true)}
                  className="w-full bg-[#e6f7ff] text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#b3e0ff] transition-colors border border-[#b3e0ff] flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Export Data
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete Account
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
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="weekends">Weekends only</option>
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

      {/* Export Confirmation Modal */}
      {showExportConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
            <h3 className="text-lg font-medium mb-3">Export Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will download a JSON file containing your profile information, pet data, and habits.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowExportConfirm(false)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsExporting(true);
                  try {
                    const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
                      method: "GET",
                      credentials: "include",
                    });

                    if (!response.ok) {
                      throw new Error("Failed to fetch user data");
                    }

                    const { data } = await response.json();
                    
                    const exportData = {
                      user: {
                        display_name: data.user.display_name,
                        timezone: data.user.timezone,
                        theme: data.user.theme,
                        avatar_url: data.user.avatar_url
                      },
                      pet: {
                        name: data.pet.name,
                        type: data.pet.type,
                        lvl: data.pet.lvl,
                        happiness: data.pet.happiness,
                        health: data.pet.health,
                        xp: data.pet.xp
                      },
                      stats: {
                        current_streak: data.stats.current_streak
                      },
                      habits: habits,
                      settings: {
                        theme,
                        timezone
                      }
                    };

                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `tamagotchi-data-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    setShowExportConfirm(false);
                  } catch (error) {
                    console.error('Error exporting data:', error);
                    alert('Failed to export data. Please try again.');
                  } finally {
                    setIsExporting(false);
                  }
                }}
                disabled={isExporting}
                className="bg-[#e79c2d] text-white px-3 py-1.5 rounded text-sm hover:bg-[#d38c1d] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm animate-fadeIn">
            <h3 className="text-lg font-medium mb-3">Delete Account</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete all your data, including your pet, habits, and progress. This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
                    method: 'DELETE',
                    credentials: 'include',
                  })
                  .then(response => {
                    if (response.ok) {
                      navigate('/');
                    } else {
                      throw new Error('Failed to delete account');
                    }
                  })
                  .catch(error => {
                    console.error('Error deleting account:', error);
                    alert('Failed to delete account. Please try again.');
                  });
                }}
                className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

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
