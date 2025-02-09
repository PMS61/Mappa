"use server";
import { cookies } from "next/headers";
import axios from "axios";

export default async function readVersionAction(version) {
  try {
    const token = cookies().get("repo_id")?.value;
    const res = await axios.post("http://localhost:8000/version/read-version", {
      repo_id: token,
      version: version,
    });

    if (res.status === 200 && !res.data.error) {
      return {
        success: true,
        data: res.data.files[0],
      };
    }
    return { success: false, error: res.data.detail };
  } catch (error) {
    console.error(
      "Error reading version:",
      error.response?.data?.detail || error.message,
    );
    return { success: false, error: "Something went wrong" };
  }
}
