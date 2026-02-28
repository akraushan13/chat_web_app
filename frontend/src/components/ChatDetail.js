import Layout from "./partials/Layout"
import Chat from "./partials/Chat"
import { useParams } from "react-router-dom"
import { useEffect, useState, useCallback, useRef } from "react"
import { fetchContactDetail } from "../api/contactService"
import { fetchMessages } from "../api/chatService"
import { useGlobalWebSocket } from "../hooks/useGlobalWebSocket"

const ChatDetail = () => {

  const { id } = useParams()

  const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [loadingOlder, setLoadingOlder] = useState(false)

  const [contact, setContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [slug, setSlug] = useState(null)
  const [isTyping, setIsTyping] = useState(false)

  const hasSentRead = useRef(false)

	const loadOlderMessages = async () => {

  if (!hasMore || loadingOlder) return

  setLoadingOlder(true)

  const nextPage = page + 1

  const container = document.querySelector(".chat__main")
  const prevHeight = container.scrollHeight

  const data = await fetchMessages(slug, nextPage)

  const older = data.results || []
	setMessages(prev => [...older, ...prev])

  setPage(nextPage)
  setHasMore(!!data.next)

  setTimeout(() => {
    const newHeight = container.scrollHeight
    container.scrollTop = newHeight - prevHeight
  }, 0)

  setLoadingOlder(false)
}

  //  WEBSOCKET FIRST
  const { sendMessage } = useGlobalWebSocket((data) => {
    handleIncomingMessage(data)
  })

  //  HANDLE INCOMING EVENTS
  const handleIncomingMessage = useCallback((data) => {

    // Ignore other chats
    if (data.chat_slug && data.chat_slug !== slug) return

    const currentUserId = Number(localStorage.getItem("user"))

    // NEW MESSAGE
    if (data.type === "chat_message") {

      setMessages(prev => [...prev, data.message])

      // If message from other user → mark read instantly
      if (Number(data.message.sender_id) !== currentUserId) {
        sendMessage({
          type: "read",
          chat_slug: slug
        })
      }

      return
    }

    // TYPING
    if (data.type === "typing_event") {
      if (Number(data.sender) === currentUserId) return
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2000)
      return
    }

    // READ RECEIPT
    if (data.type === "read_event") {

      if (Number(data.reader) === currentUserId) return

      setMessages(prev =>
        prev.map(msg =>
          Number(msg.sender_id) === currentUserId
            ? { ...msg, is_read: true }
            : msg
        )
      )

      return
    }

  }, [slug, sendMessage])

  //  FETCH CONTACT
  useEffect(() => {
    fetchContactDetail(id).then((data) => {
    	console.log("CONTACT DATA:", data)
    	console.log("SETTING SLUG:", data.chat_slug)
      setContact(data)
      setSlug(data.chat_slug)
    })
  }, [id])

  //  RESET READ FLAG ON CHAT CHANGE
  useEffect(() => {
    hasSentRead.current = false
  }, [slug])

  //  FETCH MESSAGES + SEND INITIAL READ ONCE
  useEffect(() => {
  if (!slug) return

  setPage(1)
  setHasMore(true)

  fetchMessages(slug, 1).then((data) => {


  	console.log("API DATA:", data)

    // Reverse because backend returns newest first
    setMessages(data.results || [])
    setHasMore(!!data.next)

    if (!hasSentRead.current) {
      sendMessage({
        type: "read",
        chat_slug: slug
      })
      hasSentRead.current = true
    }
  })

}, [slug])

  return (
    <Layout>
      <Chat
        contact={contact}
        messages={messages}
        isTyping={isTyping}
        onLoadOlder={loadOlderMessages}
        handleSendMessage={(payload) => {

          if (!slug) return

          if (typeof payload === "string") {
            sendMessage({
              type: "message",
              chat_slug: slug,
              content: payload
            })
          } else {
            sendMessage({
              ...payload,
              chat_slug: slug
            })
          }
        }}
      />
    </Layout>
  )
}

export default ChatDetail