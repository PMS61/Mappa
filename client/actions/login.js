"use server"
import { cookies } from 'next/headers'

export default async function loginAction(formData) {
  try {
    let res = await fetch("http://localhost:8000/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    let data = await res.json();
    cookies().set('token', data.token)
    return data.error
  }
  catch (e) {
    console.error({ message: e.message })
  }
}
