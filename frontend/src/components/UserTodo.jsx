import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UserTodo = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const { userId } = useParams(); 

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!userId) {
          console.error("No userId in URL");
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/tasks/${userId}`
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.tasks;

        const mapped = data.map((t) => ({
          id: t.id,
          text: t.description,
          completed: t.completed ?? false,
        }));
        setUsername(response.data.username);
        setTasks(mapped);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [userId]);

  // Add task
  const handleAddTask = async () => {
    if (input.trim() === "") return;

    try {
      const resp = await axios.post(
        `http://localhost:8000/tasks/${userId}`,
        { description: input }
      );

      const created = {
        id: resp.data.id,
        text: resp.data.description,
      };

      setTasks((prev) => [...prev, created]);
      setInput("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  //  Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/tasks/${userId}/${id}`);

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  //  frontend only (optional backend later)
  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-800 flex items-center justify-center font-sans">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          {username}'s Tasks
        </h1>

        <div className="text-right mb-4">
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
          />

          <button
            onClick={handleAddTask}
            className="px-6 py-3 bg-red-600 text-white rounded-lg"
          >
            Add
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks yet...</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
              >
                <span
                  onClick={() => toggleComplete(task.id)}
                  className={`cursor-pointer flex-1 ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.text}
                </span>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTodo;