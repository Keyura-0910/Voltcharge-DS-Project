import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEVData } from '../../context/EVDataContext';
import { Calendar, Clock, Zap, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export const BookingExperience: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { stations, chargers, createBooking, joinQueue } = useEVData();

  const stationId = searchParams.get('stationId') || 'stn_01';
  const chargerId = searchParams.get('chargerId') || 'chg_01';

  const station = stations.find(s => s.id === stationId) || stations[0];
  const charger = chargers.find(c => c.id === chargerId) || chargers[0];

  const [selectedDate, setSelectedDate] = useState('Today (27 Aug)');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success?: boolean;
    message?: string;
    occupied?: boolean;
  } | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setBookingResult(null);

    const res = await createBooking(station.id, charger.id, selectedDate, selectedTime);
    setIsSubmitting(false);
    setBookingResult(res);
  };

  const handleJoinQueue = async () => {
    await joinQueue(station.id);
    navigate('/queue');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Back Link */}
      <button
        onClick={() => navigate(`/stations/${station.id}`)}
        className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {station.name}</span>
      </button>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reserve Charging Slot</h1>
        <p className="text-sm text-slate-500 mt-1">Select your preferred time slot and confirm your reservation.</p>
      </div>

      {/* Main Booking Form & Summary Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Step 1: Select Date & Time */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Step 1: Choose Slot Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option>Today (27 Aug)</option>
                <option>Tomorrow (28 Aug)</option>
                <option>Saturday (29 Aug)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> Select Time Slot
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option>10:30 AM - 11:30 AM</option>
                <option>11:30 AM - 12:30 PM</option>
                <option>02:00 PM - 03:00 PM</option>
                <option>04:30 PM - 05:30 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Booking Summary Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Booking Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Station:</span>
              <span className="font-bold text-slate-900">{station.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Charger:</span>
              <span className="font-bold text-slate-900">{charger.name} ({charger.powerKw} kW {charger.connectorType})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Time:</span>
              <span className="font-bold text-slate-900">{selectedTime}</span>
            </div>
            <div className="flex justify-between py-1 pt-2 text-base font-extrabold">
              <span className="text-slate-900">Estimated Cost:</span>
              <span className="text-emerald-600">₹420</span>
            </div>
          </div>
        </div>

        {/* Result Message Banners */}
        {bookingResult && (
          <div>
            {bookingResult.success ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Charger reserved successfully.</span>
                </div>
                <button
                  onClick={() => navigate('/bookings')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  View Booking
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-800 text-sm font-semibold space-y-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>{bookingResult.message || 'This charger is no longer available.'}</span>
                </div>
                <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                  <span className="text-xs text-rose-700 font-normal">All chargers are currently occupied. Would you like to join the waiting list?</span>
                  <button
                    onClick={handleJoinQueue}
                    className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Join Queue
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {!bookingResult?.success && (
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span>Confirming Reservation...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Booking</span>
              </>
            )}
          </button>
        )}

      </div>

    </div>
  );
};
