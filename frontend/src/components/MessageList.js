import React, { useEffect, useRef } from 'react';
import { Hash } from 'lucide-react';
import Message from './Message';
import { formatDate } from '../utils';

function DateDivider({ label }) {
  return (
    <div className="date-divider">
      <span className="date-divider-line" />
      <span className="date-divider-label">{label}</span>
      <span className="date-divider-line" />
    </div>
  );
}

export default function MessageList({ messages, currentUser }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group consecutive messages + inject date dividers
  const processed = [];
  messages.forEach((msg, i) => {
    const prev = messages[i - 1];

    // Date divider
    if (!prev || formatDate(msg.created_at) !== formatDate(prev?.created_at)) {
      processed.push({ type: 'divider', label: formatDate(msg.created_at), id: `div-${i}` });
    }

    const isGrouped =
      prev &&
      prev.username === msg.username &&
      new Date(msg.created_at) - new Date(prev.created_at) < 5 * 60 * 1000;

    processed.push({ type: 'message', ...msg, isGrouped });
  });

  return (
    <div className="messages-container">
      {messages.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <Hash size={32} />
          </div>
          <h3>Welcome to #general</h3>
          <p>This is the beginning of the conversation.</p>
        </div>
      )}

      {processed.map((item) =>
        item.type === 'divider' ? (
          <DateDivider key={item.id} label={item.label} />
        ) : (
          <Message
            key={item.id}
            msg={item}
            isOwn={item.username === currentUser}
          />
        )
      )}
      <div ref={bottomRef} />
    </div>
  );
}
