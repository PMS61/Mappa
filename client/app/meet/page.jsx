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
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 flex items-center justify-between hover:bg-gray-700/50 transition-colors">
      <div>
        <h3 className="font-semibold text-white">
          {schedule.name}
        </h3>
        <p className="text-sm text-gray-400">
          {new Date(`${schedule.date}T${schedule.time}`).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
      <button
        onClick={handleJoin}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-600 transition-colors"
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
  const [isScheduling, setIsScheduling] = useState(false);

  const repoId = Cookies.get("repo_id");

  const fetchSchedules = useCallback(async () => {
    if (!repoId) {
      setIsLoading(false);
      setError("Repository ID not found. Please select a repository first.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8000/schedule/get_schedule",
        { repo_id: repoId },
      );
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setError("Failed to load schedules.");
      setSchedules([]);
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
      setIsScheduling(true);
      await axios.post("http://localhost:8000/schedule/set_schedule", {
        repo_id: repoId,
        name,
        date,
        time,
      });
      setName("");
      setDate("");
      setTime("");
      fetchSchedules();
    } catch (error) {
      console.error("Error setting schedule:", error);
      setError("Failed to schedule the meeting.");
    } finally {
      setIsScheduling(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 10000);
    return () => clearInterval(interval);
  }, [fetchSchedules]);

  return (
    <div className="p-6 h-full bg-gray-800">
      <div className="grid grid-cols-1 gap-8">
        {/* Left: Schedule Form */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FaCalendarPlus className="text-blue-500" />
            Schedule a New Meeting
          </h2>
          <form onSubmit={handleSchedule} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Meeting Name</label>
              <input
                type="text"
                placeholder="Team sync, Planning, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isScheduling}
              className="w-full p-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition flex justify-center items-center gap-2"
            >
              {isScheduling ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Meeting"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 text-sm text-gray-400 bg-gray-800">
                  or start instantly
                </span>
              </div>
            </div>
            
            <button
              onClick={() => window.open("/meetings", "_blank")}
              className="w-full p-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-600 transition flex justify-center items-center gap-2"
            >
              <FaVideo />
              Start Instant Meeting
            </button>
          </div>
        </div>

        {/* Right: Upcoming Meetings */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaClock className="text-purple-500" />
              Upcoming Meetings
            </h2>
            <button 
              onClick={fetchSchedules}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaSpinner className="text-sm" />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
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
                <div className="mb-4 flex justify-center">
                  <div className="bg-gray-700 p-4 rounded-full">
                    <FaClock className="text-3xl text-gray-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-300">No upcoming meetings</h3>
                <p className="text-gray-500 mt-2">
                  Schedule a meeting or start an instant one
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