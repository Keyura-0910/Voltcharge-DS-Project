import React from 'react';
import { useWebSocket } from '../../context/WebSocketContext';
import { useEVData } from '../../context/EVDataContext';
import { BatteryGauge } from '../../components/common/BatteryGauge';
import { Zap, Clock, ShieldCheck, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveCharging: React.FC = () => {
  const { liveSession: wsSession, isConnected } = useWebSocket();
  const { currentSession: fallbackSession } = useEVData();
  const navigate = useNavigate();

  const session = wsSession || fallbackSession || {
    id: 'ses_01',
    bookingId: 'bk_101',
    userId: 'usr_01',
    stationId: 'stn_01',
    chargerId: 'chg_01',
    stationName: 'Pune Central Charging Hub',
    chargerName: 'Charger C01',
    batteryPercent: 68,
    energyDeliveredKwh: 24.6,
    chargingPowerKw: 118,
    timeElapsedMinutes: 18,
    estimatedRemainingMinutes: 12,
    costSoFar: 295,
    status: 'Charging' as const,
    startTime: '11:30 AM',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Live Charging Status</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time battery telemetry and energy delivery monitor.</p>
        </div>

        {/* Live WebSocket Connection Status Badge */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>{isConnected ? 'Live Telemetry Sync' : 'Standby Sync'}</span>
        </div>
      </div>

      {/* Main Charging Telemetry Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Top Location & Charger Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
              <Zap className="w-3.5 h-3.5 mr-1 fill-current animate-pulse" />
              Charging in Progress
            </span>
            <h2 className="text-xl font-bold text-slate-900">{session.stationName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{session.chargerName} • Fast DC Charging (CCS2)</p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Session Cost So Far</div>
            <div className="text-2xl font-extrabold text-slate-900">₹{session.costSoFar}</div>
          </div>
        </div>

        {/* Center: Battery Progress Ring */}
        <div className="py-4">
          <BatteryGauge percent={session.batteryPercent} chargingPowerKw={session.chargingPowerKw} size="lg" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Energy Delivered</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{session.energyDeliveredKwh} kWh</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Charging Power</div>
            <div className="text-xl font-extrabold text-emerald-600 mt-1">{session.chargingPowerKw} kW</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Time Elapsed</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{session.timeElapsedMinutes} min</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Remaining</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{session.estimatedRemainingMinutes} min</div>
          </div>

        </div>

        {/* Footer Actions & Summary trigger */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Battery management system active & optimized.</span>
          </div>

          <button
            onClick={() => navigate('/payments')}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
          >
            <span>View Session Summary & Receipts</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
