import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, UserPlus, Mail, Lock, User, Car } from 'lucide-react';

export const DriverSignup: React.FC = () => {
  const { driverSignup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [make, setMake] = useState('Tata Motors');
  const [model, setModel] = useState('Nexon EV Max');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    driverSignup(name || 'Alex Johnson', email || 'alex.johnson@example.com');
    navigate('/driver/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md mx-auto mb-3">
          <Zap className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Driver Registration</h2>
        <p className="mt-1 text-sm text-slate-500">Create a VoltCharge EV Driver account</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-3xl sm:px-10 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <User className="w-3.5 h-3.5 text-slate-400 mr-1" /> Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Mail className="w-3.5 h-3.5 text-slate-400 mr-1" /> Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex.johnson@example.com"
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
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center">
                  <Car className="w-3.5 h-3.5 text-slate-400 mr-1" /> EV Make
                </label>
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium"
                >
                  <option>Tata Motors</option>
                  <option>MG Motor</option>
                  <option>Hyundai</option>
                  <option>Mahindra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">EV Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Driver Account</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Already registered?</span>
            <Link to="/driver/login" className="font-bold text-emerald-600 hover:text-emerald-700">
              Driver Login →
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
