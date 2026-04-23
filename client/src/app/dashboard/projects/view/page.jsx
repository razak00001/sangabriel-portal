'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';
import { useSearchParams } from 'next/navigation';
import { FolderKanban, ChevronRight, LayoutDashboard, MessageSquare, Files, Activity } from 'lucide-react';
import io from 'socket.io-client';
import { getStatusColor } from '../../../../utils/projectUtils';

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
    socketRef.current = io(process.env.NEXT_PUBLIC_SERVICE_URL || 'https://sangabriel-portal.onrender.com');
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
      fetchProject(); 
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 animate-pulse">
      <div className="size-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4" />
      <p className="text-muted font-black uppercase text-xs tracking-widest">Loading Workspace...</p>
    </div>
  );

  if (!project) return (
    <div className="flex flex-col items-center justify-center p-20">
      <h2 className="text-muted font-black">Project not found</h2>
    </div>
  );

  const TABS = [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'Chat', icon: MessageSquare },
    { id: 'Files', icon: Files },
    { id: 'Activity', icon: Activity },
  ];

  return (
    <div className="fade-in max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <nav className="flex items-center gap-2 mb-3 text-[10px] font-black text-muted uppercase tracking-widest">
            <FolderKanban size={10} />
            <span>Projects</span>
            <ChevronRight size={8} />
            <span className="text-primary">{project.title}</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tight leading-none">{project.title}</h1>
        </div>
        
        <div className="flex items-center">
          {['Admin', 'Project Manager'].includes(user?.role) ? (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white/50 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-black text-muted uppercase tracking-widest">Status:</span>
              <select 
                className="bg-transparent border-none text-xs font-black text-primary uppercase focus:ring-0 cursor-pointer"
                value={project.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
              >
                {['DRAFT', 'ACTIVE', 'IN PROGRESS', 'PENDING REVIEW', 'REVISION REQUESTED', 'COMPLETE', 'BILLED', 'ARCHIVED'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ) : (
            <div 
              className="px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm"
              style={{ 
                backgroundColor: `${getStatusColor(project.status)}10`,
                color: getStatusColor(project.status),
                borderColor: `${getStatusColor(project.status)}30`
              }}
            >
              {project.status}
            </div>
          )}
        </div>
      </header>

      {/* Modern Tabs Navigation */}
      <div className="flex overflow-x-auto gap-1 mb-10 border-b border-border pb-px no-scrollbar">
        {TABS.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2.5 px-8 py-4 text-xs font-black uppercase tracking-wider relative transition-all duration-300
              ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-main'}
            `}
          >
            <tab.icon size={16} />
            {tab.id}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(79,70,229,0.4)]" />
            )}
          </button>
        ))}
      </div>

      <div className="workspace-content pb-20">
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
    </div>
  );
}

export default function ProjectWorkspace() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-20 animate-pulse">
        <p className="text-muted font-black uppercase text-xs tracking-widest">Initializing Workspace...</p>
      </div>
    }>
      <WorkspaceInner />
    </Suspense>
  );
}
