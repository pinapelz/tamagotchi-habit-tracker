import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, PawPrint, ArrowRight, Target, Calendar, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Achievements = ({ userAchievements }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // If userAchievements is provided, use it directly
        if (userAchievements && userAchievements.length > 0) {
          setAchievements(userAchievements);
          setLoading(false);
          return;
        }

        // Otherwise fetch from API
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/achievements`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Please log in to view achievements');
            return;
          }
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error(`Failed to fetch achievements: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status === 'ok') {
          setAchievements(data.achievements);
        } else {
          throw new Error(data.message || 'Failed to fetch achievements');
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [userAchievements]);

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'habits_completed':
        return <Star className="text-yellow-400" size={20} />;
      case 'streak':
        return <Flame className="text-orange-400" size={20} />;
      case 'pet_level':
        return <PawPrint className="text-blue-400" size={20} />;
      default:
        return <Trophy className="text-[#4abe9c]" size={20} />;
    }
  };

  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.condition_type === activeCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4abe9c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        {error.includes('log in') ? (
          <button 
            onClick={() => navigate('/login')} 
            className="px-4 py-2 bg-[#4abe9c] text-white rounded-lg hover:bg-[#3da88a] transition-colors"
          >
            Go to Login
          </button>
        ) : (
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#4abe9c] text-white rounded-lg hover:bg-[#3da88a] transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Show welcome message for new users (if all achievements are locked)
  if (achievements.length > 0 && achievements.every(a => !a.unlocked)) {
    return (
      <div className="space-y-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-[#4abe9c] to-[#3da88a] text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-2">Welcome to Your Achievement Journey! 🎉</h2>
          <p className="text-white/90">
            Start your adventure by completing habits and taking care of your pet. Each achievement you unlock brings you closer to becoming a habit master!
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-[#486085] mb-4">How to Earn Your First Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Target className="text-[#4abe9c] flex-shrink-0" size={24} />
              <div>
                <h4 className="font-medium text-[#486085]">Complete Habits</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Start by completing your first habit to unlock the "Getting Started" achievement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-[#4abe9c] flex-shrink-0" size={24} />
              <div>
                <h4 className="font-medium text-[#486085]">Build Streaks</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Complete habits daily to build your streak and unlock streak achievements
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Heart className="text-[#4abe9c] flex-shrink-0" size={24} />
              <div>
                <h4 className="font-medium text-[#486085]">Level Up Your Pet</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Take care of your pet daily to level it up and unlock pet achievements
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview of First Achievement */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-[#486085] mb-4">Your First Achievement Awaits!</h3>
          <div className="bg-gray-50 p-4 rounded-lg border-2 border-dashed border-[#4abe9c]">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h4 className="font-medium text-[#486085]">Getting Started</h4>
                <p className="text-sm text-gray-600 mt-1">Complete your first habit to unlock this achievement</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#4abe9c]">
                  <Star className="text-yellow-400" size={16} />
                  <span>1 habit completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-[#4abe9c] text-white shadow-md'
                : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
            }`}
          >
            All Achievements
          </button>
          <button
            onClick={() => setActiveCategory('habits_completed')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === 'habits_completed'
                ? 'bg-[#4abe9c] text-white shadow-md'
                : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
            }`}
          >
            <Star size={16} />
            Habits
          </button>
          <button
            onClick={() => setActiveCategory('streak')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === 'streak'
                ? 'bg-[#4abe9c] text-white shadow-md'
                : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
            }`}
          >
            <Flame size={16} />
            Streaks
          </button>
          <button
            onClick={() => setActiveCategory('pet_level')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === 'pet_level'
                ? 'bg-[#4abe9c] text-white shadow-md'
                : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
            }`}
          >
            <PawPrint size={16} />
            Pet Levels
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 opacity-60"
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[#486085]">{achievement.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#4abe9c]">
                    {getCategoryIcon(achievement.condition_type)}
                    <span>
                      {achievement.condition_value} {achievement.condition_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Summary */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-[#486085] font-medium mb-3">Achievement Progress</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl text-[#4abe9c] font-medium">0</div>
              <div className="text-sm text-gray-500">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#486085] font-medium">{achievements.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#4abe9c] font-medium">0%</div>
              <div className="text-sm text-gray-500">Completion</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-[#4abe9c] text-white shadow-md'
              : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
          }`}
        >
          All Achievements
        </button>
        <button
          onClick={() => setActiveCategory('habits_completed')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            activeCategory === 'habits_completed'
              ? 'bg-[#4abe9c] text-white shadow-md'
              : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
          }`}
        >
          <Star size={16} />
          Habits
        </button>
        <button
          onClick={() => setActiveCategory('streak')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            activeCategory === 'streak'
              ? 'bg-[#4abe9c] text-white shadow-md'
              : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
          }`}
        >
          <Flame size={16} />
          Streaks
        </button>
        <button
          onClick={() => setActiveCategory('pet_level')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            activeCategory === 'pet_level'
              ? 'bg-[#4abe9c] text-white shadow-md'
              : 'bg-white text-[#4abe9c] border border-[#4abe9c] hover:bg-[#4abe9c]/10'
          }`}
        >
          <PawPrint size={16} />
          Pet Levels
        </button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white p-4 rounded-lg shadow-sm transition-all duration-300 ${
              achievement.unlocked 
                ? 'border-2 border-[#4abe9c]' 
                : 'border border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`text-2xl ${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[#486085]">{achievement.name}</h3>
                  {achievement.unlocked && (
                    <div className="text-[#4abe9c]">
                      <Trophy size={20} />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#4abe9c]">
                  {getCategoryIcon(achievement.condition_type)}
                  <span>
                    {achievement.condition_value} {achievement.condition_type.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
        <h3 className="text-[#486085] font-medium mb-3">Achievement Progress</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl text-[#4abe9c] font-medium">
              {achievements.filter(a => a.unlocked).length}
            </div>
            <div className="text-sm text-gray-500">Unlocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-[#486085] font-medium">
              {achievements.length}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl text-[#4abe9c] font-medium">
              {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-gray-500">Completion</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements; 
