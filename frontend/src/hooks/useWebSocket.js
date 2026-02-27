import { useEffect, useRef, useCallback } from "react"
import BASE_URL, {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearAuth
} from "../utils/auth"

const WS_BASE = BASE_URL.replace("http", "ws")

export const useWebSocket = (slug, onMessage) => {

  const socketRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const reconnectTimeout = useRef(null)

  const connect = useCallback(() => {

    if (!slug) return

    const token = getAccessToken()
    if (!token) return

    const socket = new WebSocket(
      `${WS_BASE}/ws/${slug}/?token=${token}`
    )

    socketRef.current = socket

    socket.onopen = () => {
      console.log("WS connected")
      reconnectAttempts.current = 0

      // ✅ Send read event AFTER socket is open
      socketRef.current?.send(
        JSON.stringify({ type: "read" })
      )
    }
socket.onmessage = (event) => {
  const data = JSON.parse(event.data)

  // 🔥 Ignore messages if slug changed
  if (!socketRef.current || socket !== socketRef.current) {
    return
  }

  onMessage(data)
}

    socket.onerror = (err) => {
      console.log("WS error", err)
    }

    socket.onclose = async (event) => {
      console.log("WS closed:", event.code)

      // Token expired → refresh
      if (event.code === 4001 && getRefreshToken()) {
        try {
          const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refresh: getRefreshToken()
            })
          })

          const data = await res.json()

          if (res.ok) {
            setTokens({
              access: data.access,
              refresh: getRefreshToken()
            })
            connect()
            return
          }
        } catch (err) {
          console.log("Token refresh failed")
        }

        clearAuth()
        window.location.href = "/login"
        return
      }

      // Network reconnect logic
      reconnectAttempts.current += 1

      const delay = Math.min(
        1000 * reconnectAttempts.current,
        5000
      )

      reconnectTimeout.current = setTimeout(() => {
  			if (socketRef.current) {
    			connect()
  			}
			}, delay)
    }

  }, [slug, onMessage])

  useEffect(() => {

    if (!slug) return

    connect()

    return () => {
  		clearTimeout(reconnectTimeout.current)

  		if (socketRef.current) {
    		socketRef.current.onclose = null
    		socketRef.current.close()
  		}

  		socketRef.current = null
		}

  }, [slug, connect])

  const sendMessage = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload))
    }
  }

  return { sendMessage }
}