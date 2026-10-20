import React, { useState } from 'react';
import { useEVData } from '../../context/EVDataContext';
import { Clock, Users, CheckCircle2, ArrowLeft, LogOut, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QueueExperience: React.FC = () => {
  const { queueEntries, leaveQueue } = useEVData();
  const navigate = useNavigate();
  const [chargerAvailable, setChargerAvailable] = useState(false);

  const activeQueue = queueEntries.find(q => q.userId === 'usr_01') || {
    id: 'q_01',
    userId: 'usr_01',
    userName: 'Alex Johnson',
    stationId: 'stn_01',
    stationName: 'Pune Central Charging Hub',
    position: 3,
    estimatedWaitMinutes: 18,
    peopleAhead: 2,
    status: 'Waiting' as const,
    timestamp: '11:45 AM',
  };

  const handleLeave = async () => {
    await leaveQueue();
    navigate('/find-charger');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Demo Simulation Toggle */}
        <button
          onClick={() => setChargerAvailable(!chargerAvailable)}
          className="text-xs font-semibold text-emerald-600 underline hover:text-emerald-700"
        >
          {chargerAvailable ? 'Simulate Waiting' : 'Simulate Charger Available'}
        </button>
      </div>

      {/* Main Waiting List Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
        
        {!chargerAvailable ? (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Waiting List Active
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                You are in the waiting list.
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Station: <strong className="text-slate-900">{activeQueue.stationName}</strong>
              </p>
            </div>

            {/* Queue Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Position</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">#{activeQueue.position}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Est. Wait</div>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">{activeQueue.estimatedWaitMinutes} min</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase">People Ahead</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">{activeQueue.peopleAhead}</div>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              You will automatically be notified when a charger slot becomes ready for your vehicle.
            </p>

            <button
              onClick={handleLeave}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition-all border border-slate-200 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Waiting List</span>
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                Slot Ready!
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Your charger is now available.
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Charger 01 at <strong className="text-slate-900">{activeQueue.stationName}</strong> has been allocated to you.
              </p>
            </div>

            <button
              onClick={() => navigate('/book?stationId=stn_01&chargerId=chg_01')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Reserve Now</span>
            </button>
          </>
        )}

      </div>

    </div>
  );
};
