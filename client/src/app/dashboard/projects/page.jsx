'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { 
  Search, 
  Filter, 
  Plus, 
  FolderKanban,
  X
} from 'lucide-react';
import ProjectCard from '../../../components/ui/ProjectCard';

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

  return (
    <div className="fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-black mb-1">Projects</h1>
          <p className="text-muted text-sm font-bold">Manage and track all collaborative projects</p>
        </div>
        
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </header>

      {/* Search and Filter */}
      <div className="glass p-4 mb-10 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[280px]">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            className="w-full bg-dark border border-border p-3 pl-11 rounded-xl text-sm font-bold outline-none focus:border-primary transition-colors" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 bg-dark p-2 px-4 rounded-xl border border-border min-w-[160px]">
          <Filter size={14} className="text-muted" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none text-sm font-black outline-none w-full"
          >
            <option value="All">All Status</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="COMPLETE">COMPLETE</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass p-6 h-64 skeleton" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onClick={() => window.location.href = `/dashboard/projects/view?id=${project._id}`}
            />
          ))}
        </div>
      ) : (
        <div className="glass flex flex-col items-center justify-center p-20 text-center">
          <FolderKanban size={48} className="opacity-10 mb-4" />
          <p className="text-muted text-sm font-bold">No projects found matching your criteria.</p>
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="glass w-full max-w-md p-8 relative z-10 fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black">New Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-black/5 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">Project Title</label>
                <input 
                  type="text" 
                  required
                  className="bg-dark border border-border p-3 rounded-xl text-sm font-bold outline-none focus:border-primary"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                  placeholder="e.g. Modern Kitchen Remodel"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">Client Name</label>
                <input 
                  type="text" 
                  required
                  className="bg-dark border border-border p-3 rounded-xl text-sm font-bold outline-none focus:border-primary"
                  value={newProject.clientName}
                  onChange={e => setNewProject({...newProject, clientName: e.target.value})}
                  placeholder="e.g. John Smith"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-muted tracking-wider">Description</label>
                <textarea 
                  className="bg-dark border border-border p-3 rounded-xl text-sm font-bold outline-none focus:border-primary min-h-[100px] resize-none"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Project details and scope..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="btn btn-primary mt-4 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
