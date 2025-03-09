"use client";

import React, { useState, useEffect } from 'react';
import { FaVideo } from 'react-icons/fa'; // Import icon
import axios from 'axios';
import Cookies from 'js-cookie';

const Meet = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [schedules, setSchedules] = useState([]);

  const repoId = Cookies.get('repo_id');

  const fetchSchedules = async () => {
    try {
      const response = await axios.post('http://localhost:8000/schedule/get_schedule', { repo_id: repoId });
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleSchedule = async () => {
    try {
      await axios.post('http://localhost:8000/schedule/set_schedule', {
        repo_id: repoId,
        name,
        date,
        time
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error setting schedule:', error);
    }
  };

  useEffect(() => {
    fetchSchedules();
    const interval = setInterval(fetchSchedules, 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-r from-blue-100 to-green-100 backdrop-blur-md dark:from-gray-900 dark:to-gray-900 p-6">
      <div className="flex flex-col items-center space-y-6">
        <FaVideo className="text-6xl text-blue-500" />
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-800 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
          Schedule Meet
        </h2>
        <div className="flex flex-col space-y-3 w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Meeting Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
          />
          <button onClick={handleSchedule} className="p-3 bg-blue-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 transition">
            <FaVideo />
            <span>Schedule Meet</span>
          </button>
          <button onClick={() => window.open('/meetings', '_blank')} className="p-3 bg-green-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition">
            <FaVideo />
            <span>Join Now</span>
          </button>
        </div>
      </div>
      <div className="mt-8 mx-auto w-full max-w-4xl overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 text-black dark:text-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white dark:bg-blue-700">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule, index) => (
              <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <td className="py-3 px-4">{schedule.name}</td>
                <td className="py-3 px-4">{schedule.date}</td>
                <td className="py-3 px-4">{schedule.time}</td>
                <td className="py-3 px-4">
                  <button onClick={() => window.open('/meetings', '_blank')} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                    Join
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Meet;