import React from 'react';
import { useEVData } from '../../context/EVDataContext';
import { useWebSocket } from '../../context/WebSocketContext';
import { BatteryGauge } from '../../components/common/BatteryGauge';
import { StationCard } from '../../components/common/StationCard';
import { Zap, CalendarCheck, MapPin, Clock, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CustomerDashboard: React.FC = () => {
  const { stations, bookings, vehicles, queueEntries } = useEVData();
  const { liveSession } = useWebSocket();
  const navigate = useNavigate();

  const primaryVehicle = vehicles[0];
  const activeBooking = bookings.find(b => b.status === 'Confirmed' || b.status === 'Active');
  const nearbyStation = stations[0]; // Pune Central
  const activeQueue = queueEntries.find(q => q.status === 'Waiting');

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Greeting */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Charging Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, Alex
            </h1>
            <p className="text-emerald-100 text-sm mt-1 max-w-md">
              Your Tata Nexon EV is connected and ready. Nearest fast charger is 2.4 km away.
            </p>
          </div>

          {/* Quick Vehicle Battery Widget */}
          {primaryVehicle && (
            <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-2xl flex items-center space-x-5 shadow-inner">
              <BatteryGauge percent={primaryVehicle.currentBatteryPercent} size="md" />
              <div className="border-l border-white/20 pl-4 text-left">
                <div className="text-xs text-emerald-100 font-medium">{primaryVehicle.make} {primaryVehicle.model}</div>
                <div className="text-xs font-bold text-white mt-0.5">{primaryVehicle.licensePlate}</div>
                <div className="text-[11px] text-emerald-200 mt-1">{primaryVehicle.connectorType} Fast Charger</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Queue Alert (If Waiting List) */}
      {activeQueue && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
              #{activeQueue.position}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">You are in the waiting list</div>
              <div className="text-xs text-slate-600 mt-0.5">
                {activeQueue.stationName} • Est. wait: <strong>{activeQueue.estimatedWaitMinutes} minutes</strong> ({activeQueue.peopleAhead} people ahead)
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/queue')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
          >
            View Queue Position
          </button>
        </div>
      )}

      {/* Active Charging Session Banner */}
      {liveSession && liveSession.status === 'Charging' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md animate-pulse">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Live Charging in Progress</div>
              <h3 className="text-base font-bold text-slate-900">{liveSession.stationName} — {liveSession.chargerName}</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                {liveSession.energyDeliveredKwh} kWh Delivered • {liveSession.chargingPowerKw} kW Power • Est. {liveSession.estimatedRemainingMinutes} mins left
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/charging')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
          >
            <span>Open Live Screen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Active Booking & Nearby Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Booking & Route Recommendation Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Booking Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">Active Booking</h2>
              </div>
              <button
                onClick={() => navigate('/bookings')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View All
              </button>
            </div>

            {activeBooking ? (
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 gap-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded-md mb-1">
                    Confirmed Slot
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{activeBooking.stationName}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeBooking.chargerName} • {activeBooking.date} at {activeBooking.timeSlot}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Estimated Cost</div>
                  <div className="text-lg font-extrabold text-slate-900">₹{activeBooking.estimatedCost}</div>
                  <button
                    onClick={() => navigate('/charging')}
                    className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                  >
                    Start Charging
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">No active bookings for today.</p>
                <button
                  onClick={() => navigate('/find-charger')}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  + Reserve a Charger Now
                </button>
              </div>
            )}
          </div>

          {/* Recommended Station Shortcut */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Recommended Station</div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Pune Central Charging Hub</h3>
              <p className="text-xs text-slate-500 mt-1">
                2.4 km away • 4 chargers available • 5 min estimated wait
              </p>
            </div>
            <button
              onClick={() => navigate('/route')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              Get Best Route
            </button>
          </div>

        </div>

        {/* Right Column: Nearby Station Preview Card */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">Nearby Station</h2>
            <button
              onClick={() => navigate('/find-charger')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Explore Map
            </button>
          </div>

          {nearbyStation && <StationCard station={nearbyStation} />}
        </div>

      </div>

    </div>
  );
};
