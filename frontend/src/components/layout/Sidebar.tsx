import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  CalendarCheck,
  Zap,
  Navigation,
  CreditCard,
  Car,
  Bell,
  User,
  Building2,
  Cpu,
  Activity,
  Wrench,
  AlertTriangle,
  Users,
} from 'lucide-react';

interface NavLinkItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const currentRole = user?.role || 'customer';

  const customerLinks: NavLinkItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/find-charger', label: 'Find Charger', icon: MapPin },
    { to: '/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/charging', label: 'My Charging', icon: Zap },
    { to: '/route', label: 'Trip Route Planner', icon: Navigation },
    { to: '/payments', label: 'Payments', icon: CreditCard },
    { to: '/vehicles', label: 'Vehicles', icon: Car },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const operatorLinks: NavLinkItem[] = [
    { to: '/operator/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/operator/stations', label: 'Stations', icon: Building2 },
    { to: '/operator/chargers', label: 'Chargers', icon: Cpu },
    { to: '/operator/sessions', label: 'Sessions', icon: Activity },
    { to: '/operator/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/operator/alerts', label: 'Alerts', icon: AlertTriangle },
  ];

  const adminLinks: NavLinkItem[] = [
    { to: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/stations', label: 'Stations', icon: Building2 },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/admin/health', label: 'System Health', icon: Activity },
  ];

  const links = currentRole === 'admin' ? adminLinks : currentRole === 'operator' ? operatorLinks : customerLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div>
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation ({currentRole})
        </div>

        <nav className="mt-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
        <div className="font-semibold text-slate-700">VoltCharge Network v2.4</div>
        <div>Commercial EV Platform</div>
      </div>
    </aside>
  );
};
