"use server";
import { cookies } from "next/headers";
import axios from "axios";

export default async function createRepoAction(reponame) {
  try {
    console.log(true);
    const token = cookies().get("token")?.value;
    const org_id = cookies().get("org_id")?.value;
    const res = await axios.post("http://localhost:8000/repo/create-repo", {
      uid: token, // User ID from formData
      repo_name: reponame, // Repository name from formData
      org_id: org_id,
    });
    const res2 = await axios.post("http://localhost:8000/access/set-access/", {
      uid: token,
      repo_id: res.data.repo_id,
      access: "Owner",
    });
    if (res2.status === 200 && !res2.data.error) {
      return {
        success: true,
        repoId: res.data.repo_id,
        access: res2.data.access,
      };
    }
    return { success: false, error: res.data.detail };
  } catch (error) {
    console.error(
      "Error creating repository:",
      error.response?.data?.detail || error.message,
    );
    return { success: false, error: "Something went wrong" };
  }
}
