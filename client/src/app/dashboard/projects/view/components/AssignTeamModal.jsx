'use client';

import { useState, useEffect } from 'react';
import { X, Search, Shield } from 'lucide-react';
import { userService } from '../../../../../services/userService';

export default function AssignTeamModal({ isOpen, onClose, role, onAssign }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && role) {
      fetchUsersByRole();
    }
  }, [isOpen, role]);

  const fetchUsersByRole = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsersByRole(role);
      setUsers(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error(`Error fetching ${role}s:`, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl relative z-10 fade-in border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-gray-900">Assign {role}</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Select a team member</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            className="w-full bg-gray-50 border border-gray-200 p-3 pl-11 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" 
            placeholder={`Search ${role}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2 space-y-3">
          {loading ? (
            [...Array(3)].map((_, i) => <div key={i} className="h-16 w-full skeleton rounded-xl" />)
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div 
                key={user._id}
                onClick={() => onAssign(role, user._id)}
                className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer transition-all group"
              >
                <div className="size-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center flex flex-col items-center">
               <Shield size={32} className="text-gray-300 mb-3" />
               <p className="text-gray-500 text-sm font-bold">No {role}s found.</p>
               <p className="text-gray-400 text-xs mt-1">Make sure they are registered in the Team directory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
