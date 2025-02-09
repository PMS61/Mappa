"use server";
import { cookies } from "next/headers";
import axios from "axios";

export default async function getVersionAction() {
  try {
    const repo_id = cookies().get("repo_id")?.value;
    const res = await axios.post("http://localhost:8000/version/get-version", {
      repo_id: repo_id,
    });
    if (res.status === 200 && !res.data.error) {
      return { success: true, versions: res.data.versions };
    }
    return { success: false, error: res.data.detail };
  } catch (error) {
    console.error(
      "Error fetching versions:",
      error.response?.data?.detail || error.message,
    );
    return { success: false, error: "Something went wrong" };
  }
}
