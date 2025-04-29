import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Home, User, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Header with hamburger */}
      <header className="flex items-center p-4 md:p-6 bg-white/80 shadow-lg rounded-sm backdrop-blur-md">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition mr-3"
          aria-label="Open menu"
        >
          <MenuIcon size={26} />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
            Tamagotchi Tracker
          </h1>
          {/* Example avatar */}
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold shadow-inner border-2 border-white">
            T
          </div>
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