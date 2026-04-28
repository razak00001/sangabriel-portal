'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../utils/api';
import { useSearchParams } from 'next/navigation';
import { FolderKanban, ChevronRight, LayoutDashboard, MessageSquare, Files, Activity, Settings2, Sparkles } from 'lucide-react';
import io from 'socket.io-client';
import { getStatusColor } from '../../../../utils/projectUtils';
import Select from '../../../../components/ui/Select';
import Button from '../../../../components/ui/Button';

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
      const { data } = await api.get(`/messages/project/${id}`);
      setMessages(data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchFiles = async () => {
    try {
      const { data } = await api.get(`/files/project/${id}`);
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
      await api.post(`/messages`, { projectId: id, content });
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
    <div className="flex flex-col items-center justify-center p-20 min-h-[60vh] animate-pulse">
      <div className="relative size-16 mb-6">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-indigo-600 font-black uppercase text-xs tracking-[0.2em]">Initializing Workspace...</p>
    </div>
  );

  if (!project) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
      <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <FolderKanban size={32} className="text-gray-300" />
      </div>
      <h2 className="text-gray-900 text-2xl font-black tracking-tight mb-2">Project not found</h2>
      <p className="text-gray-500 font-medium">The project you're looking for doesn't exist or you don't have access.</p>
    </div>
  );

  const TABS = [
    { id: 'Overview', icon: LayoutDashboard },
    { id: 'Chat', icon: MessageSquare },
    { id: 'Files', icon: Files },
    { id: 'Activity', icon: Activity },
  ];

  return (
    <div className="fade-in max-w-7xl mx-auto pb-12">
      {/* Premium Header Area with Mesh Gradient */}
      <div className="relative mb-8 sm:mb-10 p-6 sm:p-10 rounded-[2rem] overflow-hidden bg-white border border-indigo-50 shadow-sm group">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl rounded-full mix-blend-multiply opacity-70 pointer-events-none"></div>
        
        <header className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
          <div className="flex-1 min-w-0">
            <nav className="flex items-center gap-2 mb-4 sm:mb-6 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-gray-400 flex items-center gap-1.5"><FolderKanban size={12} /> Projects</span>
              <ChevronRight size={10} className="text-gray-300" />
              <span className="text-indigo-600 truncate max-w-[150px] sm:max-w-none">{project.title}</span>
            </nav>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-gray-900 mb-2 sm:mb-4">
              {project.title}
            </h1>
            <p className="text-gray-400 font-bold text-sm sm:text-base max-w-2xl leading-relaxed">
              Internal ID: <span className="text-gray-900 uppercase">#SG-{project._id.slice(-6)}</span>
            </p>
          </div>
          
          <div className="w-full lg:w-auto shrink-0">
            {['Admin', 'Project Manager'].includes(user?.role) ? (
              <Select 
                label="Project Status"
                value={project.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                icon={Settings2}
                className="w-full lg:min-w-[240px]"
                options={[
                  { value: 'DRAFT', label: 'DRAFT' },
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'IN PROGRESS', label: 'IN PROGRESS' },
                  { value: 'PENDING REVIEW', label: 'PENDING REVIEW' },
                  { value: 'REVISION REQUESTED', label: 'REVISION REQUESTED' },
                  { value: 'COMPLETE', label: 'COMPLETE' },
                  { value: 'BILLED', label: 'BILLED' },
                  { value: 'ARCHIVED', label: 'ARCHIVED' }
                ]}
              />
            ) : (
              <div className="flex items-center gap-4 px-6 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 bg-white shadow-sm w-full sm:w-auto">
                <div className="size-3 sm:size-4 rounded-full animate-pulse" style={{ backgroundColor: getStatusColor(project.status) }}></div>
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">Current Phase</span>
                  <span className="text-base sm:text-lg font-black uppercase tracking-tight leading-none" style={{ color: getStatusColor(project.status) }}>
                    {project.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Modern Segmented Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-10 p-1.5 bg-white border border-gray-100 rounded-2xl shadow-sm w-fit max-w-full custom-scrollbar">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2.5 px-6 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 whitespace-nowrap
                ${isActive 
                  ? 'bg-gray-900 text-white shadow-md transform scale-[1.02]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <tab.icon size={16} className={isActive ? 'text-indigo-400' : 'opacity-70'} />
              {tab.id}
            </button>
          )
        })}
      </div>

      {/* Tab Content Area */}
      <div className="workspace-content min-h-[400px]">
        {activeTab === 'Overview' && <OverviewTab project={project} onStatusUpdate={handleStatusUpdate} />}
        {activeTab === 'Chat' && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-[700px] max-h-[80vh]">
            <ChatTab 
              messages={messages} 
              onSendMessage={handleSendMessage} 
              user={user} 
              chatEndRef={chatEndRef} 
            />
          </div>
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
      <div className="flex flex-col items-center justify-center p-20 min-h-[60vh] animate-pulse">
        <div className="relative size-16 mb-6">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    }>
      <WorkspaceInner />
    </Suspense>
  );
}
