import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="flex items-center justify-between py-6 px-4">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-normal text-sky-950 hover:text-sky-900 transition">
          Tamagotchi Tracker
        </Link>
      </div>
      <nav className="flex gap-4">
        {isDashboard ? (
          <button
            onClick={() => {
              // TODO: Implement logout functionality
              console.log('Logout clicked');
            }}
            className="px-4 py-2 text-sky-700 hover:text-sky-900 transition"
          >
            Logout
          </button>
        ) : (
          <>
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
          </>
        )}
      </nav>
    </header>
  );
}