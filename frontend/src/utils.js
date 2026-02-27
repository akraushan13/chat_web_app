const BASE_URL = "http://127.0.0.1:8000"

export const getAccessToken = () => {
  return localStorage.getItem("access")
}

export const getRefreshToken = () => {
  return localStorage.getItem("refresh")
}

export const isAuthenticated = () => {
  return !!localStorage.getItem("access")
}

export default BASE_URL