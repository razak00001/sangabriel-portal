import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { UserPlus, Shield, MoreVertical, X } from 'lucide-react';

export default function TeamPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Customer' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUsers([currentUser]);
    setLoading(false);
  }, [currentUser]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/auth/register', newUser);
      setUsers([...users, data.user]);
      setIsModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'Customer' });
    } catch { alert('Failed to create user'); }
    finally { setIsSubmitting(false); }
  };

  if (!['Admin', 'Project Coordinator'].includes(currentUser?.role)) {
    return <div style={{ textAlign: 'center', padding: '10rem' }}>Access Denied</div>;
  }

  return (
    <div className="fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Team Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage internal members and customer accounts</p>
        </div>
        <button className="btn btn-primary" style={{ gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /><span>Add User</span>
        </button>
      </header>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            <h2 style={{ marginBottom: '1.5rem' }}>Add New User</h2>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>Full Name</label>
                <input type="text" className="input-field" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>Email Address</label>
                <input type="email" className="input-field" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="john@example.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>Password</label>
                <input type="password" className="input-field" required value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600' }}>Role</label>
                <select className="input-field" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                  {['Admin','Project Coordinator','Designer','Installer','Customer'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                {isSubmitting ? 'Adding...' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="glass" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              {['User','Role','Status',''].map(h => <th key={h} style={{ padding: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i} style={{ borderBottom: i === users.length - 1 ? 'none' : '1px solid var(--border)' }}>
                <td style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>{u?.name?.charAt(0)}</div>
                    <div>
                      <p style={{ fontWeight: '600' }}>{u?.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u?.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={14} style={{ color: 'var(--primary)' }} />{u?.role}</div></td>
                <td style={{ padding: '1.25rem' }}><span style={{ fontSize: '0.625rem', padding: '0.25rem 0.625rem', borderRadius: '100px', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>Active</span></td>
                <td style={{ padding: '1.25rem', textAlign: 'right' }}><button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
