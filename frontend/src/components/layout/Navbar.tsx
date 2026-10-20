import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEVData } from '../../context/EVDataContext';
import { Zap, Bell, LogOut, Shield, Building2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications, vehicles } = useEVData();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;
  const currentVehicle = vehicles[0];
  const currentRole = user?.role || 'customer';

  const handleSignOut = () => {
    const role = currentRole;
    logout();
    if (role === 'operator') {
      navigate('/operator/login');
    } else if (role === 'admin') {
      navigate('/admin/login');
    } else {
      navigate('/driver/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(currentRole === 'operator' ? '/operator/overview' : currentRole === 'admin' ? '/admin/overview' : '/dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">VoltCharge</span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md border border-slate-200 capitalize">
                {currentRole === 'customer' ? 'Driver Portal' : currentRole === 'operator' ? 'Operator Portal' : 'Admin Console'}
              </span>
            </div>
          </div>

          {/* Center: Current Vehicle Badge (if Driver) */}
          {currentRole === 'customer' && currentVehicle && (
            <div 
              onClick={() => navigate('/vehicles')}
              className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-900">{currentVehicle.make} {currentVehicle.model}</span>
              <span className="text-slate-400">|</span>
              <span className="text-emerald-600 font-semibold">{currentVehicle.currentBatteryPercent}% Battery</span>
            </div>
          )}

          {/* Right Controls: Notifications, Profile, Sign Out */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Notification Bell (Driver) */}
            {currentRole === 'customer' && (
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
                )}
              </button>
            )}

            {/* User Profile Info & Sign Out */}
            <div className="flex items-center space-x-3 border-l border-slate-200 pl-3">
              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs border border-slate-300">
                  {user ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-900">{user?.name || 'User'}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{currentRole}</div>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold flex items-center space-x-1 border border-slate-200"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
