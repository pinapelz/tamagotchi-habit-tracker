import { Heart, Star } from "lucide-react";

export default function MetricBars({ health = 70, xp = 45 }) {
    return (
        <div className="flex flex-col gap-4">
            {/* Health Bar */}
            <div className="flex items-center gap-3 w-full">
                <Heart className="text-red-500 flex-shrink-0" size={22} />
                <div className="flex-grow bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-red-400 h-4 rounded-full transition-all"
                        style={{ width: `${health}%` }} // Dynamic health percentage
                    />
                </div>
                <span className="font-semibold text-red-700 flex-shrink-0">{health}/100 HP</span>
            </div>
            {/* XP Bar */}
            <div className="flex items-center gap-3 w-full">
                <Star className="text-yellow-400 flex-shrink-0" size={22} />
                <div className="flex-grow bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-yellow-300 h-4 rounded-full transition-all"
                        style={{ width: `${xp}%` }} // Dynamic XP percentage
                    />
                </div>
                <span className="font-semibold text-yellow-700 flex-shrink-0">{xp}/100 XP</span>
            </div>
        </div>
    );
}