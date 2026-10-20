import React from 'react';
import { useEVData } from '../../context/EVDataContext';
import { Car, Zap, ShieldCheck } from 'lucide-react';

export const Vehicles: React.FC = () => {
  const { vehicles } = useEVData();

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My EV Garage</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your connected electric vehicles and charging profiles.</p>
        </div>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm self-start sm:self-auto">
          + Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{v.make} {v.model}</h3>
                  <span className="text-xs text-slate-400 font-mono">{v.licensePlate}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md">
                Active Primary
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400">Battery Pack</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{v.batteryCapacityKwh} kWh</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400">Plug Protocol</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{v.connectorType}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
