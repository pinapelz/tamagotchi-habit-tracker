import { MessageCircle } from "lucide-react";

export default function Encouragement({ message = "You're doing great! Keep going!" }) {
  return (
    <div className="flex items-center gap-2 bg-white px-6 py-4 rounded-xl text-gray-700 text-base font-medium mb-4">
      <MessageCircle className="w-5 h-5 text-blue-400" />
      <span className="italic">"{message}"</span>
    </div>
  );
}