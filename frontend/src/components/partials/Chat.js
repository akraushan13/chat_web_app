import './Chat.css'
import { Avatar, IconButton } from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import SendIcon from '@mui/icons-material/Send';
import ChatOffCanvas from './ChatOffCanvas';
import { useState, useRef, useEffect } from 'react';

const Chat = ({contact, messages, handleSendMessage, isTyping, onLoadOlder}) => {

  const userId = localStorage.getItem('user')
  const [message, setMessage] = useState('')
  const endOfMessageRef = useRef(null)
  const containerRef = useRef(null)
  const shouldAutoScroll = useRef(true)

  // ===============================
  // AUTO SCROLL ONLY IF AT BOTTOM
  // ===============================
  useEffect(() => {
    if (shouldAutoScroll.current) {
      endOfMessageRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // ===============================
  // SCROLL LISTENER
  // ===============================
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {

      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 50

      shouldAutoScroll.current = isAtBottom

      // Load older when near top
      if (container.scrollTop < 50) {
        onLoadOlder && onLoadOlder()
      }
    }

    container.addEventListener("scroll", handleScroll)

    return () => {
      container.removeEventListener("scroll", handleScroll)
    }

  }, [onLoadOlder])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    handleSendMessage(message)
    setMessage('')
  }

  const [offCanvasIsOpen, setOffCanvasIsOpen] = useState('')
  const OpenOffCanvas = (status) => {
    setOffCanvasIsOpen(status)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDateLabel = (timestamp) => {
    const messageDate = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) return "Today"
    if (messageDate.toDateString() === yesterday.toDateString()) return "Yesterday"

    return messageDate.toLocaleDateString()
  }

  return (
    <div className="chat__container">
      <ChatOffCanvas
        isOpen={offCanvasIsOpen}
        handleOffCanvas={OpenOffCanvas}
        data={contact}
      />

      <div className="chat__header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => OpenOffCanvas('chatoffcanvas__active')}>
            <Avatar src={contact && contact.contact.image} />
          </IconButton>
          <div>
            <h5>
              {contact && contact.name}
              {contact && contact.contact.verified ? (
                <VerifiedIcon style={{width:15,height:15,color:'green'}} />
              ) : ''}
            </h5>
            <p>{isTyping ? "Typing..." : "Online"}</p>
          </div>
        </div>

        <div>
          <IconButton><VideocamOutlinedIcon /></IconButton>
          <IconButton><CallIcon /></IconButton>
          <span style={{ margin: "0 15px" }}> | </span>
          <IconButton><SearchOutlinedIcon /></IconButton>
          <IconButton><MoreHorizOutlinedIcon /></IconButton>
        </div>
      </div>

      {/* ================= MAIN CHAT AREA ================= */}
      <div className='chat__main' ref={containerRef}>

        {messages &&
  [...messages]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((text, index, sortedMessages) => {

      const currentDate = new Date(text.timestamp).toDateString()

      const previousDate =
        index > 0
          ? new Date(sortedMessages[index - 1].timestamp).toDateString()
          : null

      const showDate = currentDate !== previousDate

      return (
        <div key={text.id || index}>
          {showDate && (
            <div className="chat__dateWrapper">
              <span className="chat__datePill">
                {formatDateLabel(text.timestamp)}
              </span>
            </div>
          )}

          <div
            className={`chat__message ${
              Number(text.sender_id) === Number(userId)
                ? "message__right"
                : ""
            }`}
          >
            <span>{text.content}</span>

            <div className="chat__meta">
              <span className="chat__time">
                {formatTime(text.timestamp)}
              </span>

              {Number(text.sender_id) === Number(userId) && (
                <span className="chat__status">
                  {text.is_read ? "✓✓" : text.is_delivered ? "✓" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    })}

        <div ref={endOfMessageRef} style={{ height: 20 }}></div>
      </div>

      <div className="chat__bottom">
        <div style={{display:"flex",justifyContent:"space-between",flex:0.1}}>
          <IconButton><InsertEmoticonIcon /></IconButton>
          <IconButton>
            <AttachFileIcon style={{transform:'rotate(-40deg)'}}/>
          </IconButton>
        </div>

        <form className="chat__form" onSubmit={sendMessage}>
          <input
            placeholder="Message Here"
            className="chat__input"
            value={message}
            onChange={e => {
              setMessage(e.target.value)
              handleSendMessage({ type: "typing" })
            }}
          />
        </form>

        <div>
          {message ? (
            <IconButton onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          ) : (
            <IconButton>
              <KeyboardVoiceOutlinedIcon />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat