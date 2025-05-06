import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function AuthNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Link to="/" className="hover:opacity-80 transition">
          <h1 className="text-lg sm:text-xl font-normal text-sky-950">
            Tamagotchi Tracker
          </h1>
        </Link>
      </div>
      
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="sm:hidden p-2 text-sky-700 hover:text-sky-900 transition"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Desktop navigation */}
      <nav className="hidden sm:flex gap-4">
        <Link
          to="/login"
          className="px-4 py-2 text-sky-700 hover:text-sky-900 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
        >
          Sign Up
        </Link>
      </nav>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="absolute top-16 right-4 sm:hidden bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2 min-w-[200px] z-50">
          <Link
            to="/login"
            className="px-4 py-2 text-sky-700 hover:text-sky-900 transition text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
        </nav>
      )}
    </header>
  );
} 