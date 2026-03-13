'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';
import { useParams } from 'next/navigation';
import { 
  FolderKanban, 
  MessageSquare, 
  Files, 
  Settings, 
  Send, 
  Paperclip,
  Clock,
  User as UserIcon,
  Download,
  Trash2,
  AlertCircle
} from 'lucide-react';
import io from 'socket.io-client';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const chatEndRef = useRef();

  useEffect(() => {
    fetchProjectDetails();
    setupSocket();
    return () => socketRef.current?.disconnect();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'Chat') {
      fetchMessages();
      scrollToBottom();
    } else if (activeTab === 'Files') {
      fetchFiles();
    }
  }, [activeTab]);

  const fetchProjectDetails = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { data } = await api.patch(`/projects/${id}/status`, { status: newStatus });
      setProject(data);
      // Refresh activity log
      fetchProjectDetails();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const setupSocket = () => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('joinProject', id);
    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });
  };

  const fetchMessages = async () => {
    const { data } = await api.get(`/messages/project/${id}`);
    setMessages(data);
    scrollToBottom();
  };

  const fetchFiles = async () => {
    const { data } = await api.get(`/files/project/${id}`);
    setFiles(data);
  };

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      projectId: id,
      senderId: user._id,
      content: newMessage,
      isInternal: user.role !== 'Customer'
    };

    socketRef.current.emit('sendMessage', messageData);
    setNewMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', id);
    formData.append('tag', 'Document');

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchFiles();
    } catch (error) {
      alert('Upload failed');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}>Loading Workspace...</div>;
  if (!project) return <div style={{ textAlign: 'center', padding: '10rem' }}>Project not found</div>;

  return (
    <div className="fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <FolderKanban size={16} />
          <span>Projects</span>
          <span>/</span>
          <span>{project.title}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 0 }}>{project.title}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {['Admin', 'Project Coordinator'].includes(user.role) ? (
              <select 
                className="input-field" 
                style={{ width: '180px', padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                value={project.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
              >
                <option value="Created">Created</option>
                <option value="Design Phase">Design Phase</option>
                <option value="Client Review">Client Review</option>
                <option value="Approved">Approved</option>
                <option value="Installation Phase">Installation Phase</option>
                <option value="Completed">Completed</option>
              </select>
            ) : (
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: '700', 
                padding: '0.4rem 0.8rem', 
                borderRadius: '100px', 
                background: 'var(--glass-border)',
                border: '1px solid var(--border)'
              }}>
                {project.status}
              </span>
            )}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        {['Overview', 'Chat', 'Files', 'Activity'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '1rem 0', 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s'
            }}
          >
            {tab}
            {activeTab === tab && (
              <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '2px', background: 'var(--primary)' }}></div>
            )}
          </button>
        ))}
      </div>

      <div className="workspace-content">
        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div className="glass" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Description</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
                {project.description || 'No description provided for this project.'}
              </p>
              
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Key Milestones</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Design Approved', 'Contract Signed', 'Materials Ordered', 'Installation Scheduled'].map((m, i) => (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: i > 1 ? 0.4 : 1 }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {i <= 1 && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                    </div>
                    <span style={{ fontSize: '0.875rem' }}>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Team Members</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { role: 'Coordinator', user: project.coordinator },
                    { role: 'Designer', user: project.designer },
                    { role: 'Installer', user: project.installer }
                  ].map((member) => (
                    <div key={member.role} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                        {member.user?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: '600' }}>{member.user?.name || 'Unassigned'}</p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} /> Need help?
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Contact your project coordinator for any immediate assistance or changes.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Chat' && (
          <div className="glass" style={{ height: '600px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.filter(msg => !msg.isInternal || user.role !== 'Customer').length > 0 ? 
               messages.filter(msg => !msg.isInternal || user.role !== 'Customer').map((msg, i) => (
                <div key={i} style={{ 
                  alignSelf: msg.sender?._id === user._id ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{ 
                    padding: '0.75rem 1.25rem', 
                    borderRadius: 'var(--radius)', 
                    background: msg.sender?._id === user._id ? 'var(--primary)' : 'var(--bg-darker)',
                    color: msg.sender?._id === user._id ? 'white' : 'var(--text-main)',
                    fontSize: '0.875rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: msg.sender?._id === user._id ? 'none' : '1px solid var(--border)'
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', alignSelf: msg.sender?._id === user._id ? 'flex-end' : 'flex-start' }}>
                    {msg.sender?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )) : (
                <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
                  <MessageSquare size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>Start a conversation...</p>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>
            
            <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', background: 'var(--bg-darker)', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem' }}>
                <Send size={18} />
              </button>
            </form>
          </div>
        )}

        {activeTab === 'Files' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Project Files</h2>
              <label className="btn btn-primary" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                <Plus size={18} />
                <span>Upload File</span>
                <input type="file" hidden onChange={handleFileUpload} />
              </label>
            </div>

            <div className="glass" style={{ padding: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Name</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Tag</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Size</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Uploaded By</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {files.length > 0 ? files.map((file) => (
                    <tr key={file._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Files size={16} style={{ color: 'var(--primary)' }} />
                          {file.originalName}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '0.625rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--glass-border)' }}>{file.tag}</span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</td>
                      <td style={{ padding: '1rem' }}>{file.uploadedBy?.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{new Date(file.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <a href={`http://localhost:5000${file.url}`} download target="_blank" style={{ color: 'var(--text-muted)', marginRight: '1rem' }}>
                          <Download size={16} />
                        </a>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        No files uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'Activity' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Activity Timeline</h2>
            <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '2.45rem', top: '2rem', bottom: '2rem', width: '2px', background: 'var(--border)' }}></div>
              
              {project.activityLogs && project.activityLogs.length > 0 ? project.activityLogs.slice().reverse().map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    borderRadius: '50%', 
                    background: 'var(--bg-dark)', 
                    border: '3px solid var(--primary)',
                    marginTop: '4px'
                  }}></div>
                  <div>
                    <p style={{ fontSize: '0.9375rem', fontWeight: '600', marginBottom: '0.25rem' }}>{log.action}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      {log.user?.name || 'System'} • {new Date(log.createdAt).toLocaleString()}
                    </p>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-darker)', borderRadius: 'var(--radius)', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                        {Object.entries(log.details).map(([key, val]) => (
                          <div key={key}><strong>{key}:</strong> {val}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                  <Clock size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                  <p>No activity recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
