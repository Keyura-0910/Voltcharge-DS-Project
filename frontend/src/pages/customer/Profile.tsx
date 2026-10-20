import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Smartphone, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage personal details, payment preferences, and account credentials.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
            {user ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name || 'EV Driver'}</h2>
            <p className="text-xs text-slate-500 flex items-center mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400 mr-1" />
              {user?.email || 'driver@example.com'}
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 text-[11px] font-bold bg-slate-100 text-slate-700 rounded-md capitalize">
              Role: {user?.role || 'customer'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Phone Number:</span>
            <span className="font-semibold text-slate-900">+91 98230 44192</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Account ID:</span>
            <span className="font-mono text-slate-900">{user?.id || 'usr_01'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500">Security Verification:</span>
            <span className="font-semibold text-emerald-600">2FA Verified</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition-all border border-slate-200 flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>

      </div>

    </div>
  );
};
