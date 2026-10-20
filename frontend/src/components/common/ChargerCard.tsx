import React from 'react';
import { Charger } from '../../types';
import { Zap, CheckCircle2, Clock, AlertTriangle, Lock } from 'lucide-react';

interface ChargerCardProps {
  charger: Charger;
  onBook: (charger: Charger) => void;
}

export const ChargerCard: React.FC<ChargerCardProps> = ({ charger, onBook }) => {
  const getStatusBadge = (status: Charger['status']) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Available
          </span>
        );
      case 'Charging':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Zap className="w-3.5 h-3.5 mr-1 text-blue-600 animate-pulse" />
            Charging ({charger.currentBatteryPercent || 82}%)
          </span>
        );
      case 'Reserved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Lock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Reserved
          </span>
        );
      case 'Needs Attention':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Needs Attention
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Offline
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold text-slate-900">{charger.name}</h4>
          {getStatusBadge(charger.status)}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Power Output</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{charger.powerKw} kW</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-medium">Plug Type</span>
            <div className="font-bold text-slate-800 text-sm mt-0.5">{charger.connectorType}</div>
          </div>
        </div>

        {charger.issueDescription && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            <strong className="font-bold">Maintenance Alert:</strong> {charger.issueDescription}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">₹{charger.pricePerKwh}/kWh</span>
        <button
          onClick={() => onBook(charger)}
          disabled={charger.status !== 'Available'}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            charger.status === 'Available'
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          {charger.status === 'Available' ? 'Book Charger' : charger.status === 'Reserved' ? 'Reserved' : 'Occupied'}
        </button>
      </div>
    </div>
  );
};
