import React, { useState } from 'react';
import { useEVData } from '../../context/EVDataContext';
import { CalendarCheck, Clock, MapPin, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyBookings: React.FC = () => {
  const { bookings } = useEVData();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'Upcoming' | 'Completed' | 'Cancelled'>('Upcoming');

  const filteredBookings = bookings.filter(b => {
    if (tab === 'Upcoming') return b.status === 'Confirmed' || b.status === 'Active' || b.status === 'Pending';
    if (tab === 'Completed') return b.status === 'Completed';
    return b.status === 'Cancelled';
  });

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">View upcoming charger reservations and historical sessions.</p>
        </div>

        <button
          onClick={() => navigate('/find-charger')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm self-start sm:self-auto"
        >
          + Book New Charger
        </button>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 space-x-6">
        {(['Upcoming', 'Completed', 'Cancelled'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-bold transition-all relative ${
              tab === t ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t} Bookings
            {tab === t && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-md" />
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((bk) => (
            <div key={bk.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md ${
                    bk.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : bk.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {bk.status}
                  </span>
                  <span className="text-xs text-slate-400">• Booking ID: {bk.id}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{bk.stationName}</h3>
                <p className="text-xs text-slate-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {bk.chargerName} • {bk.date} at {bk.timeSlot}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Estimated Cost</div>
                  <div className="text-lg font-extrabold text-slate-900">₹{bk.estimatedCost}</div>
                </div>

                {bk.status === 'Confirmed' && (
                  <button
                    onClick={() => navigate('/charging')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Start Charging
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
            No {tab.toLowerCase()} bookings found.
          </div>
        )}
      </div>

    </div>
  );
};
