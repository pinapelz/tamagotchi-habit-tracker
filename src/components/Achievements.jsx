import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, PawPrint, ArrowRight, Target, Calendar, Heart } from 'lucide-react';

const Achievements = ({ userAchievements = [] }) => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample achievements data
  const sampleAchievements = [
    // Habit Completion Achievements
    {
      id: '1',
      name: 'Getting Started',
      description: 'Complete your first habit',
      condition_type: 'habits_completed',
      condition_value: 1,
      icon: '🎯',
      unlocked: true
    },
    {
      id: '2',
      name: 'Habit Master',
      description: 'Complete 10 habits',
      condition_type: 'habits_completed',
      condition_value: 10,
      icon: '⭐',
      unlocked: false
    },
    {
      id: '3',
      name: 'Habit Champion',
      description: 'Complete 50 habits',
      condition_type: 'habits_completed',
      condition_value: 50,
      icon: '🏅',
      unlocked: false
    },
    {
      id: '4',
      name: 'Habit Legend',
      description: 'Complete 100 habits',
      condition_type: 'habits_completed',
      condition_value: 100,
      icon: '💫',
      unlocked: false
    },
    {
      id: '5',
      name: 'Habit Virtuoso',
      description: 'Complete 500 habits',
      condition_type: 'habits_completed',
      condition_value: 500,
      icon: '✨',
      unlocked: false
    },
    {
      id: '6',
      name: 'Habit Deity',
      description: 'Complete 1000 habits',
      condition_type: 'habits_completed',
      condition_value: 1000,
      icon: '🌟',
      unlocked: false
    },
    // Streak Achievements
    {
      id: '7',
      name: 'Streak Beginner',
      description: 'Maintain a 3-day streak',
      condition_type: 'streak',
      condition_value: 3,
      icon: '🔥',
      unlocked: true
    },
    {
      id: '8',
      name: 'Streak Master',
      description: 'Maintain a 7-day streak',
      condition_type: 'streak',
      condition_value: 7,
      icon: '⚡',
      unlocked: false
    },
    {
      id: '9',
      name: 'Streak Legend',
      description: 'Maintain a 30-day streak',
      condition_type: 'streak',
      condition_value: 30,
      icon: '🌪️',
      unlocked: false
    },
    {
      id: '10',
      name: 'Streak Warrior',
      description: 'Maintain a 60-day streak',
      condition_type: 'streak',
      condition_value: 60,
      icon: '⚔️',
      unlocked: false
    },
    {
      id: '11',
      name: 'Streak Champion',
      description: 'Maintain a 100-day streak',
      condition_type: 'streak',
      condition_value: 100,
      icon: '🏆',
      unlocked: false
    },
    {
      id: '12',
      name: 'Streak Immortal',
      description: 'Maintain a 365-day streak',
      condition_type: 'streak',
      condition_value: 365,
      icon: '👑',
      unlocked: false
    },
    // Pet Level Achievements
    {
      id: '13',
      name: 'Pet Novice',
      description: 'Reach pet level 5',
      condition_type: 'pet_level',
      condition_value: 5,
      icon: '🐣',
      unlocked: false
    },
    {
      id: '14',
      name: 'Pet Master',
      description: 'Reach pet level 10',
      condition_type: 'pet_level',
      condition_value: 10,
      icon: '🐉',
      unlocked: false
    },
    {
      id: '15',
      name: 'Pet Legend',
      description: 'Reach pet level 20',
      condition_type: 'pet_level',
      condition_value: 20,
      icon: '🐲',
      unlocked: false
    },
    {
      id: '16',
      name: 'Pet Guardian',
      description: 'Reach pet level 30',
      condition_type: 'pet_level',
      condition_value: 30,
      icon: '🦁',
      unlocked: false
    },
    {
      id: '17',
      name: 'Pet Deity',
      description: 'Reach pet level 50',
      condition_type: 'pet_level',
      condition_value: 50,
      icon: '🦄',
      unlocked: false
    },
    {
      id: '18',
      name: 'Pet Celestial',
      description: 'Reach pet level 100',
      condition_type: 'pet_level',
      condition_value: 100,
      icon: '🌠',
      unlocked: false
    }
  ];

  useEffect(() => {
    // If user has achievements, map them to the sample achievements structure
    if (userAchievements && userAchievements.length > 0) {
      setAchievements(sampleAchievements.map(achievement => ({
        ...achievement,
        unlocked: userAchievements.includes(achievement.name)
      })));
    } else {
      // If no achievements, show all as locked
      setAchievements(sampleAchievements.map(achievement => ({
        ...achievement,
        unlocked: false
      })));
    }
    setLoading(false);
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
                <div className="text-2xl opacity-50">
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
              <div className="text-2xl text-[#486085] font-medium">18</div>
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
