import { useState, useRef, useEffect } from 'react'
import { Pencil, Trash2, Share2, Plus, Check, Calendar } from "lucide-react"
import PropTypes from 'prop-types'
import ShareModal from '../ShareModal'

export default function HabitTracker({ habits, currentDate, toggleHabitCompletion, deleteHabit, addHabit, editHabit }) {
  const [showShareModal, setShowShareModal] = useState(false)
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitRecurrence, setNewHabitRecurrence] = useState("daily");
  const [isAdding, setIsAdding] = useState(false);
  const [editHabitId, setEditHabitId] = useState(null);
  const [editHabitName, setEditHabitName] = useState("");
  const [editHabitRecurrence, setEditHabitRecurrence] = useState("daily");
  const formRef = useRef(null);
  const editFormRef = useRef(null);

  const toggleHabit = (id) => {
    toggleHabitCompletion(id)
  }

  const resetAddHabitForm = () => {
    setNewHabitName("");
    setNewHabitRecurrence("daily");
    setIsAdding(false);
  }

  const resetEditHabitForm = () => {
    setEditHabitId(null);
    setEditHabitName("");
    setEditHabitRecurrence("daily");
  }

  const openEditHabitForm = (habit) => {
    setEditHabitId(habit.id);
    setEditHabitName(habit.name);
    setEditHabitRecurrence(habit.recurrence || "daily");
  }

  const saveEditedHabit = () => {
    if (editHabitName.trim() !== "") {
      editHabit(editHabitId, editHabitName.trim(), editHabitRecurrence);
      resetEditHabitForm();
    }
  }

  // Close add popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        resetAddHabitForm();
      }
    }

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  // Close edit popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (editFormRef.current && !editFormRef.current.contains(event.target)) {
        resetEditHabitForm();
      }
    }

    if (editHabitId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editHabitId]);

  return (
    <div className="bg-[#f0e8ff] rounded-3xl p-5 relative">
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
      <div className="h-[calc(100vh-400px)] min-h-[300px] max-h-[500px] mb-4">
        <div className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
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
                    <div className="flex flex-col">
                      <span className={`text-gray-700 ${habit.completed ? 'text-gray-400' : ''}`}>
                        {habit.name}
                      </span>
                      {habit.recurrence && (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {habit.recurrence.charAt(0).toUpperCase() + habit.recurrence.slice(1)}
                        </span>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => openEditHabitForm(habit)}
                    >
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
        <button
          className="bg-[#f8ffea] border border-gray-300 text-black px-3.5 py-1.5 rounded-full font-sniglet text-sm hover:bg-[#edf5df] transition-colors flex items-center"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={16} className="mr-1.5" />
          Add Habit
        </button>
      </div>

      {/* Add Habit Popup */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div 
            ref={formRef}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md animate-fadeIn"
          >
            <h3 className="text-lg font-medium mb-3">Add New Habit</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="habitName" className="block text-sm font-medium text-gray-700 mb-1">
                  Habit name
                </label>
                <input
                  id="habitName"
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="Enter habit name"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  autoFocus
                />
              </div>
              
              <div>
                <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
                  Recurrence
                </label>
                <select
                  id="recurrence"
                  value={newHabitRecurrence}
                  onChange={(e) => setNewHabitRecurrence(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekdays">Weekdays only</option>
                  <option value="weekends">Weekends only</option>
                </select>
              </div>
              
              <div className="flex gap-2 justify-end pt-2">
                <button 
                  onClick={resetAddHabitForm} 
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newHabitName.trim() !== "") {
                      const newHabit = {
                        id: Date.now().toString(),
                        name: newHabitName.trim(),
                        recurrence: newHabitRecurrence,
                        completed: false
                      };
                      addHabit(newHabit);
                      resetAddHabitForm();
                    }
                  }}
                  className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700"
                >
                  Add Habit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Habit Popup */}
      {editHabitId && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div 
            ref={editFormRef}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md animate-fadeIn"
          >
            <h3 className="text-lg font-medium mb-3">Edit Habit</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="editHabitName" className="block text-sm font-medium text-gray-700 mb-1">
                  Habit name
                </label>
                <input
                  id="editHabitName"
                  type="text"
                  value={editHabitName}
                  onChange={(e) => setEditHabitName(e.target.value)}
                  placeholder="Enter habit name"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  autoFocus
                />
              </div>
              
              <div>
                <label htmlFor="editRecurrence" className="block text-sm font-medium text-gray-700 mb-1">
                  Recurrence
                </label>
                <select
                  id="editRecurrence"
                  value={editHabitRecurrence}
                  onChange={(e) => setEditHabitRecurrence(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="daily">Hourly</option>
                  <option value="weekly">Daily</option>
                  <option value="monthly">Weekly</option>
                </select>
              </div>
              
              <div className="flex gap-2 justify-end pt-2">
                <button 
                  onClick={resetEditHabitForm} 
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedHabit}
                  className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal show={showShareModal} onClose={() => setShowShareModal(false)} />
    </div>
  )
}

HabitTracker.propTypes = {
  habits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      recurrence: PropTypes.string,
      completed: PropTypes.bool.isRequired
    })
  ).isRequired,
  currentDate: PropTypes.string.isRequired,
  toggleHabitCompletion: PropTypes.func.isRequired,
  deleteHabit: PropTypes.func.isRequired,
  addHabit: PropTypes.func.isRequired,
  editHabit: PropTypes.func.isRequired
}