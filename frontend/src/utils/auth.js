const BASE_URL = "http://127.0.0.1:8000"

export const getAccessToken = () => localStorage.getItem("access")
export const getRefreshToken = () => localStorage.getItem("refresh")

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem("access", access)
  if (refresh) localStorage.setItem("refresh", refresh)
}

export const clearAuth = () => {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("user")
}

export const isAuthenticated = () => !!localStorage.getItem("access")

export default BASE_URL