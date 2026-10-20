import React from 'react';
import { useEVData } from '../../context/EVDataContext';
import { Wrench, AlertTriangle, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const MaintenanceUI: React.FC = () => {
  const { chargers, repairCharger } = useEVData();

  const maintenanceChargers = chargers.filter(
    (c) => c.status === 'Needs Attention' || c.status === 'Offline'
  );
  const healthyChargers = chargers.filter((c) => c.status === 'Available' || c.status === 'Charging');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance & Diagnostics</h1>
        <p className="text-sm text-slate-500 mt-1">Review charger hardware status, open issues, and log repairs.</p>
      </div>

      {/* Active Maintenance Requests Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center">
          <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
          Active Maintenance Issues ({maintenanceChargers.length})
        </h2>

        {maintenanceChargers.length > 0 ? (
          <div className="space-y-4">
            {maintenanceChargers.map((chg) => (
              <div
                key={chg.id}
                className="bg-white border border-rose-200 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 rounded-md">
                        {chg.status}
                      </span>
                      <span className="text-xs text-slate-400">• Station: Pune Central</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{chg.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {chg.powerKw} kW • {chg.connectorType}
                    </p>
                  </div>

                  <button
                    onClick={() => repairCharger(chg.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5 self-start sm:self-auto"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark as Repaired</span>
                  </button>
                </div>

                <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl text-xs space-y-1 text-rose-900">
                  <div className="font-bold flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" /> Reported: Today, 10:42 AM
                  </div>
                  <div>
                    <strong>Issue:</strong> {chg.issueDescription || 'Charging connector latch mechanism error.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No active hardware faults reported. All chargers operational.
          </div>
        )}
      </div>

      {/* Operational Hardware List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Operational Hardware Status</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {healthyChargers.map((chg) => (
            <div key={chg.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{chg.name}</span>
                <div className="text-[11px] text-slate-400">{chg.connectorType} • {chg.powerKw} kW</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                {chg.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
