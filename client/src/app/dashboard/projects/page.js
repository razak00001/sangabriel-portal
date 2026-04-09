'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Calendar,
  User as UserIcon,
  Tag,
  X,
  FolderKanban
} from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', clientName: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { data } = await api.post('/projects', newProject);
      setProjects([data, ...projects]);
      setIsModalOpen(false);
      setNewProject({ title: '', clientName: '', description: '' });
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage and track all collaborative projects</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </header>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Project</h2>
            
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Project Title</label>
                <input type="text" className="input-field" required value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} placeholder="e.g., Office Renovation" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Client Name</label>
                <input type="text" className="input-field" required value={newProject.clientName} onChange={(e) => setNewProject({...newProject, clientName: e.target.value})} placeholder="e.g., Acme Corp" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Description</label>
                <textarea className="input-field" rows="3" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} placeholder="Brief project overview..." style={{ resize: 'none' }}></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn" style={{ flex: 1, background: 'var(--glass-border)' }}>Cancel</button>
                <button type="submit" disabled={isCreating} className="btn btn-primary" style={{ flex: 1 }}>{isCreating ? 'Creating...' : 'Create Project'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="glass" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search projects or clients..." 
            style={{ paddingLeft: '3rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-darker)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.875rem' }}
          >
            <option value="All">All Statuses</option>
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
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--glass-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredProjects.map((project) => (
            <div key={project._id} className="glass" style={{ padding: '1.5rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-6px)';
                   e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                   e.currentTarget.style.borderColor = 'var(--primary)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = 'var(--shadow)';
                   e.currentTarget.style.borderColor = 'var(--border)';
                 }}
                 onClick={() => window.location.href = `/dashboard/projects/${project._id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.625rem', 
                  fontWeight: '700', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  padding: '0.25rem 0.625rem', 
                  borderRadius: '100px',
                  background: `${getStatusColor(project.status)}15`,
                  color: getStatusColor(project.status),
                  border: `1px solid ${getStatusColor(project.status)}30`
                }}>
                  {project.status}
                </span>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <MoreVertical size={16} />
                </button>
              </div>

              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{project.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{project.clientName}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <UserIcon size={14} />
                  <span>{project.projectManager?.name || 'Unassigned'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Calendar size={14} />
                  <span>{project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'No date set'}</span>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-dark)', border: '2px solid var(--bg-darker)', marginLeft: i > 1 ? '-8px' : 0 }}></div>
                  ))}
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600' }}>4 Files</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{ textAlign: 'center', padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FolderKanban size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No projects found matching your criteria.</p>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
