import React from 'react';
import { useEVData } from '../../context/EVDataContext';

export const ChargersManage: React.FC = () => {
  const { chargers } = useEVData();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Manage Hardware Chargers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {chargers.map(c => (
          <div key={c.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div className="font-bold text-slate-900">{c.name}</div>
            <div className="text-xs text-slate-500">{c.powerKw} kW • {c.connectorType}</div>
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">{c.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SessionsManage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-extrabold text-slate-900">Active Charging Sessions</h1>
    <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-600">
      Monitoring live telemetry sessions for all stations.
    </div>
  </div>
);

export const AlertsManage: React.FC = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-extrabold text-slate-900">Station Operational Alerts</h1>
    <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-600">
      All telemetry sensors reporting normal status.
    </div>
  </div>
);
