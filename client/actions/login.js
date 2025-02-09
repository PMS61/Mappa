"use server";
import { cookies } from 'next/headers';

export default async function loginAction(formData) {
  try {
    let res = await fetch("http://localhost:8000/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    let data = await res.json();
    if (!data.error) {
      cookies().set('token', data.token);
      cookies().set('username', data.username);
      return { success: true, username: data.username }; // Return username in the response
    }
    return { success: false };
  } catch (e) {
    console.error({ message: e.message });
  }
}
