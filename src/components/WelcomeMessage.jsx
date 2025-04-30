import { Cloud, Sun, CloudRain } from "lucide-react";

export default function WelcomeMessage({ name = "User", weather = "cloudy" }) {
  const weatherIcons = {
    sunny: <Sun className="inline w-5 h-5 text-yellow-400 mr-1" />,
    cloudy: <Cloud className="inline w-5 h-5 text-gray-400 mr-1" />,
    rainy: <CloudRain className="inline w-5 h-5 text-blue-400 mr-1" />,
  };

  return (
    <div className="flex items-center justify-between bg-white/80 px-6 py-3 rounded-xl shadow mb-4">
      <div>
        <div className="font-bold text-xl">
          Hello, <span className="font-black italic">"{name}"</span>!{" "}
          <span className="font-normal">Your pet looks happy today.</span>
        </div>
        <div className="mt-1 text-base">
          Current weather: {weatherIcons[weather] || weatherIcons.cloudy}
          <span className="align-middle">{weather.charAt(0).toUpperCase() + weather.slice(1)}</span>
        </div>
      </div>
    </div>
  );
}