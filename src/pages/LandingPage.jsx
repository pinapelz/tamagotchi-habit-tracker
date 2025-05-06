import { Link } from 'react-router-dom';
import cloudImage from '../assets/landing/cloud-pixel.webp'
import slimeGif from '../assets/landing/slime.gif'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200 font-sniglet">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute top-10 left-10 w-20 opacity-70 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute bottom-5 right-5 w-24 opacity-70 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute top-[20%] left-[-30px] w-24 opacity-60 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute bottom-[20%] right-[-30px] w-20 opacity-60 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute top-[-5px] right-[25%] w-32 opacity-60 animate-bounce-slow"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-normal text-sky-950">
              Tamagotchi Tracker
            </h1>
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

        <main className="flex flex-col items-center justify-center py-8 text-center">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-normal text-sky-950 md:text-4xl lg:text-5xl">
              Welcome to Tamagotchi Habit Tracker!
            </h2>

            <div className="my-2 relative">
              <div className="relative inline-block animate-bounce-slow">
                <img
                  src={slimeGif}
                  alt="Tamagotchi Pet"
                  width={140}
                  height={140}
                  className="h-auto w-32 md:w-36"
                />
              </div>
            </div>

            <p className="mt-2 mb-2 text-lg font-medium text-sky-800 md:text-xl">
              Build good habits. Watch your pet grow 🌱
            </p>
            <p className="mb-6 text-base text-sky-700">
              Let the weather outside shape the world in your app.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/signup"
                className="px-5 py-2 bg-sky-600 text-white text-base rounded hover:bg-sky-700 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 border border-sky-600 text-sky-600 text-base rounded hover:bg-sky-100 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
