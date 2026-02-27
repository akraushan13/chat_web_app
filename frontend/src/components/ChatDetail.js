import Layout from "./partials/Layout"
import Chat from "./partials/Chat"
import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import { fetchContactDetail } from "../api/contactService"
import { fetchMessages } from "../api/chatService"
import { useWebSocket } from "../hooks/useWebSocket"

const ChatDetail = () => {

  const { id } = useParams()

  const [contact, setContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [slug, setSlug] = useState(null)
  const [isTyping, setIsTyping] = useState(false)

  // 1️⃣ DEFINE HANDLER FIRST
  const handleIncomingMessage = useCallback((data) => {

  const currentUserId = Number(localStorage.getItem("user"))

  if (data.type === "typing") {
    if (Number(data.sender) === currentUserId) return
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 2000)
    return
  }

  if (data.type === "read") {
  const currentUserId = Number(localStorage.getItem("user"))

  setMessages(prev =>
    prev.map(msg =>
      msg.sender_id === currentUserId
        ? { ...msg, is_read: true }
        : msg
    )
  )

  return
}

  setMessages(prev => [...prev, data])

}, [])

  // 2️⃣ THEN USE WEBSOCKET
  const { sendMessage } = useWebSocket(slug, handleIncomingMessage)

  // 3️⃣ FETCH CONTACT
  useEffect(() => {
    fetchContactDetail(id).then((data) => {
      setContact(data)
      setSlug(data.chat_slug)
    })
  }, [id])

  // 4️⃣ FETCH MESSAGES + MARK READ
  useEffect(() => {
    if (!slug) return

    fetchMessages(slug).then((data) => {
      setMessages(data.results || data)
    })

  }, [slug])

  return (
    <Layout>
      <Chat
        contact={contact}
        messages={messages}
        isTyping={isTyping}
        handleSendMessage={(payload) => {
          if (typeof payload === "string") {
            sendMessage({ type: "message", content: payload })
          } else {
            sendMessage(payload)
          }
        }}
      />
    </Layout>
  )
}

export default ChatDetail