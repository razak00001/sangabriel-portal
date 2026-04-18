'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';
import { useSearchParams } from 'next/navigation';
import { 
  FolderKanban, 
  MessageSquare, 
  Files, 
  Settings, 
  Send, 
  Paperclip,
  Clock,
  User,
  Tag,
  X,
  CheckCircle2,
  Circle,
  Calendar,
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import io from 'socket.io-client';

function WorkspaceInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const chatEndRef = useRef();

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return '#64748b';
      case 'ACTIVE': return '#4338ca';
      case 'IN PROGRESS': return '#2563eb';
      case 'PENDING REVIEW': return '#db2777';
      case 'REVISION REQUESTED': return '#d97706';
      case 'COMPLETE': return '#059669';
      case 'BILLED': return '#059669';
      case 'ARCHIVED': return '#475569';
      default: return '#64748b';
    }
  };

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
      setProject(data.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const { data } = await api.patch(`/projects/${id}/status`, { status: newStatus });
      setProject(data.data);
      // Refresh activity log
      fetchProjectDetails();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const setupSocket = () => {
    socketRef.current = io('https://sangabriel-portal.onrender.com');
    socketRef.current.emit('joinProject', id);
    socketRef.current.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });
  };

  const fetchMessages = async () => {
    const { data } = await api.get(`/messages/project/${id}`);
    setMessages(data.data || []);
    scrollToBottom();
  };

  const fetchFiles = async () => {
    const { data } = await api.get(`/files/project/${id}`);
    setFiles(data.data || []);
  };

  const handleToggleMilestone = async (milestoneId) => {
    if (user.role === 'Customer') return;
    try {
      const { data } = await api.patch(`/projects/${id}/toggle-milestone`, { milestoneId });
      setProject(data.data);
    } catch (error) {
      console.error('Error toggling milestone:', error);
      alert('Failed to update milestone');
    }
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
                <option value="DRAFT">DRAFT</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="PENDING REVIEW">PENDING REVIEW</option>
                <option value="REVISION REQUESTED">REVISION REQUESTED</option>
                <option value="COMPLETE">COMPLETE</option>
                <option value="BILLED">BILLED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            ) : (
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: '700', 
                padding: '0.4rem 0.8rem', 
                borderRadius: '100px', 
                background: `${getStatusColor(project.status)}15`,
                color: getStatusColor(project.status),
                border: `1px solid ${getStatusColor(project.status)}30`
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
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Project Description & Timeline Card */}
              <div className="glass" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Info size={20} color="var(--primary)" /> Project Details
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: '1.8', maxWidth: '600px' }}>
                      {project.description || 'No detailed description available for this project.'}
                    </p>
                  </div>
                  {project.timeline?.startDate && (
                    <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center', minWidth: '140px' }}>
                      <p style={{ fontSize: '0.625rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Target Timeline</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: '700', fontSize: '0.8125rem' }}>
                         <Calendar size={14} />
                         {new Date(project.timeline.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>

                {project.specialInstructions && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.1)', borderRadius: '12px', padding: '1.25rem', marginTop: '1.5rem' }}>
                     <h3 style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.5rem' }}>Special Instructions</h3>
                     <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontStyle: 'italic' }}>"{project.specialInstructions}"</p>
                  </div>
                )}
              </div>

              {/* Dynamic Milestones Card */}
              <div className="glass" style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={20} color="var(--primary)" /> Progress Milestones
                </h2>
                
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)', zIndex: 0 }}></div>
                  
                  {project.milestones && project.milestones.length > 0 ? project.milestones.map((m) => (
                    <div 
                      key={m._id} 
                      onClick={() => handleToggleMilestone(m._id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.5rem', 
                        position: 'relative', 
                        zIndex: 1,
                        cursor: user.role !== 'Customer' ? 'pointer' : 'default',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => user.role !== 'Customer' && (e.currentTarget.style.transform = 'translateX(4px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
                    >
                      <div style={{ 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        background: m.completed ? 'var(--primary)' : 'white', 
                        border: m.completed ? '2px solid var(--primary)' : '2px solid var(--border)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        boxShadow: m.completed ? '0 0 15px rgba(67, 56, 202, 0.3)' : 'none'
                      }}>
                        {m.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          fontSize: '0.9375rem', 
                          fontWeight: m.completed ? '600' : '500',
                          color: m.completed ? 'var(--text-main)' : 'var(--text-muted)'
                        }}>{m.label}</p>
                        {m.completed && m.date && (
                          <p style={{ fontSize: '0.6875rem', color: 'var(--primary)', fontWeight: '600' }}>
                            Completed on {new Date(m.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {user.role !== 'Customer' && <ChevronRight size={14} color="var(--border)" />}
                    </div>
                  )) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem', fontStyle: 'italic' }}>No milestones defined for this project.</p>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Premium Team Card */}
              <div className="glass" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Project Leadership</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {[
                    { role: 'Project Manager', user: project.projectManager, color: '#4338ca' },
                    { role: 'Designer', user: project.designer, color: '#db2777' },
                    { role: 'Installer', user: project.installer, color: '#10b981' }
                  ].map((member) => (
                    <div key={member.role} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '12px', 
                        background: `${member.color}10`, 
                        color: member.color,
                        border: `1px solid ${member.color}20`,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.875rem',
                        fontWeight: '800'
                      }}>
                        {member.user?.name?.charAt(0) || '?'}
                      </div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{member.user?.name || 'Awaiting Assignment'}</p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)', color: 'white' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   Need Assistance?
                </h3>
                <p style={{ fontSize: '0.8125rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '1.5rem' }}>
                   Our team is dedicated to your project's success. Use the chat tab for real-time updates.
                </p>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '1.5rem' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }}>
                      <User size={16} />
                   </div>
                   <div style={{ fontSize: '0.75rem' }}>
                      <p style={{ fontWeight: '500' }}>Direct Support Line</p>
                      <p style={{ fontWeight: '800' }}>support@sangabriel.com</p>
                   </div>
                </div>
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
                        <a href={`https://sangabriel-portal.onrender.com${file.url}`} download target="_blank" style={{ color: 'var(--text-muted)', marginRight: '1rem' }}>
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

export default function ProjectWorkspace() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '10rem' }}>Loading Workspace...</div>}>
      <WorkspaceInner />
    </Suspense>
  );
}
