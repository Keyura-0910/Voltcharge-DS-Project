import React from 'react';
import { useEVData } from '../../context/EVDataContext';

export const AdminOverview: React.FC = () => {
  const { stations, bookings, payments } = useEVData();

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Administration</h1>
        <p className="text-sm text-slate-500 mt-1">Platform management, station operations, and transaction audit monitor.</p>
      </div>

      {/* Standard Admin Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Total Stations</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{stations.length}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Total Bookings</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{bookings.length}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Total Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">₹770</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">System Status</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">100% Operational</div>
        </div>
      </div>

    </div>
  );
};
