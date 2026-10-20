import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  activeRole: UserRole | null;
  driverLogin: (email: string) => void;
  driverSignup: (name: string, email: string) => void;
  operatorLogin: (email: string) => void;
  operatorSignup: (name: string, email: string) => void;
  adminLogin: (email: string) => void;
  logout: () => void;
}

const defaultUsers: Record<UserRole, User> = {
  customer: {
    id: 'usr_driver_01',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'customer',
    currentVehicleId: 'veh_01',
  },
  operator: {
    id: 'usr_operator_01',
    name: 'Sam Miller',
    email: 'operator@pune-charging.com',
    role: 'operator',
  },
  admin: {
    id: 'usr_admin_01',
    name: 'Prof. Davis (Admin)',
    email: 'admin@ev-platform.org',
    role: 'admin',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('voltcharge_active_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return defaultUsers['customer'];
  });

  const driverLogin = (email: string) => {
    const u: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ') || 'Alex Johnson',
      email: email || 'alex.johnson@example.com',
      role: 'customer',
      currentVehicleId: 'veh_01',
    };
    setUser(u);
    localStorage.setItem('voltcharge_active_user', JSON.stringify(u));
  };

  const driverSignup = (name: string, email: string) => {
    const u: User = {
      id: `usr_${Date.now()}`,
      name: name || 'EV Driver',
      email: email || 'driver@example.com',
      role: 'customer',
      currentVehicleId: 'veh_01',
    };
    setUser(u);
    localStorage.setItem('voltcharge_active_user', JSON.stringify(u));
  };

  const operatorLogin = (email: string) => {
    const u: User = {
      id: `op_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ') || 'Sam Miller',
      email: email || 'operator@pune-charging.com',
      role: 'operator',
    };
    setUser(u);
    localStorage.setItem('voltcharge_active_user', JSON.stringify(u));
  };

  const operatorSignup = (name: string, email: string) => {
    const u: User = {
      id: `op_${Date.now()}`,
      name: name || 'Station Operator',
      email: email || 'operator@pune-charging.com',
      role: 'operator',
    };
    setUser(u);
    localStorage.setItem('voltcharge_active_user', JSON.stringify(u));
  };

  const adminLogin = (email: string) => {
    const u: User = {
      id: `admin_${Date.now()}`,
      name: 'System Administrator',
      email: email || 'admin@ev-platform.org',
      role: 'admin',
    };
    setUser(u);
    localStorage.setItem('voltcharge_active_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voltcharge_active_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeRole: user?.role || null,
        driverLogin,
        driverSignup,
        operatorLogin,
        operatorSignup,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
