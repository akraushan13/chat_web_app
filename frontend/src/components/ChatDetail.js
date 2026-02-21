import Layout from './partials/Layout'
import Chat from './partials/Chat'
import { useParams, Navigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { getToken  } from '../utils'

const ChatDetail = ({ isLoggedIn }) => {
  const { id } = useParams()
  const [contact, setContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [slug, setSlug] = useState(null)

  const socketRef = useRef(null)

  // Fetch contact
  useEffect(() => {
    if (!isLoggedIn) return

    fetch(`http://127.0.0.1:8000/api/contacts/${id}/`, {
      headers: {
        Authorization: `Token ${getToken()}`,
      },
    })
      .then(res => res.json())
      .then(data => {
      console.log("OLD MESSAGES:", data)
        setContact(data)
        setSlug(data.chat_slug)
      })
  }, [id, isLoggedIn])

  // LOAD OLD MESSAGES FROM DB
useEffect(() => {
  if (!slug) return;

  fetch(`http://127.0.0.1:8000/api/messages/${slug}/`, {
    headers: {
      Authorization: `Token ${getToken()}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      setMessages(data);
    })
    .catch(err => console.log(err));

}, [slug]);


  // Create WebSocket ONCE
useEffect(() => {
  if (!slug) return;

  const token = localStorage.getItem("token");
  const chatUrl = `ws://127.0.0.1:8000/ws/${slug}/?token=${token}`;

  console.log("Opening socket for:", slug);

  const socket = new WebSocket(chatUrl);
  socketRef.current = socket;

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("SOCKET MESSAGE:", data);

    setMessages(prev => [...prev, data]);
  };

  socket.onerror = (error) => {
    console.log("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };

  //  IMPORTANT CLEANUP
  return () => {
    console.log("Closing old socket");
    socket.close();
  };

}, [slug]);



const handleSendMessage = (text) => {
  if (socketRef.current?.readyState === WebSocket.OPEN) {
    socketRef.current.send(
      JSON.stringify({ content: text })
    );
  }
};


  if (!isLoggedIn) return <Navigate replace to="/" />

  return (
    <Layout>
      <Chat
        contact={contact}
        messages={messages}
        handleSendMessage={handleSendMessage}
      />
    </Layout>
  )
}

export default ChatDetail
