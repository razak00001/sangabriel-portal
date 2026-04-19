'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';
import { useSearchParams } from 'next/navigation';
import { FolderKanban, ChevronRight } from 'lucide-react';
import io from 'socket.io-client';

// Modular Tab Components
import OverviewTab from './components/OverviewTab';
import ChatTab from './components/ChatTab';
import FilesTab from './components/FilesTab';
import ActivityTab from './components/ActivityTab';

function WorkspaceInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef();
  const chatEndRef = useRef();

  useEffect(() => {
    if (id) {
      fetchProject();
      fetchMessages();
      fetchFiles();
      setupSocket();
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (activeTab === 'Chat') {
      scrollToBottom();
    }
  }, [activeTab, messages]);

  const setupSocket = () => {
    socketRef.current = io('https://sangabriel-portal.onrender.com');
    socketRef.current.emit('join-project', id);
    socketRef.current.on('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });
  };

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/projects/${id}/messages`);
      setMessages(data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data } = await api.get(`/projects/${id}/files`);
      setFiles(data.data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (content) => {
    try {
      await api.post(`/projects/${id}/messages`, { content });
    } catch (error) {
      console.error('Error sending message:', error);
    }
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
      fetchProject(); // Refresh activity log
    } catch (error) {
       console.error('Upload failed:', error);
       alert('Upload failed. Please try again.');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/projects/${id}/status`, { status: newStatus });
      fetchProject();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT': return '#64748b';
      case 'ACTIVE': return '#4338ca';
      case 'IN PROGRESS': return '#2563eb';
      case 'PENDING REVIEW': return '#db2777';
      case 'REVISION REQUESTED': return '#d97706';
      case 'COMPLETE': return '#059669';
      default: return '#64748b';
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '10rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div className="spinner"></div>
      <p style={{ fontWeight: '700', color: 'var(--text-muted)' }}>Loading Workspace...</p>
    </div>
  );

  if (!project) return (
    <div style={{ textAlign: 'center', padding: '10rem' }}>
      <h2 style={{ color: 'var(--text-muted)' }}>Project not found</h2>
    </div>
  );

  return (
    <div className="fade-in">
      <header className="mobile-header-stack" style={{ marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <FolderKanban size={14} />
            <span>Projects</span>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--text-main)' }}>{project.title}</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: 0, letterSpacing: '-0.02em' }}>{project.title}</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {['Admin', 'Project Coordinator'].includes(user?.role) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-dark)', borderRadius: '14px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: '800', color: 'var(--text-muted)' }}>STATUS:</span>
              <select 
                className="input-field" 
                style={{ width: '180px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem', fontWeight: '800', border: 'none', background: 'transparent' }}
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
            </div>
          ) : (
            <span style={{ 
              fontSize: '0.6875rem', 
              fontWeight: '900', 
              padding: '0.5rem 1rem', 
              borderRadius: '100px', 
              background: `${getStatusColor(project.status)}20`,
              color: getStatusColor(project.status),
              border: `1px solid ${getStatusColor(project.status)}30`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {project.status}
            </span>
          )}
        </div>
      </header>

      <div className="tab-scroll" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        {['Overview', 'Chat', 'Files', 'Activity'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '1rem 2rem', 
              background: 'transparent', 
              border: 'none', 
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.9375rem',
              fontWeight: '800',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s',
              letterSpacing: '0.02em'
            }}
          >
            {tab}
            {activeTab === tab && (
              <div style={{ position: 'absolute', bottom: -1, left: '1.5rem', right: '1.5rem', height: '3px', background: 'var(--primary)', borderRadius: '3px 3px 0 0', boxShadow: '0 -2px 10px rgba(67, 56, 202, 0.3)' }}></div>
            )}
          </button>
        ))}
      </div>

      <div className="workspace-content" style={{ paddingBottom: '4rem' }}>
        {activeTab === 'Overview' && <OverviewTab project={project} />}
        {activeTab === 'Chat' && (
          <ChatTab 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            user={user} 
            chatEndRef={chatEndRef} 
          />
        )}
        {activeTab === 'Files' && (
          <FilesTab 
            files={files} 
            onFileUpload={handleFileUpload} 
          />
        )}
        {activeTab === 'Activity' && <ActivityTab activityLogs={project.activityLogs} />}
      </div>
      
      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function ProjectWorkspace() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '10rem', color: 'var(--text-muted)', fontWeight: '700' }}>
        Initializing Workspace...
      </div>
    }>
      <WorkspaceInner />
    </Suspense>
  );
}
