import React from 'react';
import { useEVData } from '../../context/EVDataContext';
import { Building2, Cpu, Activity, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OperatorOverview: React.FC = () => {
  const { stations, chargers } = useEVData();
  const navigate = useNavigate();

  const totalChargers = chargers.length;
  const availableChargers = chargers.filter(c => c.status === 'Available').length;
  const chargingChargers = chargers.filter(c => c.status === 'Charging').length;
  const issueChargers = chargers.filter(c => c.status === 'Needs Attention' || c.status === 'Offline').length;

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Station Operator Portal</h1>
        <p className="text-sm text-slate-500 mt-1">Manage station operations, monitor active charging sessions, and repair faulty hardware.</p>
      </div>

      {/* Operator Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Total Chargers Managed</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalChargers}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Available Slots</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">{availableChargers}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Active Sessions</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">{chargingChargers}</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Maintenance Alerts</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{issueChargers}</div>
        </div>
      </div>

      {/* Quick Action Banner for Faulty Charger Maintenance */}
      {issueChargers > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Charger Hardware Alert</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {issueChargers} charger connector requiring inspection or repair.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/operator/maintenance')}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            Open Maintenance UI
          </button>
        </div>
      )}

      {/* Station List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-900">
          Managed Stations
        </div>
        <div className="divide-y divide-slate-100">
          {stations.map((s) => (
            <div key={s.id} className="p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                <p className="text-xs text-slate-500">{s.address}</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-slate-900">{s.availableChargers} / {s.totalChargers} Available</span>
                <div className="text-slate-400">Tariff: ₹{s.pricePerKwh}/kWh</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
