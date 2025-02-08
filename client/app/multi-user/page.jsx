"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { diffLines } from "diff";

const fileHistory = [
  { file_id: 1, path: "file.txt", version: 1, user: "Alice", data: "Hello world\nThis is a test" },
  { file_id: 1, path: "file.txt", version: 2, user: "Bob", data: "Hello world\nThis is a modified test" },
  { file_id: 1, path: "file.txt", version: 3, user: "Charlie", data: "Hello world!\nThis is a modified test\nNew line added" },
];

const getUserAnnotations = (history) => {
  let lineOwnership = {};
  let previousLines = [];
  
  history.forEach(({ user, data }) => {
    const newLines = data.split("\n");
    newLines.forEach((line, index) => {
      if (index >= previousLines.length || line !== previousLines[index]) {
        lineOwnership[index] = user;
      }
    });
    previousLines = newLines;
  });
  return lineOwnership;
};

const getLatestFile = (history) => {
  return history.reduce((latest, file) => (file.version > latest.version ? file : latest), history[0]);
};

const MultiUserEditor = () => {
  const [latestFile, setLatestFile] = useState(null);
  const [userAnnotations, setUserAnnotations] = useState({});

  useEffect(() => {
    const latest = getLatestFile(fileHistory);
    setLatestFile(latest);
    setUserAnnotations(getUserAnnotations(fileHistory));
  }, []);

  return (
    <Card className="p-4 w-full bg-gray-900 text-white rounded-xl">
      <h2 className="text-lg font-bold mb-2">{latestFile?.path} (v{latestFile?.version})</h2>
      <pre className="whitespace-pre-wrap">{
        latestFile?.data.split("\n").map((line, index) => (
          <div key={index} className="flex justify-between">
            <span>{line}</span>
            <span className="text-sm text-gray-400">{userAnnotations[index]}</span>
          </div>
        ))
      }</pre>
    </Card>
  );
};

export default MultiUserEditor;
