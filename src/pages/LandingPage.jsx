import { Link } from 'react-router-dom';
import cloudImage from '../assets/landing/cloud-pixel.webp';
import slimeGif from '../assets/landing/slime.gif';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-sky-200">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute top-20 left-10 w-24 opacity-70 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute bottom-10 right-10 w-32 opacity-70 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute top-[30%] left-[-40px] w-32 opacity-60 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute bottom-[25%] right-[-40px] w-28 opacity-60 animate-bounce-slow"
        />
        <img
          src={cloudImage}
          alt="Pixelated Cloud"
          className="absolute top-[-10px] right-[30%] w-40 opacity-60 animate-bounce-slow"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-sky-950">
              Tamagotchi Tracker
            </h1>
          </div>
          <nav className="flex gap-4">
            <Link
              to="#"
              className="px-4 py-2 text-sky-700 hover:text-sky-900 transition"
            >
              Login
            </Link>
            <Link
              to="#"
              className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
            >
              Sign Up
            </Link>
          </nav>
        </header>

        <main className="flex flex-col items-center justify-center py-16 text-center md:py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold text-sky-950 md:text-5xl lg:text-6xl">
              Welcome to Tamagotchi Habit Tracker!
            </h2>

            <div className="my-2 relative">
              <div className="relative inline-block animate-bounce-slow">
                <img
                  src={slimeGif}
                  alt="Tamagotchi Pet"
                  width={180}
                  height={180}
                  className="h-auto w-40 md:w-48"
                />
              </div>
            </div>

            <p className="mt-2 mb-2 text-xl font-medium text-sky-800 md:text-2xl">
              Build good habits. Watch your pet grow 🌱
            </p>
            <p className="mb-10 text-lg text-sky-700">
              Let the weather outside shape the world in your app.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                to="#"
                className="px-6 py-3 bg-sky-600 text-white text-lg rounded hover:bg-sky-700 transition"
              >
                Get Started
              </Link>
              <Link
                to="#"
                className="px-6 py-3 border border-sky-600 text-sky-600 text-lg rounded hover:bg-sky-100 transition"
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
