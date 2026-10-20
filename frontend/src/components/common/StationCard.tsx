import React from 'react';
import { Station } from '../../types';
import { MapPin, Clock, Zap, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StationCardProps {
  station: Station;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{station.name}</h3>
            <p className="text-xs text-slate-500 flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
              <span>{station.address}</span>
            </p>
          </div>
          <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-semibold border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{station.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-2.5 rounded-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase">Availability</div>
            <div className="text-sm font-bold text-slate-900 flex items-center mt-0.5">
              <span className={`w-2 h-2 rounded-full mr-2 ${station.availableChargers > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {station.availableChargers} of {station.totalChargers} Available
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl">
            <div className="text-[11px] font-medium text-slate-400 uppercase">Tariff</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              ₹{station.pricePerKwh} / kWh
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700">150 kW Fast Charging</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Est. Wait: <strong className="text-slate-700">{station.estimatedWaitMin} min</strong></span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500">{station.distanceKm} km away</span>
        <button
          onClick={() => navigate(`/stations/${station.id}`)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
        >
          <span>View Station</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
