"use server"
import { cookies } from "next/headers"
import axios from "axios"

export default async function createRepoAction(reponame) {
  try {
    const token = cookies().get("token")?.value
    const res = await axios.post("http://localhost:8000/repo/create-repo", {
      uid: token, // User ID from formData
      repo_name: reponame, // Repository name from formData
    })
    if (res.status === 200 && !res.data.error) {
      return { success: true, repoId: res.data.repo_id }
    }
    return { success: false, error: res.data.detail }
  } catch (error) {
    console.error("Error creating repository:", error.response?.data?.detail || error.message)
    return { success: false, error: "Something went wrong" }
  }
}
