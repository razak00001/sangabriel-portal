'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Shield, MoreVertical, UserPlus, Search, UserCheck } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Card from '../../../components/ui/Card';
import UserForm from '../../../components/forms/UserForm';
import useModal from '../../../hooks/useModal';
import { userService } from '../../../services/userService';
import StatsCard from '../../../components/ui/StatsCard';

export default function TeamPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const modal = useModal();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data.data || []); 
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      setUsers([...users, newUser.user]);
      modal.close();
    } catch (error) {
      alert('Failed to create user');
      throw error;
    }
  };

  if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Project Manager') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-240px)] p-8 fade-in text-center">
        <Shield size={64} className="text-muted opacity-20 mb-6" />
        <h2 className="text-2xl font-black mb-2">Access Restricted</h2>
        <p className="text-muted text-sm font-bold">Only Administrators and Project Managers can manage the team.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h1 className="text-3xl font-black mb-1">Team Management</h1>
          <p className="text-muted text-sm font-bold">Manage your organization's members and collaborators.</p>
        </div>
        
        <button 
          className="btn btn-primary" 
          onClick={modal.open}
        >
          <UserPlus size={20} />
          <span>Add Member</span>
        </button>
      </header>

      {/* Stats Overview */}
      <section className="responsive-grid mb-12">
        <StatsCard 
          name="Total Members"
          value={users.length}
          icon={Users}
          color="#4f46e5"
          loading={loading}
        />
        <StatsCard 
          name="Administrators"
          value={users.filter(u => u.role === 'Admin').length}
          icon={Shield}
          color="#1e1b4b"
          loading={loading}
        />
        <StatsCard 
          name="Project Managers"
          value={users.filter(u => u.role === 'Project Manager').length}
          icon={UserCheck}
          color="#10b981"
          loading={loading}
        />
        <StatsCard 
          name="Accounting"
          value={users.filter(u => u.role === 'Accounting').length}
          icon={Users} /* Reusing icon or should find specific one */
          color="#ec4899"
          loading={loading}
        />
      </section>

      {/* User Table Card */}
      <Card className="p-0 overflow-hidden">
        <div className="p-6 bg-white/40 border-b border-border flex flex-wrap justify-between items-center gap-4">
          <h3 className="text-sm font-black uppercase tracking-wider">User Directory</h3>
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="w-full bg-white/50 border border-border p-2 pl-11 rounded-full text-xs font-bold outline-none focus:border-primary transition-colors" 
            />
          </div>
        </div>
        
        <div className="table-container border-none rounded-none">
          <table className="w-full border-collapse min-w-[800px]">
            <thead className="bg-dark/50">
              <tr>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted">Member Details</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted">Access Role</th>
                <th className="p-4 text-left text-[10px] font-black uppercase tracking-widest text-muted">Account Status</th>
                <th className="p-4 text-right text-[10px] font-black uppercase tracking-widest text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="table-row group">
                  <td className="p-4 border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-dark border border-border flex items-center justify-center font-black text-primary text-base shadow-sm group-hover:border-primary transition-colors">
                        {u?.name?.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-black text-main truncate mb-0.5">{u?.name}</p>
                        <p className="text-[10px] text-muted font-bold truncate">{u?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/5 text-primary border border-primary/10">
                      <Shield size={10} />
                      {u?.role}
                    </span>
                  </td>
                  <td className="p-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <span className="text-xs font-black text-emerald-600">Active</span>
                    </div>
                  </td>
                  <td className="p-4 border-b border-border text-right">
                    <button className="p-2 rounded-lg bg-transparent text-muted hover:bg-dark hover:text-main transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Add New Member"
        subtitle="Create a new user account with specific roles"
        icon={UserCheck}
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={modal.close}
        />
      </Modal>
    </div>
  );
}
