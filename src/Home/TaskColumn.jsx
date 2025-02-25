import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./Constants";
import TaskCard from "./TaskCard";
import axios from "axios";
import { AuthContexts } from "../providers/AuthProvider";

const TaskColumn = ({ category, tasks, fetchTasks }) => {
  const { theme } = useContext(AuthContexts);

  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: async (item) => {
      if (item.category !== category) {
        await axios.put(`http://localhost:5000/tasks/${item.id}`, {
          category,
        });
        fetchTasks();
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const themeStyles = {
    light: {
      bg: "bg-gray-100",
      hover: "bg-blue-100",
      text: "text-black",
    },
    dark: {
      bg: "bg-gray-800",
      hover: "bg-blue-900",
      text: "text-white",
    },
  };

  return (
    <div
      ref={dropRef}
      className={`p-4 rounded min-h-[250px] shadow-md ${
        isOver ? themeStyles[theme].hover : themeStyles[theme].bg
      } ${themeStyles[theme].text}`}
    >
      <h2 className="font-bold text-lg mb-2">{category}</h2>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onDelete={fetchTasks} />
      ))}
    </div>
  );
};

export default TaskColumn;
