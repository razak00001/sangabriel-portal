'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import Card from '../../../../../components/ui/Card';

export default function ChatTab({ messages, onSendMessage, user, chatEndRef }) {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <Card className="p-0 h-[640px] flex flex-col overflow-hidden bg-white/40">
      {/* Messages View */}
      <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6 no-scrollbar">
        {messages.length > 0 ? messages.map((msg, i) => {
          const isOwn = msg.sender?._id === user?._id;
          return (
            <div 
              key={i} 
              className={`flex flex-col gap-1.5 max-w-[80%] ${isOwn ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div 
                className={`
                  p-4 rounded-2xl text-[13px] font-medium leading-relaxed
                  ${isOwn ? 'bg-primary text-white shadow-lg shadow-indigo-500/20' : 'bg-white border border-border text-main'}
                `}
              >
                {msg.content}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-muted px-2">
                {msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center m-auto text-center opacity-40">
            <MessageSquare size={64} className="text-muted mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-muted">No messages yet. Start a conversation!</p>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
      
      {/* Input Group */}
      <footer className="p-6 bg-dark/20 border-t border-border flex gap-4 items-center">
        <input 
          type="text" 
          className="input-field rounded-xl" 
          placeholder="Type your message..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <button 
          onClick={handleSubmit}
          className="btn btn-primary size-12 rounded-xl flex items-center justify-center p-0 shadow-lg shadow-indigo-500/30"
          disabled={!newMessage.trim()}
        >
          <Send size={18} />
        </button>
      </footer>
    </Card>
  );
}
