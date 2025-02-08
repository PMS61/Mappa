"use client";
import { useState, useEffect } from "react";
import { Octokit } from "@octokit/rest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const GITHUB_TOKEN = "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"; // Replace with your GitHub token
const OWNER = "Ghruank"; // Replace with your GitHub username
const REPO = "github_api"; 
const FILE_PATH = "main.py"; // Fixed file name

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export default function GitHubEditor() {
  const [content, setContent] = useState("");
  const [sha, setSha] = useState("");
  const [commits, setCommits] = useState([]);

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
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path: FILE_PATH,
        message: "Updated main.py",
        content: btoa(content),
        sha,
      });

      alert("File pushed successfully!");
      fetchCommits();
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

  const loadVersion = async (commitSha) => {
    try {
      // Fetch commit details to get the tree SHA
      const commitRes = await octokit.git.getCommit({
        owner: OWNER,
        repo: REPO,
        commit_sha: commitSha,
      });
  
      const treeSha = commitRes.data.tree.sha;
  
      // Fetch tree to get the blob SHA of main.py
      const treeRes = await octokit.git.getTree({
        owner: OWNER,
        repo: REPO,
        tree_sha: treeSha,
        recursive: "true",
      });
  
      const file = treeRes.data.tree.find((item) => item.path === FILE_PATH);
  
      if (!file) throw new Error("File not found in tree.");
  
      // Fetch blob using correct SHA
      const blobRes = await octokit.git.getBlob({
        owner: OWNER,
        repo: REPO,
        file_sha: file.sha,
      });
  
      setContent(atob(blobRes.data.content)); // Decode and set content
    } catch (error) {
      console.error("Error loading version:", error);
    }
  };

  useEffect(() => {
    fetchFile();
    fetchCommits();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Edit main.py in {REPO}</h1>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="mt-2"
      />
      <Button onClick={pushFile} className="mt-2">Push to GitHub</Button>

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
