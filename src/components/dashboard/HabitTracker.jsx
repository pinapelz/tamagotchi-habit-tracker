"use client"

import { useState } from 'react'
import { Pencil, Trash2, Share2, Plus, Check } from "lucide-react"
import PropTypes from 'prop-types'
import ShareModal from '../ShareModal'

export default function HabitTracker({ habits, currentDate, toggleHabitCompletion, deleteHabit }) {
  const [showShareModal, setShowShareModal] = useState(false)

  const toggleHabit = (id) => {
    toggleHabitCompletion(id)
  }

  return (
    <div className="bg-[#f0e8ff] rounded-3xl p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-medium">Habit Tracker</h2>
          <p className="font-sniglet text-sm text-gray-600">{currentDate}</p>
        </div>
        <button 
          className="bg-[#5dd6e8] text-black px-3 py-1.5 rounded-full font-sniglet text-sm flex items-center"
          onClick={() => setShowShareModal(true)}
        >
          <Share2 size={14} className="mr-1.5" />
          Share
        </button>
      </div>

      {/* Habits List */}
      <div className="h-[180px] mb-4">
        <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
          <ul className="space-y-3">
            {habits.map((habit) => (
              <li 
                key={habit.id}
                className="group bg-white/50 rounded-lg overflow-hidden"
              >
                <div className="flex items-center justify-between p-2.5">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      habit.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {habit.completed && (
                        <Check size={16} className="text-white" />
                      )}
                    </div>
                    <span className={`text-gray-700 ${habit.completed ? 'text-gray-400' : ''}`}>
                      {habit.name}
                    </span>
                  </button>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                      <Pencil size={16} className="text-gray-600" />
                    </button>
                    <button 
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHabit(habit.id);
                      }}
                    >
                      <Trash2 size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-[#f8ffea] border border-gray-300 text-black px-3.5 py-1.5 rounded-full font-sniglet text-sm hover:bg-[#edf5df] transition-colors flex items-center">
          <Plus size={16} className="mr-1.5" />
          Add Habit
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal show={showShareModal} onClose={() => setShowShareModal(false)} />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  )
}

HabitTracker.propTypes = {
  habits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired,
  currentDate: PropTypes.string.isRequired,
  toggleHabitCompletion: PropTypes.func.isRequired,
  deleteHabit: PropTypes.func.isRequired
} 