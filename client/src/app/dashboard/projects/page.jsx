'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FolderKanban,
  UserPlus,
  Users
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { userService } from '../../../services/userService';
import { cn } from '../../../utils/cn';

import ProjectCard from '../../../components/ui/ProjectCard';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

/**
 * ProjectsPage Component
 * A high-end project management interface with advanced filtering and provisioning.
 */
export default function ProjectsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [customers, setCustomers] = useState([]);
  
  const [newProject, setNewProject] = useState({ 
    title: '', 
    description: '',
    customerType: 'existing', // 'existing' | 'new'
    customerId: '',
    newCustomerName: '',
    newCustomerEmail: '',
    clientName: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (isModalOpen) fetchCustomers();
  }, [isModalOpen]);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data || []);
    } catch (error) {
      console.error('Master projects load failure:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await userService.getCustomers();
      setCustomers(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error('Customer intelligence load failure:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { data: result } = await api.post('/projects', newProject);
      setProjects([result.data, ...projects]);
      setIsModalOpen(false);
      setNewProject({ 
        title: '', 
        description: '',
        customerType: 'existing',
        customerId: '',
        newCustomerName: '',
        newCustomerEmail: '',
        clientName: '' 
      });
    } catch (error) {
      console.error('Project provisioning failure:', error);
      alert(error.response?.data?.error || 'Failed to initiate project');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fade-in max-w-[1600px] mx-auto pb-20">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-10 mb-12 sm:mb-20 animate-slide-up px-2 sm:px-0">
        <div className="space-y-3 sm:space-y-4 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="size-8 sm:size-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <FolderKanban size={16} sm:size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Operations Management</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight sm:leading-none">
            Active <span className="text-indigo-600">Portfolio</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-xl font-bold max-w-2xl leading-relaxed">
            Orchestrate your complex operations and maintain <span className="text-gray-900 font-black">seamless collaboration</span>.
          </p>
        </div>
        
        {['Admin', 'Project Manager'].includes(user?.role) && (
          <Button 
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
            className="shadow-2xl shadow-indigo-600/30"
          >
            Initiate Project
          </Button>
        )}
      </header>

      {/* Advanced Filtering Section */}
      <section className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center mb-12 sm:mb-16 animate-slide-up px-2 sm:px-0">
        <div className="relative w-full lg:flex-1">
          <Input 
            placeholder="Search by title, client intelligence..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="shadow-sm"
          />
        </div>
        
        <Select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          icon={Filter}
          className="w-full lg:min-w-[280px] shadow-sm"
          options={[
            { value: 'All', label: 'All Portfolio Units' },
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
      </section>

      {/* Projects Intelligence Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-gray-50 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onClick={() => router.push(`/dashboard/projects/view?id=${project._id}`)}
              className="animate-slide-up"
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50/50 flex flex-col items-center justify-center p-32 text-center rounded-[3rem] border-2 border-gray-100 border-dashed">
          <FolderKanban size={64} className="text-gray-200 mb-8" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] max-w-sm leading-relaxed">
            No portfolio units detected matching your current intelligence filters.
          </p>
        </div>
      )}

      {/* Provisioning Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Initiate Project"
        subtitle="Provision a new portfolio unit and assign stakeholders"
        icon={Plus}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateProject} className="space-y-10">
          <Input 
            label="Project Title"
            required
            value={newProject.title}
            onChange={e => setNewProject({...newProject, title: e.target.value})}
            placeholder="e.g. Strategic Infrastructure Expansion"
          />

          <div className="bg-gray-50/80 rounded-[2.5rem] p-10 border border-gray-100">
            <div className="flex items-center justify-between mb-10">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1.5">Stakeholder Assignment</label>
              <div className="flex bg-gray-200/30 p-1.5 rounded-2xl border border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewProject({...newProject, customerType: 'existing'})}
                  className={cn(
                    "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                    newProject.customerType === 'existing' 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Existing
                </button>
                <button
                  type="button"
                  onClick={() => setNewProject({...newProject, customerType: 'new'})}
                  className={cn(
                    "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                    newProject.customerType === 'new' 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Add New
                </button>
              </div>
            </div>

            {newProject.customerType === 'existing' ? (
              <Select 
                required
                value={newProject.customerId}
                onChange={e => setNewProject({...newProject, customerId: e.target.value})}
                icon={Users}
                options={[
                  { value: '', label: 'Select an existing stakeholder...' },
                  ...customers.map(c => ({ value: c._id, label: `${c.name} (${c.email})` }))
                ]}
              />
            ) : (
              <div className="space-y-6 animate-slide-up">
                <Input 
                  label="Full Name"
                  required={newProject.customerType === 'new'}
                  value={newProject.newCustomerName}
                  onChange={e => setNewProject({...newProject, newCustomerName: e.target.value})}
                  placeholder="e.g. John Smith"
                />
                <Input 
                  label="Intelligence (Email Address)"
                  type="email" 
                  required={newProject.customerType === 'new'}
                  value={newProject.newCustomerEmail}
                  onChange={e => setNewProject({...newProject, newCustomerEmail: e.target.value})}
                  placeholder="john@example.com"
                />
                <div className="bg-indigo-50/50 p-6 rounded-2xl flex items-start gap-4 border border-indigo-100/50">
                  <UserPlus size={18} className="text-indigo-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-indigo-800 font-bold leading-relaxed">
                    Automated Provisioning: A secure invitation will be dispatched instantly with unique access credentials.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1.5">Scope of Operations</label>
            <textarea 
              className="input-premium min-h-[160px] resize-none"
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
              placeholder="Define project scope, strategic requirements, and operational objectives..."
            />
          </div>

          <div className="flex gap-6 pt-10">
            <Button 
              variant="ghost" 
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 shadow-xl shadow-indigo-600/20"
              loading={isCreating}
            >
              Launch Portfolio Unit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
