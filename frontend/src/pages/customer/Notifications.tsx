import React from 'react';
import { useEVData } from '../../context/EVDataContext';
import { Bell, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Notifications: React.FC = () => {
  const { notifications } = useEVData();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time alerts for booking confirmations, queue readiness, and charging status.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm divide-y divide-slate-100">
        {notifications.map((n) => (
          <div key={n.id} className="p-5 flex items-start space-x-4 hover:bg-slate-50/60 transition-colors">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {n.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                <span className="text-[11px] text-slate-400 font-medium">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{n.message}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
