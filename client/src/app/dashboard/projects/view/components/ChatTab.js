'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip } from 'lucide-react';

export default function ChatTab({ messages, onSendMessage, user, chatEndRef }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="glass" style={{ padding: 0, height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.length > 0 ? messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: msg.sender?._id === user?._id ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.125rem'
          }}>
            <div style={{ 
              padding: '0.6rem 1rem', 
              borderRadius: '16px', 
              background: msg.sender?._id === user?._id ? 'var(--primary)' : 'var(--bg-dark)',
              color: msg.sender?._id === user?._id ? 'white' : 'var(--text-main)',
              fontSize: '0.8125rem',
              fontWeight: '500',
              border: msg.sender?._id === user?._id ? 'none' : '1px solid var(--border)'
            }}>
              {msg.content}
            </div>
            <span style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', fontWeight: '600', alignSelf: msg.sender?._id === user?._id ? 'flex-end' : 'flex-start', padding: '0 0.5rem' }}>
              {msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )) : (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
            <MessageSquare size={40} style={{ opacity: 0.1, marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.8125rem' }}>No messages yet. Start a conversation!</p>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ padding: '1.25rem', background: 'var(--bg-darker)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="Type your message..." 
          style={{ fontSize: '0.8125rem', padding: '0.75rem 1.25rem' }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
