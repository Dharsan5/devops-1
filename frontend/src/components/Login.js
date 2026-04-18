import React, { useState } from 'react';
import { Flame, ArrowRight, MessageCircle } from 'lucide-react';

export default function Login({ onJoin }) {
  const [username, setUsername] = useState('');
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleJoin = () => {
    if (!username.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onJoin(username.trim());
  };

  return (
    <div className="login-bg">
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />

      <div className={`login-card ${shake ? 'shake' : ''}`}>
        <div className="login-logo">
          <Flame size={28} strokeWidth={2.5} />
        </div>
        <h1 className="login-brand">CROW</h1>
        <p className="login-tagline">Real-time. No noise.</p>

        <div className={`login-field ${focused ? 'focused' : ''}`}>
          <MessageCircle size={16} className="login-field-icon" />
          <input
            className="login-input"
            type="text"
            placeholder="Choose a username"
            value={username}
            maxLength={20}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
          />
        </div>

        <button
          className={`login-btn ${username.trim() ? 'ready' : ''}`}
          onClick={handleJoin}
        >
          <span>Enter Chat</span>
          <ArrowRight size={17} strokeWidth={2.5} />
        </button>

        <p className="login-hint">Press Enter to continue</p>
      </div>
    </div>
  );
}
