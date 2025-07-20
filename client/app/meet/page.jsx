"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaVideo, FaCalendarPlus, FaSpinner, FaClock } from "react-icons/fa";

// Component for a single scheduled meeting item
const ScheduleItem = ({ schedule }) => {
  const handleJoin = () => {
    window.open("/meetings", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-gray-800 dark:text-white">
          {schedule.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(`${schedule.date}T${schedule.time}`).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
      <button
        onClick={handleJoin}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Join
      </button>
    </div>
  );
};

// Main Meet component
const Meet = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const repoId = Cookies.get("repo_id");

  const fetchSchedules = useCallback(async () => {
    if (!repoId) {
      setIsLoading(false);
      setError("Repository ID not found. Please select a repository first.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/schedule/get_schedule",
        { repo_id: repoId },
      );
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to load schedules.");
      setSchedules([]); // Clear old schedules on error
    } finally {
      setIsLoading(false);
    }
  }, [repoId]);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!name || !date || !time || !repoId) {
      setError("Please fill all fields to schedule a meeting.");
      return;
    }
    setError("");
    try {
      await axios.post("http://localhost:8000/schedule/set_schedule", {
        repo_id: repoId,
        name,
        date,
        time,
      });
      // Clear form and refetch schedules
      setName("");
      setDate("");
      setTime("");
      fetchSchedules();
    } catch (error) {
      console.error("Error setting schedule:", error);
      setError("Failed to schedule the meeting.");
    }
  };

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchSchedules]);

  return (
    <div className="p-6 h-full bg-gray-50 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Schedule Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
            <FaCalendarPlus className="text-blue-500" />
            Schedule a New Meeting
          </h2>
          <form onSubmit={handleSchedule} className="space-y-4">
            <input
              type="text"
              placeholder="Meeting Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Schedule Meet
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">or</p>
            <button
              onClick={() => window.open("/meetings", "_blank")}
              className="w-full p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Start an Instant Meeting
            </button>
          </div>
        </div>

        {/* Right: Upcoming Meetings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
            <FaClock className="text-purple-500" />
            Upcoming Meetings
          </h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-3xl text-blue-500" />
              </div>
            ) : schedules.length > 0 ? (
              schedules.map((schedule, index) => (
                <ScheduleItem key={index} schedule={schedule} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming meetings scheduled.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meet;
