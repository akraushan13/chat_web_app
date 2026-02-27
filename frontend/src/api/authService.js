import BASE_URL from "../utils/auth"
import { setTokens } from "../utils/auth"

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.error || "Login failed")

  setTokens({
    access: data.access,
    refresh: data.refresh
  })
  localStorage.setItem("user", data.user)

  return data
}

export const signupUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/api/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  })

  const data = await res.json()

  if (res.status !== 201) {
    throw new Error(data.error || "Signup failed")
  }

  return data
}