'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  Save, 
  Key,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data } = await api.put('/users/profile', profileData);
      setUser(data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match' });
    }
    setLoading(true);
    setMessage(null);
    try {
      await api.put('/users/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <header className="mobile-header-stack" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>My Profile</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Update your personal information and preferences.</p>
        </div>
      </header>

      {message && (
        <div className="glass" style={{ 
          padding: '1rem', 
          marginBottom: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          borderLeft: `4px solid ${message.type === 'success' ? '#10b981' : '#f87171'}`,
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(248, 113, 113, 0.05)'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#f87171" />}
          <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: message.type === 'success' ? '#059669' : '#dc2626' }}>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {/* Personal Information */}
        <section className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
              <User size={18} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Personal Information</h2>
          </div>

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="responsive-grid">
              <div className="input-group">
                <label className="label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem' }}
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    className="input-field" 
                    style={{ paddingLeft: '2.5rem' }}
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="tel" 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', maxWidth: '200px', alignSelf: 'flex-end' }}>
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
              <Lock size={18} />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Security</h2>
          </div>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="label">Current Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  className="input-field" 
                  style={{ paddingLeft: '2.5rem' }}
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                />
              </div>
            </div>

            <div className="responsive-grid">
              <div className="input-group">
                <label className="label">New Password</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label className="label">Confirm</label>
                <input 
                  type="password" 
                  className="input-field" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-secondary" disabled={loading} style={{ width: '100%', maxWidth: '200px', alignSelf: 'flex-end' }}>
              <span>Update Password</span>
            </button>
          </form>
        </section>
      </div>

      <style jsx>{`
        .responsive-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .responsive-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        @media (max-width: 640px) {
          .btn {
            max-width: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
