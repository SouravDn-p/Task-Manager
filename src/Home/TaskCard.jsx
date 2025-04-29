"use client";

import { useContext } from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "./Constants";
import { AuthContexts } from "../providers/AuthProvider";
import { Calendar, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "./lib/utils";

const formatDate = (date) => {
  return date ? new Date(date).toLocaleString() : "N/A";
};

const isLate = (submissionDate) => {
  if (!submissionDate) return false;
  return new Date(submissionDate) < new Date();
};

const categoryStyles = {
  "To-Do": {
    light: "bg-amber-100 border-l-4 border-amber-400 text-amber-700",
    dark: "bg-amber-900 text-amber-100 border-amber-500",
    icon: "text-amber-500",
    badge: "bg-amber-500 text-white",
  },
  "In Progress": {
    light: "bg-blue-100 border-l-4 border-blue-400 text-blue-700",
    dark: "bg-blue-900 text-blue-100 border-blue-500",
    icon: "text-blue-500",
    badge: "bg-blue-500 text-white",
  },
  Done: {
    light: "bg-green-100 border-l-4 border-green-400 text-green-700",
    dark: "bg-green-900 text-green-100 border-green-500",
    icon: "text-green-500",
    badge: "bg-green-500 text-white",
  },
};

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
      className={cn(
        "card shadow-md transition-all duration-300 p-4 rounded-xl border border-gray-300 dark:border-gray-700 relative",
        categoryStyles[task.category]?.[theme] ||
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      )}
    >
      {/* Category Label */}
      <span
        className={cn(
          "absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full",
          categoryStyles[task.category].badge
        )}
      >
        {task.category}
      </span>

      {/* Late Badge */}
      {task.submissionDate && isLate(task.submissionDate) && (
        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> Late
        </span>
      )}

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{task.title}</h3>
          </div>

          <div className="flex flex-col gap-1 text-sm opacity-80">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created: {formatDate(task.createdAt)}</span>
            </div>

            {task.submissionDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                <span>Due: {formatDate(task.submissionDate)}</span>
              </div>
            )}

            {task.completedAt && (
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed: {formatDate(task.completedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => deleteTask(task._id)}
          className="btn btn-sm btn-circle btn-outline hover:bg-red-200 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
