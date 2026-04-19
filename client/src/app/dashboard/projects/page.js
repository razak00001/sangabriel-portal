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
      setProjects(data.data || []);
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
      setProjects([data.data, ...projects]);
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
      <header className="mobile-header-stack">
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Projects</h1>
          <p className="hidden-mobile" style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Manage and track all collaborative projects</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" style={{ gap: '0.5rem', padding: '0.75rem 1.25rem' }} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </header>

      {/* ... Modal stays same ... */}

      <div className="glass" style={{ padding: '1rem', marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="input-field" 
            placeholder="Search projects..." 
            style={{ paddingLeft: '2.5rem', fontSize: '0.875rem', width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-dark)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', minWidth: '140px' }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', fontSize: '0.8125rem', width: '100%', fontWeight: '600' }}
          >
            <option value="All">All Status</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="COMPLETE">COMPLETE</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1.s linear infinite', margin: '0 auto' }}></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="responsive-grid">
          {filteredProjects.map((project) => (
            <div key={project._id} className="glass" style={{ padding: '1.5rem', transition: 'all 0.3s ease', cursor: 'pointer' }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-4px)';
                   e.currentTarget.style.borderColor = 'var(--primary)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.borderColor = 'var(--border)';
                 }}
                 onClick={() => window.location.href = `/dashboard/projects/view?id=${project._id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <span style={{ 
                  fontSize: '0.625rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  padding: '0.35rem 0.625rem', 
                  borderRadius: '100px',
                  background: `${getStatusColor(project.status)}15`,
                  color: getStatusColor(project.status),
                  border: `1px solid ${getStatusColor(project.status)}30`
                }}>
                  {project.status}
                </span>
                <MoreVertical size={16} color="var(--text-muted)" />
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '0.25rem' }}>{project.title}</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: '600' }}>{project.clientName}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  <UserIcon size={14} color="var(--primary)" />
                  <span>{project.projectManager?.name?.split(' ')[0] || 'Unassigned'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  <Calendar size={14} />
                  <span>{project.timeline?.startDate ? new Date(project.timeline.startDate).toLocaleDateString() : 'No date'}</span>
                </div>
              </div>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-dark)', border: '2px solid var(--border)', marginLeft: i > 1 ? '-8px' : 0 }}></div>
                  ))}
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>4 Files</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass" style={{ textAlign: 'center', padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <FolderKanban size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No projects found matching your criteria.</p>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
