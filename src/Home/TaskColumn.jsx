import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { ItemTypes } from "./Constants";
import TaskCard from "./TaskCard";
import { AuthContexts } from "../providers/AuthProvider";

const TaskColumn = ({
  category,
  tasks,
  updateTaskCategory,
  deleteTask,
  bgColor,
}) => {
  const { theme } = useContext(AuthContexts);

  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item) => {
      if (item.category !== category) {
        updateTaskCategory(item.id, category);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`p-4 rounded min-h-[250px] shadow-md transition-all ${bgColor} ${
        isOver ? "border-2 border-dashed border-gray-500" : ""
      }`}
    >
      <h2 className="font-bold text-lg mb-2">{category}</h2>
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} deleteTask={deleteTask} />
      ))}
    </div>
  );
};

export default TaskColumn;
