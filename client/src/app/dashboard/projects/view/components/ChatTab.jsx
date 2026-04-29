'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Smile } from 'lucide-react';

export default function ChatTab({ messages, onSendMessage, user, chatEndRef, typingUser, socketRef, projectId }) {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const typingTimerRef = useRef(null);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const content = newMessage.trim();
    if (!content || isSending) return;

    setIsSending(true);
    setNewMessage('');
    stopTyping();
    await onSendMessage(content);
    setIsSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const emitTyping = () => {
    if (!socketRef?.current || !projectId) return;
    socketRef.current.emit('typing-start', { projectId, userName: user?.name });
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, 2000);
  };

  const stopTyping = () => {
    if (!socketRef?.current || !projectId) return;
    socketRef.current.emit('typing-stop', { projectId, userName: user?.name });
    clearTimeout(typingTimerRef.current);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupedMessages = messages.reduce((groups, msg, index) => {
    const prevMsg = messages[index - 1];
    const isSameSender = prevMsg && prevMsg.sender?._id === msg.sender?._id;
    const timeDiff = prevMsg ? (new Date(msg.createdAt) - new Date(prevMsg.createdAt)) / 1000 / 60 : Infinity;
    const isGrouped = isSameSender && timeDiff < 3;
    groups.push({ ...msg, isGrouped });
    return groups;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fafbff' }}>
      
      {/* Chat Header */}
      <div style={{
        padding: '1.25rem 1.75rem',
        borderBottom: '1px solid #f0f2f8',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexShrink: 0
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <MessageSquare size={16} color="#fff" />
        </div>
        <div>
          <p style={{ fontWeight: 900, fontSize: '0.875rem', color: '#0f172a', letterSpacing: '-0.01em' }}>Project Chat</p>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{messages.length} messages</p>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4, gap: '1rem' }}>
            <MessageSquare size={52} color="#94a3b8" />
            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : groupedMessages.map((msg, i) => {
          const isOwn = msg.sender?._id === user?._id;
          return (
            <div
              key={msg._id || i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwn ? 'flex-end' : 'flex-start',
                marginTop: msg.isGrouped ? '0.2rem' : '1rem',
              }}
            >
              {/* Sender + timestamp row */}
              {!msg.isGrouped && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.35rem',
                  flexDirection: isOwn ? 'row-reverse' : 'row'
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: isOwn ? 'linear-gradient(135deg, #4f46e5, #6366f1)' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', fontWeight: 900, color: isOwn ? '#fff' : '#475569',
                    flexShrink: 0
                  }}>
                    {getInitials(msg.sender?.name)}
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>
                    {isOwn ? 'You' : msg.sender?.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 600 }}>
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: '72%',
                padding: '0.75rem 1rem',
                borderRadius: msg.isGrouped
                  ? (isOwn ? '14px 4px 4px 14px' : '4px 14px 14px 4px')
                  : (isOwn ? '14px 4px 14px 14px' : '4px 14px 14px 14px'),
                background: isOwn
                  ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
                  : '#ffffff',
                color: isOwn ? '#fff' : '#1e293b',
                border: isOwn ? 'none' : '1px solid #f0f2f8',
                boxShadow: isOwn
                  ? '0 4px 12px rgba(79, 70, 229, 0.25)'
                  : '0 2px 8px rgba(0,0,0,0.05)',
                fontSize: '0.875rem',
                fontWeight: 500,
                lineHeight: 1.55,
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '3px', padding: '0.6rem 0.875rem', background: '#fff', border: '1px solid #f0f2f8', borderRadius: '0 12px 12px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {[0, 1, 2].map(dot => (
                <span key={dot} style={{
                  width: '5px', height: '5px', borderRadius: '50%', background: '#94a3b8',
                  animation: `bounce 1.2s ease-in-out ${dot * 0.2}s infinite`
                }} />
              ))}
            </div>
            <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>{typingUser} is typing...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        flexShrink: 0,
        padding: '1rem 1.25rem',
        background: '#fff',
        borderTop: '1px solid #f0f2f8',
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
          <textarea
            rows={1}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              emitTyping();
              // Auto-resize
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            onBlur={stopTyping}
            style={{
              flex: 1,
              padding: '0.875rem 1.125rem',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#0f172a',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              background: '#f8fafc',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              minHeight: '48px',
              maxHeight: '120px',
              overflow: 'hidden',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#4f46e5';
              e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.12)';
              e.target.style.background = '#fff';
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: newMessage.trim() && !isSending
                ? 'linear-gradient(135deg, #4f46e5, #6366f1)'
                : '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: newMessage.trim() && !isSending ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              flexShrink: 0,
              boxShadow: newMessage.trim() ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
            }}
          >
            <Send size={18} color={newMessage.trim() && !isSending ? '#fff' : '#cbd5e1'} />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
