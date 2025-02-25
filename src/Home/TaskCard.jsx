import React, { useContext } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./Constants";
import { AuthContexts } from "../providers/AuthProvider";

const TaskCard = ({ task, deleteTask }) => {
  const { theme } = useContext(AuthContexts);

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: task._id, category: task.category },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`p-3 mb-2 rounded shadow flex justify-between items-center cursor-pointer transition-all duration-300 ${
        theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
      }`}
    >
      <span className="font-semibold">{task.title}</span>
      <button
        onClick={() => deleteTask(task._id)}
        className="hover:text-red-700 transition-all duration-200"
      >
        <span
          className={`${theme === "light" ? "text-red-500" : "text-red-400"}`}
        >
          ✖
        </span>
      </button>
    </div>
  );
};

export default TaskCard;
