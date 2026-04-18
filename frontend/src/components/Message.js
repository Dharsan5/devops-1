import React, { useState } from 'react';
import { Smile, Reply, MoreHorizontal } from 'lucide-react';
import { getAvatarColor, getInitials, formatTime } from '../utils';

export default function Message({ msg, isOwn }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`message ${msg.isGrouped ? 'message--grouped' : 'message--first'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar or spacer */}
      {!msg.isGrouped ? (
        <div
          className="avatar avatar--msg"
          style={{ background: getAvatarColor(msg.username) }}
        >
          {getInitials(msg.username)}
        </div>
      ) : (
        <div className="avatar-spacer">
          {hovered && (
            <span className="hover-time">{formatTime(msg.created_at)}</span>
          )}
        </div>
      )}

      <div className="message-body">
        {!msg.isGrouped && (
          <div className="message-meta">
            <span className={`msg-author ${isOwn ? 'msg-author--own' : ''}`}>
              {msg.username}
            </span>
            <span className="msg-timestamp">{formatTime(msg.created_at)}</span>
          </div>
        )}
        <p className="msg-text">{msg.text}</p>
      </div>

      {/* Hover actions */}
      {hovered && (
        <div className="message-actions">
          <button className="action-btn" title="React">
            <Smile size={15} />
          </button>
          <button className="action-btn" title="Reply">
            <Reply size={15} />
          </button>
          <button className="action-btn" title="More">
            <MoreHorizontal size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
