"use client"

import React, { useEffect, useState } from 'react'
import FileTree from '../fileTree/fileTree'

const Page = ({ room, repoName }) => {

  // const pathss=["F1/F2/f3", "F1/f8", "F3/F4/f5", "F3/F4/f6", "F3/F7/f8", "F9/f10", "F11/F12/f13", "F11/F12/f14", "F11/F15/f16", "F11/F15/f17"];

  const [paths, setPaths] = useState([]);

  const getPaths = async () => {
    // POST 
    // fetch('/api/filetree', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ repoId }),
    // })

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
  
  useEffect(
    () => {
      getPaths();
  }, [room]); // Added room as a dependency to re-fetch paths when room changes

  useEffect(() => {
    console.log(paths);
  }, [paths]);

  // const pathss = [{"room_id":"testid1", "path":"F1/F2/f3"},
  //                 {"room_id":"testid2", "path":"F1/f8"},
  //                 {"room_id":"testid3", "path":"F3/F4/f5"},
  //                 {"room_id":"testid4", "path":"F3/F4/f6"}];

  // console.log(pathss);

  console.log(paths, room, repoName);

  return (
    <FileTree 
      paths={paths} 
      room={room}
      repoName={repoName}
    />
    // <></>
  )
}

export default Page