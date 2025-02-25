import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "./TaskColumn";

const categories = ["To-Do", "In Progress", "Done"];

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        "https://task-manager-server-side-five.vercel.app/tasks"
      );
      setTasks(data);
    } catch (err) {
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    const { value } = await Swal.fire({
      title: "Add New Task",
      html: `
        <input id="swal-input-title" class="swal2-input" placeholder="Enter Task Title" maxlength="50">
        <select id="swal-input-category" class="swal2-select">
          ${categories
            .map((cat) => `<option value="${cat}">${cat}</option>`)
            .join("")}
        </select>
      `,
      showCancelButton: true,
      preConfirm: () => {
        const title = document.getElementById("swal-input-title").value.trim();
        const category = document.getElementById("swal-input-category").value;
        if (!title) {
          Swal.showValidationMessage("Task title is required!");
          return false;
        }
        return { title, category };
      },
    });

    if (!value) return;

    try {
      const { data } = await axios.post(
        "https://task-manager-server-side-five.vercel.app/tasks",
        {
          title: value.title,
          category: value.category,
        }
      );

      // Update state locally instead of re-fetching
      setTasks((prevTasks) => [...prevTasks, data]);
    } catch (err) {
      Swal.fire("Error", "Failed to add task. Please try again.", "error");
    }
  };

  const updateTaskCategory = async (id, newCategory) => {
    try {
      await axios.put(
        `https://task-manager-server-side-five.vercel.app/tasks/${id}`,
        {
          category: newCategory,
        }
      );

      // Update the category in local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, category: newCategory } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task category:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://task-manager-server-side-five.vercel.app/tasks/${id}`
      );

      // Remove the task from local state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Task Management</h1>

        <button
          onClick={addTask}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow"
        >
          Add Task
        </button>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
          {!loading &&
            categories.map((category) => (
              <TaskColumn
                key={category}
                category={category}
                tasks={tasks.filter((task) => task.category === category)}
                updateTaskCategory={updateTaskCategory}
                deleteTask={deleteTask}
              />
            ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Task;
