import BASE_URL from "../utils/auth"
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth
} from "../utils/auth"

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

export const apiClient = async (endpoint, options = {}) => {

  const token = getAccessToken()

  const config = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  let response = await fetch(`${BASE_URL}${endpoint}`, config)

  // ==============================
  // IF ACCESS TOKEN EXPIRED
  // ==============================
  if (response.status === 401 && getRefreshToken()) {

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        config.headers["Authorization"] = `Bearer ${token}`
        return fetch(`${BASE_URL}${endpoint}`, config)
          .then(res => res.json())
      })
    }

    isRefreshing = true

    try {
      const refreshResponse = await fetch(
        `${BASE_URL}/api/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: getRefreshToken() })
        }
      )

      const refreshData = await refreshResponse.json()

      if (!refreshResponse.ok) {
        throw new Error("Refresh failed")
      }

      // Save new access token
      setTokens({
  access: refreshData.access,
  refresh: getRefreshToken()
})

      processQueue(null, refreshData.access)

      // Retry original request
      config.headers["Authorization"] = `Bearer ${refreshData.access}`

      response = await fetch(`${BASE_URL}${endpoint}`, config)

      return response.json()

    } catch (err) {

      processQueue(err, null)

      clearAuth()
      window.location.href = "/login"

    } finally {
      isRefreshing = false
    }
  }

  return response.json()
}