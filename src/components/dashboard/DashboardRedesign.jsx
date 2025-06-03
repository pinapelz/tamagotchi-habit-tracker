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
import { getTimeOfDayIcon, getWeatherIcon, getSeasonIcon } from "./WeatherUtils";
import pixelCat from "../../assets/pets/pixel-cat.gif";
import pixelBat from "../../assets/pets/pixel-bat.gif";
import pixelDuck from "../../assets/pets/pixel-duck.gif";
import pixelDog from "../../assets/pets/pixel-dog.gif";
import rainyBg from "../../assets/weather_bg/rainy.gif";
import cloudyBg from "../../assets/weather_bg/cloudy.gif";
import snowBg from "../../assets/weather_bg/snow.png";
import sunnyBg from "../../assets/weather_bg/sunny.jpeg";
import windyBg from "../../assets/weather_bg/windy.gif";

export default function DashboardRedesign() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const [locationError, setLocationError] = useState(null);

  const checkAndSetLocation = async () => {
    try {
      const hasLocationResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/has-location`, {
        method: "GET",
        credentials: "include",
      });

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

          console.log("Location updated successfully.");
        } catch (err) {
          console.error("Error sending location to API:", err);
          setLocationError(err.message);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setLocationError("Unable to retrieve your location. Please manually set it in settings");
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

  // Load profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error("Failed to fetch profile data");
        }

        const { data } = await response.json();
        setProfile(data);

        // Initialize habits from backend data (you'll need to create this endpoint)
        // For now, using sample habits
        setHabits([
          { id: "1", name: "Drink Water", completed: false, recurrence: "hourly" },
          { id: "2", name: "Study 1 Hour", completed: false, recurrence: "daily" },
          { id: "3", name: "Stretch", completed: false, recurrence: "weekly" },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

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
          } else {
            setLoading(false); // Stop loading if the user has a pet
          }
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
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
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
      const isNearTransition = transitions.some(hour => {
        if (currentHour === hour && minutes <= 1) return true;
        const prevHour = (hour === 0) ? 23 : hour - 1;
        if (currentHour === prevHour && minutes >= 59) return true;
        return false;
      });

      // Check if we're approaching a transition (10 minutes before or after)
      const isApproachingTransition = transitions.some(hour => {
        if (currentHour === hour && minutes <= 10) return true;
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

  // Calculate completed habits
  const completedHabits = habits.filter((habit) => habit.completed).length;
  const totalHabits = habits.length;

  // Get pet image based on type
  const getPetImage = (petType) => {
    if (!petType) return pixelCat; // Default to cat

    switch (petType.toLowerCase()) {
      case 'cat': return pixelCat;
      case 'dog': return pixelDog;
      case 'duck': return pixelDuck;
      case 'bat': return pixelBat;
      default: return pixelCat;
    }
  };

  const toggleHabitCompletion = (id) => {
    setHabits(habits.map((habit) => (habit.id === id ? { ...habit, completed: !habit.completed } : habit)));
    // TODO: Add API call to update habit completion status
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
    // TODO: Add API call to delete habit
  };

  const addHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
    // TODO: Add API call to create habit
  };

  const editHabit = (id, newName) => {
    setHabits(habits.map(habit => habit.id === id ? { ...habit, name: newName } : habit));
    // TODO: Add API call to update habit
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
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/weather`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const weather = data.weather;

        setCurrentWeather(weather);

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
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
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

  const petName = profile?.pet?.name || "No Pet";
  const petType = profile?.pet?.type || "Cat";
  const petLevel = profile?.pet?.lvl || 0;
  const petStats = {
    happiness: profile?.pet?.happiness || 50,
    energy: profile?.pet?.energy || 50, // Not in your schema, fallback value
    health: profile?.pet?.health || 100
  };
  const userName = profile?.user?.display_name || "User";
  const streak = profile?.stats?.current_streak || 0;

  const toggleComponent = <DisplayToggle activeView={activeView} onToggle={handleToggleView} />;
  const petImage = getPetImage(petType);

  return (
    <Layout userName={userName} onToggleSettings={toggleSettings}>
      <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: "#DEF8FB" }}>
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
          setUserName={() => { }} // Would need a function to update userName
          theme="light"
          setTheme={() => { }} // Would need a function to update theme
          onSave={handleSaveSettings}
          onReset={handleResetSettings}
        />
      </div>
    </Layout>
  );
}