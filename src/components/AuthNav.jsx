import { Link } from 'react-router-dom';

export default function AuthNav() {
  return (
    <header className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Link to="/" className="hover:opacity-80 transition">
          <h1 className="text-xl font-normal text-sky-950">
            Tamagotchi Tracker
          </h1>
        </Link>
      </div>
      <nav className="flex gap-4">
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
    </header>
  );
} 