'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Shield, 
  MoreVertical, 
  UserPlus, 
  Search, 
  UserCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/userService';
import { cn } from '../../../utils/cn';

import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import StatsCard from '../../../components/ui/StatsCard';
import UserForm from '../../../components/forms/UserForm';

/**
 * TeamPage Component
 * A high-end team management interface with directory oversight and access control.
 */
export default function TeamPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : (data.data || [data]));
    } catch (error) {
      console.error('Team intelligence load failure:', error);
      try {
        const current = await userService.getCurrentUser();
        setUsers([current]);
      } catch (err) {
        setUsers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const result = await userService.createUser(userData);
      setUsers([...users, result.user || result]);
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to provision member');
      throw error;
    }
  };

  if (!['Admin', 'Project Coordinator', 'Project Manager'].includes(currentUser?.role)) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <XCircle size={48} className="text-rose-500 mb-6" />
        <h2 className="text-2xl font-black mb-2">Access Restriced</h2>
        <p className="text-gray-400 font-bold">You lack the necessary clearances to access team intelligence.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(u => 
    u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in max-w-[1600px] mx-auto pb-20">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-10 mb-12 sm:mb-20 animate-slide-up px-2 sm:px-0">
        <div className="space-y-3 sm:space-y-4 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="size-8 sm:size-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </div>
            <span className="text-[8px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Organization Oversight</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-tight sm:leading-none">
            Team <span className="text-indigo-600">Directory</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-xl font-bold max-w-2xl leading-relaxed">
            Manage your organization's <span className="text-gray-900 font-black">human capital</span> and permissions.
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="lg" 
          icon={UserPlus} 
          onClick={() => setIsModalOpen(true)}
          className="shadow-2xl shadow-indigo-600/30"
        >
          Add Member
        </Button>
      </header>

      {/* Team Intelligence Overview */}
      <section className="responsive-grid mb-12">
        <StatsCard 
          name="Total Personnel"
          value={users.length}
          icon={Users}
          color="#6366f1"
          loading={loading}
        />
        <StatsCard 
          name="Executive Clearance"
          value={users.filter(u => u.role === 'Admin').length}
          icon={Shield}
          color="#0f172a"
          loading={loading}
        />
        <StatsCard 
          name="Stakeholder Nodes"
          value={users.filter(u => u.role === 'Customer').length}
          icon={Mail}
          color="#3b82f6"
          loading={loading}
        />
      </section>

      {/* Main Directory Table */}
      <Card variant="glass" padding="p-0 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-gray-50/30">
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900">Personnel Directory</h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time status of all organizational nodes</p>
          </div>
          <div className="relative w-full lg:min-w-[300px]">
            <Input 
              placeholder="Search by name, role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="bg-white shadow-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">Personnel Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">Access Level</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100">Node Status</th>
                <th className="px-8 py-5 text-right border-b border-gray-100"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-50">
                    <td colSpan={4} className="px-8 py-6"><div className="h-10 bg-gray-50 rounded-2xl w-full" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <Users size={48} className="text-gray-200 mx-auto mb-6" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">No matching personnel nodes found in directory.</p>
                  </td>
                </tr>
              ) : filteredUsers.map((u, i) => {
                const getRoleColor = (role) => {
                  const roles = {
                    'Admin': '#0f172a',
                    'Project Manager': '#6366f1',
                    'Designer': '#db2777',
                    'Installer': '#f59e0b',
                    'Accounting': '#10b981',
                    'Customer': '#3b82f6'
                  };
                  return roles[role] || '#94a3b8';
                };
                const roleColor = getRoleColor(u?.role);

                return (
                  <tr 
                    key={u?._id || i} 
                    className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors group/row"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div 
                          className="size-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg group-hover/row:scale-110 group-hover/row:rotate-6 transition-all duration-500"
                          style={{ backgroundColor: roleColor }}
                        >
                          {u?.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[14px] font-black text-gray-900 leading-none mb-1.5 truncate group-hover/row:text-indigo-600 transition-colors">
                            {u?.name || 'Anonymous Node'}
                          </p>
                          <p className="text-[11px] font-bold text-gray-400 truncate">
                            {u?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span 
                        className="px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all inline-flex items-center gap-2"
                        style={{ 
                          backgroundColor: `${roleColor}10`, 
                          color: roleColor, 
                          borderColor: `${roleColor}25` 
                        }}
                      >
                        <Shield size={12} strokeWidth={2.5} />
                        {u?.role || 'Restricted'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-2 rounded-full shadow-[0_0_8px_currentColor]",
                          u?.status === 'Active' ? "bg-emerald-500 text-emerald-500" : "bg-rose-500 text-rose-500"
                        )} />
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          u?.status === 'Active' ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {u?.status || 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="size-10 rounded-xl bg-transparent hover:bg-gray-100 text-gray-300 hover:text-gray-900 transition-all cursor-pointer border-none flex items-center justify-center ml-auto">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Member Provisioning Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision Member"
        subtitle="Initialize a new user node in the organization"
        icon={UserPlus}
        maxWidth="max-w-2xl"
      >
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
