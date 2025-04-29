import { MessageCircle } from "lucide-react";

export default function Encouragement({ message = "You're doing great! Keep going!" }) {
  return (
    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl shadow text-gray-700 text-base font-medium mb-4">
      <MessageCircle className="w-5 h-5 text-blue-400" />
      <span className="italic">"{message}"</span>
    </div>
  );
}