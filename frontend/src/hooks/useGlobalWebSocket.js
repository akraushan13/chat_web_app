import { useEffect, useRef } from "react"
import BASE_URL, { getAccessToken } from "../utils/auth"

const WS_BASE = BASE_URL.replace("http", "ws")

export const useGlobalWebSocket = (onMessage) => {

  const socketRef = useRef(null)
  const messageHandlerRef = useRef(onMessage)

  // Keep latest handler
  useEffect(() => {
    messageHandlerRef.current = onMessage
  }, [onMessage])

  useEffect(() => {

    const token = getAccessToken()
    if (!token) return

    // Close old socket before opening new one
    if (socketRef.current) {
      socketRef.current.close()
    }

    const socket = new WebSocket(
      `${WS_BASE}/ws/chat/?token=${token}`
    )

    socketRef.current = socket

    socket.onopen = () => {
      console.log("GLOBAL WS CONNECTED")
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      messageHandlerRef.current?.(data)
    }

    socket.onclose = () => {
      console.log("GLOBAL WS CLOSED")
    }

    socket.onerror = (err) => {
      console.log("WS ERROR", err)
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING) {
        socket.close()
      }
    }

  }, [getAccessToken()])   // re-run if token changes

  const sendMessage = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload))
    }
  }

  return { sendMessage }
}