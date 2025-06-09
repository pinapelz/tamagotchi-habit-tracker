import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingsModal from "../SettingsModal";
import StatusCard from "./StatusCard";
import PetDisplay from "./PetDisplay";
import EnvironmentDisplay from "./EnvironmentDisplay";
import PetStats from "./PetStats";
import DisplayToggle from "./DisplayToggle";
import HabitTracker from "./HabitTracker";
import ProgressBar from "./ProgressBar";
import Layout from "../layout/Layout";
import Loading from "../../pages/Loading";
import {
  getTimeOfDayIcon,
  getWeatherIcon,
  getSeasonIcon,
} from "./WeatherUtils";
import pixelCat from "../../assets/pets/pixel-cat.gif";
import pixelBat from "../../assets/pets/pixel-bat.gif";
import pixelDuck from "../../assets/pets/pixel-duck.gif";
import pixelDog from "../../assets/pets/pixel-dog.gif";
import rainyBg from "../../assets/weather_bg/rainy.gif";
import cloudyBg from "../../assets/weather_bg/cloudy.gif";
import snowBg from "../../assets/weather_bg/snowy.gif";
import sunnyBg from "../../assets/weather_bg/sunny.jpeg";
import windyBg from "../../assets/weather_bg/windy.gif";
import thunderBg from "../../assets/weather_bg/thunder.gif";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Calendar } from "lucide-react";
import ShareModal from "../ShareModal";

export default function DashboardRedesign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const [locationError, setLocationError] = useState(null);

  const checkAndSetLocation = async () => {
    try {
      const hasLocationResponse = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/has-location`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!hasLocationResponse.ok) {
        throw new Error("Failed to check location status.");
      }

      const { has_location } = await hasLocationResponse.json();

      if (has_location) {
        console.log("Location is already set. Skipping location update.");
        return;
      }

      requestAndSendLocation();
    } catch (err) {
      console.error("Error checking location status:", err);
      setLocationError(err.message);
    }
  };

  const requestAndSendLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_DOMAIN}/api/set-location`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ latitude, longitude, accuracy }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update location.");
          }

          console.log("Location updated successfully.");
        } catch (err) {
          console.error("Error sending location to API:", err);
          setLocationError(err.message);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setLocationError(
          "Unable to retrieve your location. Please manually set it in settings"
        );
      }
    );
  };

  useEffect(() => {
    checkAndSetLocation();
  }, []);
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentWeather, setCurrentWeather] = useState("Sunny");
  const [weatherImage, setWeatherImage] = useState(sunnyBg);

  // Environment settings
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [season, setSeason] = useState("spring");

  // Toggle between environment and pet stats views
  const [activeView, setActiveView] = useState("environment");

  // Habit state
  const [habits, setHabits] = useState([]);
  const [isCompletingHabit, setIsCompletingHabit] = useState(false);
  const [completingHabitId, setCompletingHabitId] = useState(null);

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

  // Add function to calculate XP needed for next level
  const calculateXPForNextLevel = (currentLevel) => {
    // Base XP requirement increases by 50 XP each level
    // Level 1: 100 XP
    // Level 2: 150 XP
    // Level 3: 200 XP
    // Level 4: 250 XP
    // And so on...
    return 100 + (currentLevel * 50);
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch profile data");
      }

      const { data } = await response.json();
      
      // Calculate XP needed for next level based on current level
      if (data.pet) {
        const xpToNextLevel = calculateXPForNextLevel(data.pet.lvl || 0);
        data.pet.xpToNextLevel = xpToNextLevel;
      }
      
      setProfile(data);

      // Initialize habits from backend data
      const habitsRes = await fetch(
        `${import.meta.env.VITE_API_DOMAIN}/api/habits`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const habitsData = await habitsRes.json();
      setHabits(sortHabits(habitsData));

      // Only set loading to false after we have all the data
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    fetchProfileData();
  }, [navigate]);

  // Check if the user has a pet
  useEffect(() => {
    const checkPetStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_DOMAIN}/api/has-pet`,
          {
            method: "GET",
            credentials: "include", // Include cookies for session management
          }
        );

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

  // Update time in real-time
  useEffect(() => {
    // Function to format the current time and date
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      setCurrentTime(`${hours}:${minutes} ${ampm}`);

      // Set current date
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      setCurrentDate(now.toLocaleDateString(undefined, options));

      // Update timeOfDay based on current hour
      const currentHour = now.getHours();

      if (currentHour >= 0 && currentHour < 3) {
        setTimeOfDay("midnight");
      } else if (currentHour >= 3 && currentHour < 5) {
        setTimeOfDay("predawn");
      } else if (currentHour >= 5 && currentHour < 6) {
        setTimeOfDay("dawn");
      } else if (currentHour >= 6 && currentHour < 7) {
        setTimeOfDay("sunrise");
      } else if (currentHour >= 7 && currentHour < 11) {
        setTimeOfDay("morning");
      } else if (currentHour >= 11 && currentHour < 13) {
        setTimeOfDay("noon");
      } else if (currentHour >= 13 && currentHour < 17) {
        setTimeOfDay("afternoon");
      } else if (currentHour >= 17 && currentHour < 19) {
        setTimeOfDay("evening");
      } else if (currentHour >= 19 && currentHour < 20) {
        setTimeOfDay("sunset");
      } else if (currentHour >= 20 && currentHour < 21) {
        setTimeOfDay("twilight");
      } else {
        setTimeOfDay("night");
      }

      // Set season based on month
      const month = now.getMonth(); // 0-11
      if (month >= 2 && month <= 4) {
        setSeason("spring");
      } else if (month >= 5 && month <= 7) {
        setSeason("summer");
      } else if (month >= 8 && month <= 10) {
        setSeason("autumn");
      } else {
        setSeason("winter");
      }

      // Determine how often to check time
      let nextInterval = 60000; // Default is 1 minute

      // List of all transition hours
      const transitions = [0, 3, 5, 6, 7, 11, 13, 17, 19, 20, 21, 23];

      // Check if we're near any transition (1 minute before or after)
      const isNearTransition = transitions.some((hour) => {
        if (currentHour === hour && minutes <= 1) return true;
        const prevHour = hour === 0 ? 23 : hour - 1;
        if (currentHour === prevHour && minutes >= 59) return true;
        return false;
      });

      // Check if we're approaching a transition (10 minutes before or after)
      const isApproachingTransition = transitions.some((hour) => {
        if (currentHour === hour && minutes <= 10) return true;
        const prevHour = hour === 0 ? 23 : hour - 1;
        if (currentHour === prevHour && minutes >= 50) return true;
        return false;
      });

      if (isNearTransition) {
        nextInterval = 1000; // Check every second right around transitions
      } else if (isApproachingTransition) {
        nextInterval = 5000; // Check every 5 seconds near transitions
      }

      return nextInterval;
    };

    // Update time immediately
    let nextCheckDelay = updateTime();

    // Use a recursive setTimeout instead of setInterval to allow dynamic timing
    let timeoutId = setTimeout(function checkTime() {
      nextCheckDelay = updateTime();
      timeoutId = setTimeout(checkTime, nextCheckDelay);
    }, nextCheckDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  // Calculate completed habits OLD CODE
  //const completedHabits = habits.filter((habit) => habit.completed).length;
  //const totalHabits = habits.length;

  //NEW COMPLETED HABITS LOGIC
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

  // Get pet image based on type
  const getPetImage = (petType) => {
    if (!petType) return pixelCat; // Default to cat

    switch (petType.toLowerCase()) {
      case "cat":
        return pixelCat;
      case "dog":
        return pixelDog;
      case "duck":
        return pixelDuck;
      case "bat":
        return pixelBat;
      default:
        return pixelCat;
    }
  };

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

      // Calculate happiness increase based on completion rate
      const todaysHabits = habits.filter(isHabitDueToday);
      const completedHabits = todaysHabits.filter(isHabitCompletedToday).length;
      const totalHabits = todaysHabits.length;
      const completionRate = (completedHabits + 1) / totalHabits;
      
      let happinessIncrease;
      if (completionRate >= 0.8) {
        happinessIncrease = 15;
      } else if (completionRate >= 0.5) {
        happinessIncrease = 12;
      } else if (completionRate >= 0.25) {
        happinessIncrease = 8;
      } else {
        happinessIncrease = 5;
      }

      const newHappiness = Math.min(100, Math.max(0, profile?.pet?.happiness + happinessIncrease));

      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits/complete`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          habit_id: id,
          happiness: newHappiness 
        }),
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

      // Calculate XP gain (10 XP per habit completion)
      const xpGain = 10;
      const newEnergy = profile?.pet?.xp + xpGain;
      const xpToNextLevel = calculateXPForNextLevel(profile?.pet?.lvl || 0);

      // Check for level up
      if (newEnergy >= xpToNextLevel) {
        const newLevel = (profile?.pet?.lvl || 0) + 1;
        const remainingXP = newEnergy - xpToNextLevel;
        const nextLevelXP = calculateXPForNextLevel(newLevel);

        setProfile(prevProfile => ({
          ...prevProfile,
          pet: {
            ...prevProfile.pet,
            lvl: newLevel,
            xp: remainingXP,
            happiness: newHappiness,
            xpToNextLevel: nextLevelXP
          }
        }));
      } else {
        setProfile(prevProfile => ({
          ...prevProfile,
          pet: {
            ...prevProfile.pet,
            xp: newEnergy,
            happiness: newHappiness
          }
        }));
      }

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
      setProfile(prevProfile => ({
        ...prevProfile,
        stats: {
          ...prevProfile.stats,
          current_streak: data.streak
        }
      }));
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
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(sortHabits(updatedHabits));

    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/api/habits/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (res.ok) fetchProfileData();
  };

  const addHabit = async (newHabit) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/habits`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
    } catch (err) {
      console.error("Error creating habit:", err);
      setError(err.message);
    }
  };

  const editHabit = async (id, newName, newRecurrence) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id
        ? { ...habit, name: newName, recurrence: newRecurrence }
        : habit
    );
    setHabits(sortHabits(updatedHabits));

    const res = await fetch(
      `${import.meta.env.VITE_API_DOMAIN}/api/habits/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          recurrence: newRecurrence,
        }),
      }
    );
    if (res.ok) fetchProfileData();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSaveSettings = () => {
    // TODO: Add API call to save settings
    setShowSettings(false);
  };

  const handleResetSettings = () => {
    // TODO: Add API call to reset settings
  };

  const handleToggleView = (view) => {
    setActiveView(view);
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_DOMAIN}/api/weather`,
          {
            method: "GET",
            credentials: "include",
          }
        );

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

  const [dailyMessage, setDailyMessage] = useState("");

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
    
    // First check if it's a new pet (level 0)
    if (petLevel === 0) {
      return "Your pet is ready to start their adventure! Complete habits to help them grow! 🌱";
    }
    
    // If energy is 0 but happiness and health are high, it's likely a level up
    if (energy === 0 && happiness >= 50 && health >= 50) {
      return "Your pet has leveled up! They're ready for new adventures! 🎉";
    }
    
    // Happiness is on a 0-100 scale where:
    // 0-20% = Very Sad
    // 21-40% = Sad
    // 41-60% = Neutral
    // 61-80% = Happy
    // 81-100% = Very Happy
    if (happiness >= 90 && health >= 90) {
      return "Your pet is absolutely ecstatic! They're jumping with joy! 🌟";
    } else if (happiness >= 80 && health >= 80) {
      return "Your pet is thriving and full of energy! They're so happy! 🎉";
    } else if (happiness >= 70 && health >= 70) {
      return "Your pet is in great spirits! They're loving life! 😊";
    } else if (happiness >= 60 && health >= 60) {
      return "Your pet looks happy today. Keep up the good habits! 🎆";
    } else if (happiness >= 50 && health >= 50) {
      return "Your pet is content, but could use some more attention. 🐱";
    } else if (happiness >= 40 && health >= 40) {
      return "Your pet is doing okay, but seems a bit bored. Maybe play with them? ⚽";
    } else if (happiness >= 30 && health >= 30) {
      return "Your pet seems a bit down. They could use some extra love! 💕";
    } else if (happiness >= 20 && health >= 20) {
      return "Your pet is feeling sad. They miss spending time with you! 😢";
    } else if (happiness >= 10 && health >= 10) {
      return "Your pet is really struggling. They need your help right now! 🆘";
    } else {
      return "Your pet is in critical condition! Please complete some habits to cheer them up! 🚨";
    }
  };

  // Set daily message on component mount
  useEffect(() => {
    setDailyMessage(getDailyMessage());
  }, []);

  const handleCompleteHabit = async (habitId) => {
    if (isCompletingHabit) return;
    setIsCompletingHabit(true);
    setCompletingHabitId(habitId);

    try {
      const response = await fetch("/api/habits/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ habitId }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete habit");
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

      // Update habits list
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId
            ? { ...habit, completed: true, completed_at: new Date().toISOString() }
            : habit
        )
      );

      // Update streak
      setStreak(data.streak);
    } catch (error) {
      console.error("Error completing habit:", error);
      alert("Failed to complete habit. Please try again.");
    } finally {
      setIsCompletingHabit(false);
      setCompletingHabitId(null);
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);

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
  }

  useEffect(() => {
    // Sync with backend every 15 minutes to keep profile stats updated
    // We use a longer interval to avoid overwriting local state changes
    // with potentially stale data from the backend
    const syncInterval = setInterval(() => {
      fetchProfileData();
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(syncInterval);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center text-red-500">
          <p>Error loading dashboard: {error}</p>
          <button 
            onClick={() => {
              console.log("Retrying dashboard initialization...");
              initializeDashboard();
            }} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const petName = profile?.pet?.name || "No Pet";
  const petType = profile?.pet?.type || "Cat";
  const petLevel = profile?.pet?.lvl || 0;
  const petStats = {
    happiness: profile?.pet?.happiness || 50,
    energy: profile?.pet?.xp || 0, 
    health: profile?.pet?.health || 100,
    xpToNextLevel: calculateXPForNextLevel(petLevel) // Add xpToNextLevel calculation
  };
  const userName = profile?.user?.display_name || "User";
  const streak = profile?.stats?.current_streak || 0;

  const toggleComponent = (
    <DisplayToggle activeView={activeView} onToggle={handleToggleView} />
  );
  const petImage = getPetImage(petType);

  return (
    <Layout userName={userName} onToggleSettings={toggleSettings}>
      <div
        className="relative min-h-screen flex flex-col"
        style={{ backgroundColor: "#DEF8FB" }}
      >
        {locationError && (
          <div className="text-red-500 text-center">
            Error with location: {locationError}
          </div>
        )}
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
                dailyMessage={getDailyMessage()}
                petStatusMessage={getPetStatusMessage()}
              />
            </div>

            {/* Pet Display with Environment or Stats */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Pet Display with Toggle */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                <PetDisplay
                  petImage={petImage}
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
                    weatherImage={weatherImage}
                  />
                ) : (
                  <PetStats
                    petName={petName}
                    petType={petType}
                    petLevel={petLevel}
                    petStats={petStats}
                  />
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
              addHabit={addHabit}
              editHabit={editHabit}
              isHabitCompletedToday={isHabitCompletedToday}
              isHabitDueToday={isHabitDueToday}
            />

            {/* Progress Section */}
            <ProgressBar
              completedHabits={completedHabits}
              totalHabits={totalHabits}
              streak={streak}
            />
          </div>
        </main>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={toggleSettings}
          userName={userName}
          setUserName={() => {}} // Would need a function to update userName
          theme="light"
          setTheme={() => {}} // Would need a function to update theme
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
        />

        {/* Share Modal */}
        <ShareModal
          show={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareData={{
            title: "My Tamagotchi Progress",
            text: `I've completed ${habits.filter(h => isHabitCompletedToday(h)).length} out of ${habits.length} habits today! My pet is ${profile?.pet?.name || 'doing great'} and the weather is ${currentWeather.toLowerCase()}. Check out my progress on Tamagotchi!`,
            url: window.location.href
          }}
        />
      </div>
    </Layout>
  );
}
