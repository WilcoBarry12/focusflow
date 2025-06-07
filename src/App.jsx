import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('');
  const [timer, setTimer] = useState(null);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (timer === 0 && activeTaskIndex !== null) {
      alert(`Time's up for "${tasks[activeTaskIndex].name}"!`);
      clearInterval(intervalRef.current);
      setActiveTaskIndex(null);
      setTimer(null);
    }
  }, [timer, activeTaskIndex, tasks]);

  const addTask = () => {
    if (!taskName || !duration) return;
    setTasks([...tasks, { name: taskName, duration: Number(duration), completed: false }]);
    setTaskName('');
    setDuration('');
  };

  const deleteTask = (index) => {
    if (activeTaskIndex === index) {
      clearInterval(intervalRef.current);
      setActiveTaskIndex(null);
      setTimer(null);
    }
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setTasks(tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  const startTimer = (index) => {
    if (activeTaskIndex === index) return;
    clearInterval(intervalRef.current);
    setActiveTaskIndex(index);
    setTimer(tasks[index].duration * 60);

    intervalRef.current = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🧠 FocusFlow Daily Planner</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-32 p-2 border border-gray-300 rounded"
        />
      </div>

      <button
        onClick={addTask}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
      >
        Add Task
      </button>

      <h3 className="text-xl font-semibold mt-6 mb-2">📋 Your Planned Tasks:</h3>
      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between border p-3 rounded shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(index)}
              />
              <span
                className={`${
                  task.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                ⏳ {task.name} — {task.duration} min
              </span>
            </div>

            <div className="mt-2 sm:mt-0 flex space-x-2">
              <button
                onClick={() => deleteTask(index)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => startTimer(index)}
                disabled={activeTaskIndex === index}
                className={`text-sm px-2 py-1 rounded ${
                  activeTaskIndex === index
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {activeTaskIndex === index ? 'Running...' : 'Start Timer'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {activeTaskIndex !== null && timer !== null && (
        <div className="mt-6 text-center text-2xl font-semibold text-blue-600">
          ⏱ Timer for "{tasks[activeTaskIndex].name}": {formatTime(timer)}
        </div>
      )}
    </div>
  );
}

export default App;
