import React from 'react';
import { Hash, Bell, Pin, Users, Search, Wifi, WifiOff } from 'lucide-react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function Chat({ user, messages, onSend, connected }) {
  return (
    <div className="app-layout">
      <Sidebar user={user} />

      <div className="main-panel">
        {/* Channel header */}
        <div className="channel-header">
          <div className="channel-header-left">
            <Hash size={20} className="channel-header-icon" />
            <span className="channel-header-name">general</span>
            <span className="channel-header-divider" />
            <span className="channel-header-topic">Welcome to Crow Chat</span>
          </div>
          <div className="channel-header-right">
            <div className={`conn-pill ${connected ? 'conn-pill--on' : 'conn-pill--off'}`}>
              {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
              <span>{connected ? 'Live' : 'Reconnecting'}</span>
            </div>
            <button className="header-btn" title="Bell"><Bell size={20} /></button>
            <button className="header-btn" title="Pinned"><Pin size={20} /></button>
            <button className="header-btn" title="Members"><Users size={20} /></button>
            <div className="header-search">
              <Search size={14} />
              <input placeholder="Search" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <MessageList messages={messages} currentUser={user} />

        {/* Input */}
        <ChatInput onSend={onSend} />
      </div>
    </div>
  );
}
