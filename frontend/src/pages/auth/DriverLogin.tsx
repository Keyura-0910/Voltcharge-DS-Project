import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, LogIn, Mail, Lock, UserCheck } from 'lucide-react';

export const DriverLogin: React.FC = () => {
  const { driverLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.johnson@example.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    driverLogin(email);
    navigate('/driver/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md mx-auto mb-3">
          <Zap className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">EV Driver Portal</h2>
        <p className="mt-1 text-sm text-slate-500">Sign in to find chargers, reserve slots, and track live charging</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-3xl sm:px-10 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Mail className="w-3.5 h-3.5 text-slate-400 mr-1" /> Driver Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Lock className="w-3.5 h-3.5 text-slate-400 mr-1" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In as EV Driver</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Don't have a driver account?</span>
            <Link to="/driver/signup" className="font-bold text-emerald-600 hover:text-emerald-700">
              Sign Up as Driver →
            </Link>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Are you a station operator? <Link to="/operator/login" className="underline text-slate-600">Operator Login</Link>
          </div>

        </div>
      </div>

    </div>
  );
};
