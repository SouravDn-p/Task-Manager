"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiLoader,
} from "react-icons/fi";
import { AuthContexts } from "../providers/AuthProvider";

const activityTypeIcons = {
  create: <FiPlus className="w-4 h-4 text-green-500" />,
  update: <FiEdit className="w-4 h-4 text-blue-500" />,
  delete: <FiTrash2 className="w-4 h-4 text-red-500" />,
  complete: <FiCheckCircle className="w-4 h-4 text-green-500" />,
  error: <FiXCircle className="w-4 h-4 text-red-500" />,
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
    }
  }
  return "just now";
};

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const { user } = useContext(AuthContexts);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `https://rendingserver.onrender.com/activity/${user?.email}`
      );

      // Filter out logs with invalid or missing time values
      const validLogs = data.filter(
        (log) => log.time && !isNaN(new Date(log.time).getTime())
      );

      setLogs(validLogs);
    } catch (error) {
      setError("Failed to fetch activity logs. Please try again later.");
      console.error("Error fetching activity logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchLogs();
    }
  }, [user?.email]);

  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.type === filter);

  const groupedLogs = filteredLogs.reduce((groups, log) => {
    const dateObj = new Date(log.time);

    // Skip logs with invalid time values
    if (isNaN(dateObj.getTime())) {
      console.error("Invalid date found:", log.time);
      return groups;
    }

    const date = dateObj.toISOString().split("T")[0];

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {});

  return (
    <div className="bg-white dark:bg-gray-800 mt-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Activity Log
          </h2>
          <button
            onClick={fetchLogs}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh logs"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mb-2">
          {["all", "create", "update", "delete", "complete", "error"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${
                  filter === type
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center backdrop-blur-sm">
            <FiLoader className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="p-4 flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20">
            <FiAlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="max-h-[400px] overflow-auto">
          {Object.keys(groupedLogs).length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(groupedLogs).map(([date, dayLogs]) => (
                <div key={date} className="p-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    {formatDate(date)}
                  </h3>
                  <div className="space-y-3">
                    {dayLogs.map((log, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-sm animate-in slide-in-from-right-5"
                      >
                        <div className="mt-1">
                          {activityTypeIcons[log.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 dark:text-gray-100">
                            {log.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <FiClock className="w-3 h-3 text-gray-400" />
                            <time className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimeAgo(log.time)}
                            </time>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                No activities yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Activities will appear here when you start working on tasks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
