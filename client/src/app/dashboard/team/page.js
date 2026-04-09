'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Mail, Shield, MoreVertical, UserPlus, Search, UserCheck } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Card from '../../../components/ui/Card';
import UserForm from '../../../components/forms/UserForm';
import useModal from '../../../hooks/useModal';
import { userService } from '../../../services/userService';

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
      setUsers(data); 
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
      <div style={{ 
        height: 'calc(100vh - 200px)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <Shield size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)' }}>Only Administrators and Project Managers can manage the team.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Members', value: users.length, icon: Users, color: '#4338ca' },
    { label: 'Administrators', value: users.filter(u => u.role === 'Admin').length, icon: Shield, color: '#0f172a' },
    { label: 'Project Managers', value: users.filter(u => u.role === 'Project Manager').length, icon: UserCheck, color: '#10b981' },
    { label: 'Accounting', value: users.filter(u => u.role === 'Accounting').length, icon: Mail, color: '#db2777' }
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Team Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Manage your organization's members and collaborators.
          </p>
        </div>
        
        <button 
          className="btn btn-primary" 
          style={{ gap: '0.625rem', padding: '0.8rem 1.5rem' }} 
          onClick={modal.open}
        >
          <UserPlus size={20} />
          <span style={{ fontWeight: '700' }}>Add Member</span>
        </button>
      </header>

      {/* Stats Overview */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ padding: '0.75rem', borderRadius: '12px', background: `${stat.color}10`, color: stat.color }}>
                <stat.icon size={24} />
              </div>
              <div>
                <p style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '700', 
                  color: 'var(--text-muted)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  marginBottom: '0.25rem' 
                }}>
                  {stat.label}
                </p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* User Table */}
      <Card padding="0">
        <div style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--border)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'rgba(255,255,255,0.5)' 
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>User Directory</h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} />
            <input 
              type="text" 
              placeholder="Search members..." 
              style={{ 
                padding: '0.5rem 1rem 0.5rem 2.5rem', 
                borderRadius: '100px', 
                border: '1px solid var(--border)', 
                fontSize: '0.8125rem', 
                outline: 'none', 
                width: '240px' 
              }} 
            />
          </div>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ 
                padding: '1rem 2rem', 
                color: 'var(--text-muted)', 
                fontWeight: '700', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Member Details
              </th>
              <th style={{ 
                padding: '1rem 2rem', 
                color: 'var(--text-muted)', 
                fontWeight: '700', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Access Role
              </th>
              <th style={{ 
                padding: '1rem 2rem', 
                color: 'var(--text-muted)', 
                fontWeight: '700', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em' 
              }}>
                Account Status
              </th>
              <th style={{ padding: '1rem 2rem', textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const getRoleStyles = (role) => {
                const styles = {
                  'Admin': { bg: '#0f172a15', text: '#0f172a', border: '#0f172a30' },
                  'Project Manager': { bg: '#10b98115', text: '#10b981', border: '#10b98130' },
                  'Designer': { bg: '#db277715', text: '#db2777', border: '#db277730' },
                  'Installer': { bg: '#f59e0b15', text: '#f59e0b', border: '#f59e0b30' },
                  'Accounting': { bg: '#6366f115', text: '#6366f1', border: '#6366f130' },
                  'Customer': { bg: '#2563eb15', text: '#2563eb', border: '#2563eb30' }
                };
                return styles[role] || { bg: '#64748b15', text: '#64748b', border: '#64748b30' };
              };
              const styles = getRoleStyles(u?.role);

              return (
                <tr 
                  key={i} 
                  style={{ 
                    borderBottom: i === users.length - 1 ? 'none' : '1px solid var(--border)', 
                    transition: 'background 0.2s' 
                  }} 
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.01)'} 
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '44px', 
                        height: '44px', 
                        borderRadius: '12px', 
                        background: styles.bg, 
                        color: styles.text,
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: '800',
                        fontSize: '1rem',
                        border: `1px solid ${styles.border}`
                      }}>
                        {u?.name?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.9375rem', marginBottom: '0.125rem' }}>
                          {u?.name}
                        </p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {u?.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ 
                      fontSize: '0.6875rem', 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '8px', 
                      background: styles.bg, 
                      color: styles.text,
                      fontWeight: '800',
                      border: `1px solid ${styles.border}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textTransform: 'uppercase'
                    }}>
                      <Shield size={12} />
                      {u?.role}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#10b981' }}>
                        Active Account
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                    <button 
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--text-muted)', 
                        cursor: 'pointer', 
                        padding: '0.5rem', 
                        borderRadius: '8px' 
                      }} 
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-dark)'} 
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Add New Member"
        subtitle="Create a new user account"
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
