"use server";
import { cookies } from "next/headers";
import axios from "axios";

export async function createOrgAction(orgName) {
  try {
    const token = cookies().get("token")?.value;
    if (!token) throw new Error("Authentication token is missing");
    const res = await axios.post("http://localhost:8000/org/add-org", {
      org_name: orgName,
      uid: token,
      org_id: "00000000-0000-0000-0000-000000000000",
      admin: true,
      username: "",
    });
    if (res.status === 200 && !res.data.error) {
      return {
        success: true,
        orgId: res.data.org_id,
        orgName: res.data.org_name,
        error: false,
      };
    }
    console.log(res);
    return { success: false, error: true };
  } catch (error) {
    console.error(
      "Error creating organization:",
      error.response?.data?.detail || error.message,
    );
    return { success: false, error: true };
  }
}

export async function createAddCollabs(orgName, username) {
  try {
    const org_id = cookies().get("org_id")?.value;
    if (!org_id) throw new Error("Organization ID is missing");
    const res = await axios.post("http://localhost:8000/org/add-org", {
      org_name: orgName,
      username: username,
      org_id: org_id,
      uid: "00000000-0000-0000-0000-000000000000",
      admin: false,
    });
    if (res.status === 200 && !res.data.error) {
      return {
        success: true,
        orgId: res.data.org_id,
        orgName: res.data.org_name,
      };
    }
    return { success: false, error: false };
  } catch (error) {
    console.error(
      "Error creating organization:",
      error.response?.data?.detail || error.message,
    );
    return { success: false, error: true };
  }
}
export async function fetchOrgsByUidAction() {
  try {
    const token = cookies().get("token")?.value;
    const res = await axios.post("http://localhost:8000/org/get-orgs-by-uid/", {
      uid: token,
    });
    if (res.status === 200 && !res.data.error) {
      return { success: true, orgs: res.data };
    }
    return { success: false, error: true };
  } catch (error) {
    console.error(
      "Error fetching organizations:",
      error.response?.data?.detail || error.message,
    );
    return { success: false, error: true };
  }
}
