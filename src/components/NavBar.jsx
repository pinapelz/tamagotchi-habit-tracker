import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Home, User, Menu as MenuIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Header with hamburger */}
      <header className="relative flex items-center p-3 md:p-6 bg-white/90 shadow-xl rounded-b-[2rem] md:rounded-b-[3rem] backdrop-blur-md border-b-4 border-blue-100 overflow-hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-blue-100 transition mr-2 md:mr-3"
          aria-label="Open menu"
        >
          <MenuIcon size={26} />
        </button>
        <h1 className="text-lg sm:text-xl md:text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm whitespace-nowrap">
          Tamagotchi Tracker
        </h1>
        <div className="flex-1" />
        <span className="hidden sm:inline text-xl md:text-3xl font-mono text-gray-700 mr-2 md:mr-6">
          {time
          ? time
              .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
          : ""}
        </span>
        <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xl md:text-3xl font-bold shadow-inner border-2 border-white mr-2 md:mr-4">
          PFP
        </div>

      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar overlay */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: 260, pointerEvents: open ? "auto" : "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <Sidebar
          backgroundColor="rgba(248,250,252,0.95)"
          rootStyles={{
            height: "100vh",
            boxShadow: "2px 0 16px 0 rgba(0,0,0,0.08)",
            borderTopRightRadius: "1rem",
            borderBottomRightRadius: "1rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Menu>
            <div className="my-2 border-b border-gray-200" />
            <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-widest">
              Main
            </div>
            <MenuItem icon={<Home size={18} />}>Dashboard</MenuItem>
            <MenuItem icon={<User size={18} />}>Profile</MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </>
  );
}