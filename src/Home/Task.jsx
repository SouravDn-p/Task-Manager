import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskColumn from "./TaskColumn";
import { AuthContexts } from "../providers/AuthProvider";

const categories = ["To-Do", "In Progress", "Done"];
const categoryColors = {
  "To-Do": "bg-blue-200",
  "In Progress": "bg-yellow-200",
  Done: "bg-green-200",
};

const Task = () => {
  const { user } = useContext(AuthContexts);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.email) fetchTasks();
  }, [user?.email]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `https://rendingserver.onrender.com/tasks/${user.email}`
      );
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (type, title) => {
    try {
      await axios.post("https://rendingserver.onrender.com/activity", {
        email: user.email,
        type,
        title,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  const addTask = async () => {
    const { value } = await Swal.fire({
      title: "Add New Task",
      html: `
        <input id="swal-input-title" class="swal2-input" placeholder="Enter Task Title" maxlength="50">
        <input id="swal-input-submission" type="date" class="swal2-input">
        <select id="swal-input-category" class="swal2-select">
          ${categories
            .map((cat) => `<option value="${cat}">${cat}</option>`)
            .join("")}
        </select>
        <input id="swal-input-completeTime" type="time" class="swal2-input" style="display:none;">
      `,
      showCancelButton: true,
      didOpen: () => {
        const categorySelect = document.getElementById("swal-input-category");
        const completeTimeInput = document.getElementById(
          "swal-input-completeTime"
        );

        categorySelect.onchange = () => {
          completeTimeInput.style.display =
            categorySelect.value === "Done" ? "block" : "none";
          if (categorySelect.value !== "Done") completeTimeInput.value = "";
        };
      },
      preConfirm: () => {
        const title = document.getElementById("swal-input-title").value.trim();
        const submissionDate = document.getElementById(
          "swal-input-submission"
        ).value;
        const category = document.getElementById("swal-input-category").value;
        const completeTime = document.getElementById(
          "swal-input-completeTime"
        ).value;

        if (!title)
          return Swal.showValidationMessage("Task title is required!");
        if (!submissionDate)
          return Swal.showValidationMessage("Submission date is required!");
        if (category === "Done" && !completeTime)
          return Swal.showValidationMessage("Please select a completion time!");

        return {
          title,
          submissionDate,
          category,
          completeTime: category === "Done" ? completeTime : null,
        };
      },
    });

    if (!value) return;

    const newTask = {
      title: value.title,
      submissionDate: value.submissionDate,
      category: value.category,
      email: user.email,
      displayName: user.displayName,
      createdAt: new Date().toISOString(),
      completeTime: value.completeTime || null,
    };

    try {
      await axios.post("https://rendingserver.onrender.com/tasks", newTask);
      fetchTasks();
      logActivity("create", newTask.title);
      Swal.fire("Success!", "Task added successfully.", "success");
    } catch (err) {
      console.error("Error adding task:", err);
      Swal.fire("Error", "Failed to add task. Please try again.", "error");
    }
  };

  const updateTaskCategory = useCallback(
    async (id, newCategory) => {
      try {
        const updatedTask = {
          category: newCategory,
          completedAt: newCategory === "Done" ? new Date().toISOString() : null,
        };

        await axios.put(
          `https://rendingserver.onrender.com/tasks/${id}`,
          updatedTask
        );

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, ...updatedTask } : task
          )
        );

        const taskTitle =
          tasks.find((task) => task._id === id)?.title || "Unknown Task";
        logActivity("update", taskTitle);
      } catch (error) {
        console.error("Error updating task category:", error);
        Swal.fire("Error", "Could not update task category.", "error");
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id) => {
      const confirmDelete = await Swal.fire({
        title: "Are you sure?",
        text: "This task will be permanently deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!confirmDelete.isConfirmed) return;

      try {
        await axios.delete(`https://rendingserver.onrender.com/tasks/${id}`);
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

        const taskTitle =
          tasks.find((task) => task._id === id)?.title || "Unknown Task";
        logActivity("delete", taskTitle);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting task:", error);
        Swal.fire("Error", "Could not delete task.", "error");
      }
    },
    [tasks]
  );

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

        {loading && (
          <div className="flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
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
                bgColor={categoryColors[category]}
              />
            ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Task;
