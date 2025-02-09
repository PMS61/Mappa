"use server"
import { cookies } from 'next/headers'
export default async function registerAction(formData) {
  try {
    let res = await fetch("http://localhost:8000/auth/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    let data = await res.json();
    if (!data.error) {
      cookies().set('token', data.token)
      cookies().set('username', data.username)
      // Store username in local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('uname', data.username);
      }
      return { success: true }
    }
    return { success: false }
  }
  catch (e) {
    console.error({ message: e.message })
  }
}
