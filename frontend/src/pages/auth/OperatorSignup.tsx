import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, UserPlus, Mail, Lock, User, MapPin } from 'lucide-react';

export const OperatorSignup: React.FC = () => {
  const { operatorSignup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stationName, setStationName] = useState('Pune Central Charging Hub');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    operatorSignup(name || 'Sam Miller', email || 'operator@pune-charging.com');
    navigate('/operator/overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md mx-auto mb-3">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Operator Registration</h2>
        <p className="mt-1 text-sm text-slate-500">Register your charging station on the VoltCharge Network</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-3xl sm:px-10 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <User className="w-3.5 h-3.5 text-slate-400 mr-1" /> Operator Name
              </label>
              <input
                type="text"
                required
                placeholder="Sam Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Mail className="w-3.5 h-3.5 text-slate-400 mr-1" /> Business Email Address
              </label>
              <input
                type="email"
                required
                placeholder="operator@pune-charging.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" /> Station Name
              </label>
              <input
                type="text"
                required
                placeholder="Pune Central Charging Hub"
                value={stationName}
                onChange={(e) => setStationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Station Account</span>
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Already registered?</span>
            <Link to="/operator/login" className="font-bold text-slate-900 hover:underline">
              Operator Login →
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
