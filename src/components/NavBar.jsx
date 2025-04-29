import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Home, User, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header with hamburger */}
      <header className="relative flex items-center p-4 md:p-6 bg-white/90 shadow-xl rounded-b-[3rem] backdrop-blur-md border-b-4 border-blue-100 overflow-hidden">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-blue-100 transition mr-3"
          aria-label="Open menu"
        >
          <MenuIcon size={26} />
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
          Tamagotchi Tracker
        </h1>
        <div className="flex-1" />
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-inner border-2 border-white mr-4">
          PFP
        </div>
        {/* Cloud SVG at the bottom. Sorry its kinda garbanzo if someone can do a better job */}
        <svg
          className="absolute left-0 bottom-0 w-full h-10"
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ pointerEvents: "none" }}
        >
          <path
            d="M0,40 Q360,55 720,40 T1440,40 V60 H0 Z"
            fill="#fff"
            opacity="0.92"
          />
        </svg>
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