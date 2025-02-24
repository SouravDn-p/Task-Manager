import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "./TaskColumn";

const categories = ["To-Do", "In Progress", "Done"];

const Task = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await axios.get("http://localhost:5000/tasks");
    setTasks(data);
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
        }
        return { title, category };
      },
    });

    if (!value) return;

    await axios.post("http://localhost:5000/tasks", {
      title: value.title,
      category: value.category,
    });

    fetchTasks();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-black">
          {categories.map((category) => (
            <TaskColumn
              key={category}
              category={category}
              tasks={tasks.filter((task) => task.category === category)}
              fetchTasks={fetchTasks}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Task;
