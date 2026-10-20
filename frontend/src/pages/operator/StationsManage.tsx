import React from 'react';
import { useEVData } from '../../context/EVDataContext';

export const StationsManage: React.FC = () => {
  const { stations } = useEVData();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Manage Charging Stations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stations.map(s => (
          <div key={s.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-900">{s.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{s.address}</p>
            <div className="mt-3 text-xs font-semibold text-emerald-600">{s.availableChargers} of {s.totalChargers} Chargers Available</div>
          </div>
        ))}
      </div>
    </div>
  );
};
