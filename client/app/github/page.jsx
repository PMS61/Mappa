"use client";
import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "Ghruank"; // Replace with your GitHub username
const REPO = "github_api";
const FILE_PATH = "main.py"; // Fixed file name

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export default function GitHubEditor() {
  const [content, setContent] = useState("");
  const [sha, setSha] = useState("");
  const [commits, setCommits] = useState([]);
  const [lineCommits, setLineCommits] = useState({});

  const fetchFile = async () => {
    try {
      const res = await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: FILE_PATH,
      });

      if ("content" in res.data) {
        setContent(atob(res.data.content));
        setSha(res.data.sha);
      }
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const pushFile = async () => {
    const message = prompt("Enter commit message:");
    if (!message) return;

    try {
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: FILE_PATH,
        message,
        content: btoa(content),
        sha,
      });

      alert("File pushed successfully!");
      fetchCommits();
      fetchLineCommits();
    } catch (error) {
      console.error("Error pushing file:", error);
    }
  };

  const fetchCommits = async () => {
    try {
      const res = await octokit.repos.listCommits({
        owner: OWNER,
        repo: REPO,
        path: FILE_PATH,
      });

      setCommits(res.data);
    } catch (error) {
      console.error("Error fetching commits:", error);
    }
  };

  const fetchLineCommits = async () => {
    try {
      const res = await octokit.repos.listCommits({
        owner: OWNER,
        repo: REPO,
        path: FILE_PATH,
      });

      const commitData = {};
      for (const commit of res.data) {
        const commitRes = await octokit.repos.getCommit({
          owner: OWNER,
          repo: REPO,
          commit_sha: commit.sha,
        });

        commitRes.data.files?.forEach((file) => {
          if (file.filename === FILE_PATH) {
            file.patch?.split("\n").forEach((line) => {
              if (line.startsWith("+") && !line.startsWith("++")) {
                commitData[line.substring(1)] = commit.commit.message;
              }
            });
          }
        });
      }
      setLineCommits(commitData);
    } catch (error) {
      console.error("Error fetching line commits:", error);
    }
  };

  const loadVersion = async (commitSha) => {
    try {
      const commitRes = await octokit.git.getCommit({
        owner: OWNER,
        repo: REPO,
        commit_sha: commitSha,
      });

      const treeSha = commitRes.data.tree.sha;

      const treeRes = await octokit.git.getTree({
        owner: OWNER,
        repo: REPO,
        tree_sha: treeSha,
        recursive: "true",
      });

      const file = treeRes.data.tree.find((item) => item.path === FILE_PATH);
      if (!file) throw new Error("File not found in tree.");

      const blobRes = await octokit.git.getBlob({
        owner: OWNER,
        repo: REPO,
        file_sha: file.sha,
      });

      setContent(atob(blobRes.data.content));
    } catch (error) {
      console.error("Error loading version:", error);
    }
  };

  useEffect(() => {
    fetchFile();
    fetchCommits();
    fetchLineCommits();
  }, []);

  const renderWithCommitHover = () => {
    console.log("Line Commits Mapping:", lineCommits); // Debugging log
  
    return content.split("\n").map((line, i) => {
      const commitMessage = lineCommits[line.trim()] || ""; // Trim to avoid mismatches
  
      return (
        <div 
          key={i} 
          className="flex justify-between px-2 py-1 hover:bg-gray-100 transition-colors duration-150"
        >
          <span>{line}</span>
          <span className="text-gray-500 text-xs ml-4">{commitMessage}</span>
        </div>
      );
    });
  };
  

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Edit main.py in {REPO}</h1>

      <div className="border p-2">{renderWithCommitHover()}</div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="mt-2 w-full p-2 border"
      />
      <Button onClick={pushFile} className="mt-2">
        Push to GitHub
      </Button>

      <h2 className="mt-4 text-lg font-bold">Version History</h2>
      {commits.map((commit) => (
        <Card key={commit.sha} className="mt-2">
          <CardContent>
            <p>{commit.commit.message}</p>
            <Button onClick={() => loadVersion(commit.sha)} size="sm">
              Load Version
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
