import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(BACKEND_URL, { autoConnect: false });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('receive_message', (msg) =>
      setMessages((prev) => [...prev, msg])
    );

    return () => socket.disconnect();
  }, []);

  const join = useCallback((username) => {
    setUser(username);
    socketRef.current.connect();
    fetch(`${BACKEND_URL}/messages`)
      .then((r) => r.json())
      .then(setMessages)
      .catch(console.error);
  }, []);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || !socketRef.current) return;
      socketRef.current.emit('send_message', { username: user, text });
    },
    [user]
  );

  if (!user) return <Login onJoin={join} />;

  return (
    <Chat
      user={user}
      messages={messages}
      onSend={sendMessage}
      connected={connected}
    />
  );
}
