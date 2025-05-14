import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Settings, Home, User, Users, Trophy, Bell, HelpCircle, LogOut } from 'lucide-react'
import PropTypes from 'prop-types'
import SettingsModal from '../SettingsModal'

export default function Layout({ children, userName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [theme, setTheme] = useState("light")
  const [colonVisible, setColonVisible] = useState(true)

  // Update time in real-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      
      setCurrentTime({ 
        hours,
        minutes,
        ampm
      });
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setColonVisible(prev => !prev);
    }, 500); 
    
    return () => clearInterval(blinkInterval);
  }, []);

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/dashboard' },
    { icon: <User size={20} />, label: 'Profile', href: '/profile' },
    { icon: <Users size={20} />, label: 'Friends', href: '/friends' },
    { icon: <Trophy size={20} />, label: 'Leaderboard', href: '/leaderboard' },
    { icon: <Bell size={20} />, label: 'Notifications', href: '/notifications' },
    { icon: <HelpCircle size={20} />, label: 'Help', href: '/help' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
    { icon: <LogOut size={20} />, label: 'Logout', href: '/logout' },
  ]

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", { userName, theme });
    setShowSettings(false);
  };

  const handleResetSettings = () => {
    setTheme("light");
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-3 flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="text-[#000000] text-2xl font-sniglet hover:opacity-80 transition-opacity">
            Tamagotchi Tracker
          </Link>
        </div>
        <div className="flex items-center gap-4 mr-4">
          <span className="bg-[#f0f9ff] px-4 py-2 rounded-xl text-gray-700 font-sniglet text-2xl lg:text-3xl 2xl:text-4xl">
            {typeof currentTime === 'string' ? currentTime : (
              <>
                {currentTime.hours}
                <span className={colonVisible ? 'opacity-100' : 'opacity-0'}>:</span>
                {currentTime.minutes}
                {' '}
                {currentTime.ampm}
              </>
            )}
          </span>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors" 
            onClick={toggleSettings}
          >
            <Settings size={32} className="text-gray-600" />
          </button>
          <Link to="/" className="bg-[#ff7f7f] text-black px-4 py-2 rounded-full font-sniglet text-base">
            Logout
          </Link>
        </div>
      </header>

      {/* Side Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40"
          >
            {/* User Profile Section */}
            <div className="p-4 border-b">
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

            {/* Menu Items */}
            <nav className="p-4">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={toggleSettings}
        userName={userName}
        setUserName={() => {}} // This would need to be handled by a parent component or context
        theme={theme}
        setTheme={setTheme}
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
      />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  userName: PropTypes.string.isRequired
} 