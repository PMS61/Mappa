"use client"

import React, { useEffect, useState } from 'react'
import FileTree from '../fileTree/fileTree'

const Page = ({ room, repoName, tabs, setTabs, setActiveTab }) => {
  // const pathss=["F1/F2/f3", "F1/f8", "F3/F4/f5", "F3/F4/f6", "F3/F7/f8", "F9/f10", "F11/F12/f13", "F11/F12/f14", "F11/F15/f16", "F11/F15/f17"];

  const [paths, setPaths] = useState([]);

  const getPaths = async () => {
    const res = await fetch('http://localhost:8000/room/get-room-and-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "repo_id": room }),
    })

    console.log(res);

    if (res.status === 200) {
      const data = await res.json();
      console.log(data);
      setPaths(data.rooms);
    }
  }

  const addfile = (entry) => {
    // console.log(entry);
    // console.log(tabs);
    // console.log([...tabs, entry]);
    setTabs([...tabs, entry]);
    setActiveTab(entry.id);
  }
  
  useEffect(() => {
    getPaths();
    const intervalId = setInterval(getPaths, 2000); // Auto-refresh every 2 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [room]); // Added room as a dependency to re-fetch paths when room changes

  useEffect(() => {
    console.log(paths);
  }, [paths]);

  console.log(paths, room, repoName);

  return (
    <FileTree 
      paths={paths} 
      room={room}
      repoName={repoName}
      addfile={addfile}
    />
    // <></>
  )
}

export default Page