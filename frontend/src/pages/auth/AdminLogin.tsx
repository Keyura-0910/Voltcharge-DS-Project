import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, LogIn, Mail, Lock } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@ev-platform.org');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(email);
    navigate('/admin/overview');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md mx-auto mb-3">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">System Administration</h2>
        <p className="mt-1 text-sm text-purple-200">Platform administrator authentication portal</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-6 shadow-xl border border-slate-700 sm:rounded-3xl sm:px-10 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200 mb-1.5 flex items-center">
                <Mail className="w-3.5 h-3.5 text-purple-400 mr-1" /> Administrator Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center text-purple-200">
                <Lock className="w-3.5 h-3.5 text-purple-400 mr-1" /> Master Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-extrabold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Authenticate Administrator</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700 text-center text-xs text-slate-400">
            Return to <Link to="/driver/login" className="underline text-purple-300">Driver Portal</Link>
          </div>

        </div>
      </div>

    </div>
  );
};
