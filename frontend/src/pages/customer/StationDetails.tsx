import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Station, Charger } from '../../types';
import { ChargerCard } from '../../components/common/ChargerCard';
import { MapPin, Clock, Zap, Star, ArrowLeft } from 'lucide-react';
import { useEVData } from '../../context/EVDataContext';

export const StationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createBooking } = useEVData();

  const [station, setStation] = useState<Station | null>(null);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/stations/${id || 'stn_01'}`)
      .then((r) => r.json())
      .then((data) => {
        setStation(data);
        setChargers(data.chargers || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleBook = (charger: Charger) => {
    navigate(`/book?stationId=${station?.id}&chargerId=${charger.id}`);
  };

  if (loading || !station) {
    return <div className="p-8 text-center text-slate-500">Loading station details...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/find-charger')}
        className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Stations</span>
      </button>

      {/* Station Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                Hub Active
              </span>
              <span className="text-xs text-slate-400">• {station.distanceKm} km away</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {station.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <MapPin className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
              <span>{station.address}</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <div className="text-right">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Available</div>
              <div className="text-xl font-extrabold text-slate-900">
                {station.availableChargers} of {station.totalChargers}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pricing</div>
              <div className="text-xl font-extrabold text-emerald-600">₹{station.pricePerKwh}/kWh</div>
            </div>
          </div>
        </div>

        {/* Operational Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2 text-slate-700">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{station.openingHours}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>150 kW Max Output</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span>{station.rating} Rating (120+ reviews)</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Est. Wait: <strong>{station.estimatedWaitMin} min</strong></span>
          </div>
        </div>
      </div>

      {/* Charger List Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Select Charger</h2>
          <span className="text-xs text-slate-500 font-medium">Click "Book Charger" to reserve slot</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {chargers.map((chg) => (
            <ChargerCard key={chg.id} charger={chg} onBook={handleBook} />
          ))}
        </div>
      </div>

    </div>
  );
};
