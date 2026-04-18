import React from 'react';
import { Hash, Volume2, Settings, Flame, ChevronDown } from 'lucide-react';
import { getAvatarColor, getInitials } from '../utils';

const TEXT_CHANNELS = ['general', 'lobby', 'off-topic'];
const VOICE_CHANNELS = ['lounge', 'gaming'];

export default function Sidebar({ user }) {
  return (
    <div className="sidebar">
      {/* Server header */}
      <div className="sidebar-header">
        <Flame size={18} className="sidebar-flame" />
        <span className="sidebar-brand">CROW</span>
        <ChevronDown size={16} className="sidebar-chevron" />
      </div>

      {/* Text channels */}
      <div className="sidebar-section">
        <p className="section-label">Text Channels</p>
        {TEXT_CHANNELS.map((ch) => (
          <div
            key={ch}
            className={`channel-item ${ch === 'general' ? 'active' : ''}`}
          >
            <Hash size={16} className="channel-icon" />
            <span>{ch}</span>
            {ch === 'general' && <span className="channel-badge">1</span>}
          </div>
        ))}
      </div>

      {/* Voice channels */}
      <div className="sidebar-section">
        <p className="section-label">Voice Channels</p>
        {VOICE_CHANNELS.map((ch) => (
          <div key={ch} className="channel-item muted">
            <Volume2 size={16} className="channel-icon" />
            <span>{ch}</span>
          </div>
        ))}
      </div>

      {/* User panel */}
      <div className="sidebar-footer">
        <div className="user-panel">
          <div
            className="avatar avatar--sm"
            style={{ background: getAvatarColor(user) }}
          >
            {getInitials(user)}
            <span className="status-dot" />
          </div>
          <div className="user-meta">
            <span className="user-name">{user}</span>
            <span className="user-status">Online</span>
          </div>
        </div>
        <button className="icon-btn" title="Settings">
          <Settings size={17} />
        </button>
      </div>
    </div>
  );
}
