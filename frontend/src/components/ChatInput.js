import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Gift, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    setShowPicker(false);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') setShowPicker(false);
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  return (
    <div className="input-wrapper">
      {/* Emoji picker portal */}
      {showPicker && (
        <div className="emoji-picker-wrap" ref={pickerRef}>
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme="dark"
            skinTonesDisabled
            searchPlaceholder="Search emoji..."
            height={380}
            width={320}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <div className="input-box">
        <button className="input-side-btn" title="Attach file">
          <Paperclip size={20} />
        </button>

        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Message #general"
          maxLength={500}
          autoComplete="off"
        />

        <div className="input-right-actions">
          <button className="input-side-btn" title="Gift">
            <Gift size={20} />
          </button>

          <button
            className={`input-side-btn emoji-toggle ${showPicker ? 'emoji-toggle--active' : ''}`}
            title="Emoji"
            onClick={() => setShowPicker((v) => !v)}
          >
            {showPicker ? <X size={20} /> : <Smile size={20} />}
          </button>

          <button
            className={`send-btn ${text.trim() ? 'send-btn--active' : ''}`}
            onClick={handleSend}
            disabled={!text.trim()}
            title="Send"
          >
            <Send size={17} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {text.length > 400 && (
        <p className="char-count">{500 - text.length} remaining</p>
      )}
    </div>
  );
}
