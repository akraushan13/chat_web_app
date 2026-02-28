import { useEffect, useRef } from "react"
import BASE_URL, { getAccessToken } from "../utils/auth"

const WS_BASE = BASE_URL.replace("http", "ws")

export const useGlobalWebSocket = (onMessage) => {

  const socketRef = useRef(null)
  const messageHandlerRef = useRef(onMessage)

  // Always keep latest handler
  useEffect(() => {
    messageHandlerRef.current = onMessage
  }, [onMessage])

  useEffect(() => {

    const token = getAccessToken()
    if (!token) return

    const socket = new WebSocket(
      `${WS_BASE}/ws/chat/?token=${token}`
    )

    socketRef.current = socket

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      messageHandlerRef.current(data)
    }

    socket.onopen = () => {
      console.log("GLOBAL WS CONNECTED")
    }

    socket.onclose = () => {
      console.log("GLOBAL WS CLOSED")
    }

    return () => {
      socket.close()
    }

  }, []) // EMPTY DEP ARRAY

  const sendMessage = (payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload))
    }
  }

  return { sendMessage }
}