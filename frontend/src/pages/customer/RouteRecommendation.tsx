import React, { useState } from 'react';
import { useEVData } from '../../context/EVDataContext';
import { Navigation, MapPin, Battery, Zap, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RouteRecommendation: React.FC = () => {
  const navigate = useNavigate();
  const { stations } = useEVData();

  const [origin, setOrigin] = useState('Shivajinagar, Pune');
  const [destination, setDestination] = useState('Hinjawadi IT Park, Pune');
  const [battery, setBattery] = useState(45);
  const [loading, setLoading] = useState(false);
  const [recommended, setRecommended] = useState<any>(null);

  const handleFindRoute = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    fetch('/api/route-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentLocation: origin, destination, currentBattery: battery }),
    })
      .then((r) => r.json())
      .then((data) => {
        setRecommended(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Trip Route Planner</h1>
        <p className="text-sm text-slate-500 mt-1">Find the best charger for your trip based on live charger availability and battery range.</p>
      </div>

      {/* Inputs Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center">
          <Navigation className="w-5 h-5 text-emerald-600 mr-2" />
          Find the best charger for your trip
        </h2>

        <form onSubmit={handleFindRoute} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1" /> Current Location
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Origin address"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center">
                <Navigation className="w-3.5 h-3.5 text-slate-400 mr-1" /> Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Destination address"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center">
                <Battery className="w-3.5 h-3.5 text-slate-400 mr-1" /> Current Battery Level
              </label>
              <span className="text-xs font-extrabold text-emerald-600">{battery}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={battery}
              onChange={(e) => setBattery(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-sm"
          >
            {loading ? 'Calculating Best Route...' : 'Find Recommended Charger'}
          </button>
        </form>
      </div>

      {/* Output Recommendation Card */}
      {recommended && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Recommended For You
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">{recommended.station.name}</h3>
            <p className="text-xs text-slate-600 mt-1">
              {recommended.distanceKm} km away • {recommended.availableChargers} chargers available • {recommended.estimatedWaitMin} min estimated wait
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur border border-emerald-200 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Why this station?</h4>
            <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
              {recommended.reasons.map((reason: string, idx: number) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={() => navigate(`/stations/${recommended.station.id}`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
            >
              <span>View Station & Book Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
