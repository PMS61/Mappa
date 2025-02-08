"use server";
import axios from "axios";

export default async function addCollabAction(
  username,
  repo_name,
  repo_id,
  access,
) {
  try {
    const res = await axios.post(`http://localhost:8000/repo/add-collab/`, {
      username: username,
      repo_id: repo_id,
      repo_name: repo_name,
    });
    console.log(res.data.uid, res.data.repo_id, access);
    const res2 = await axios.post("http://localhost:8000/access/set-access/", {
      uid: res.data.uid,
      repo_id: res.data.repo_id,
      access: access,
    });
    if (res2.status === 200 && !res2.data.error) {
      return { success: true, repo: res.data };
    }
    return { success: false, error: res.data.detail };
  } catch (error) {
    console.error(
      "Error adding collaborator:",
      error.response?.data?.detail || error.message,
    );
    return { success: false, error: "Something went wrong" };
  }
}
