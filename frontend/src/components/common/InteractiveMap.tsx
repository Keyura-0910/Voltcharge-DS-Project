import React from 'react';
import { Station } from '../../types';
import { MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InteractiveMapProps {
  stations: Station[];
  selectedStationId?: string;
  onSelectStation?: (stationId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ stations, selectedStationId, onSelectStation }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-80 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
      {/* Background Map Grid Simulation */}
      <svg className="absolute inset-0 w-full h-full stroke-slate-200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Simulated Road Lines */}
        <path d="M 0 120 Q 200 180 400 120 T 800 200" fill="none" stroke="#cbd5e1" strokeWidth="8" />
        <path d="M 250 0 L 250 400" fill="none" stroke="#cbd5e1" strokeWidth="6" />
        <path d="M 500 0 L 500 400" fill="none" stroke="#cbd5e1" strokeWidth="6" />
      </svg>

      {/* User Current Location Indicator */}
      <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="w-5 h-5 rounded-full bg-blue-500 ring-4 ring-blue-100 flex items-center justify-center text-white shadow-md animate-pulse">
          <Navigation className="w-3 h-3 fill-current" />
        </div>
        <span className="mt-1 px-2 py-0.5 text-[10px] font-bold bg-white text-blue-700 rounded-md shadow-sm border border-blue-200">
          Your Location (Alex)
        </span>
      </div>

      {/* Station Map Pins */}
      {stations.map((stn, idx) => {
        // Predefined grid positions for demo map
        const positions = [
          { top: '35%', left: '48%' },
          { top: '25%', left: '72%' },
          { top: '65%', left: '30%' },
          { top: '70%', left: '68%' },
        ];
        const pos = positions[idx % positions.length];
        const isSelected = selectedStationId === stn.id;

        return (
          <div
            key={stn.id}
            style={{ top: pos.top, left: pos.left }}
            onClick={() => {
              if (onSelectStation) onSelectStation(stn.id);
              else navigate(`/stations/${stn.id}`);
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all hover:scale-110 flex flex-col items-center`}
          >
            <div
              className={`px-2.5 py-1.5 rounded-xl shadow-md border flex items-center space-x-1.5 transition-all ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-200'
                  : stn.availableChargers > 0
                  ? 'bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500'
                  : 'bg-white text-rose-600 border-rose-200'
              }`}
            >
              <MapPin className={`w-4 h-4 ${stn.availableChargers > 0 ? 'text-emerald-600' : 'text-rose-500'}`} />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">{stn.name.split(' ')[0]}</div>
                <div className="text-[10px] opacity-80 font-medium">
                  {stn.availableChargers} / {stn.totalChargers} Avail • ₹{stn.pricePerKwh}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Control Bar Overlay */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 shadow-sm z-30">
        Map View: Shivajinagar & Pune Metro Area
      </div>
    </div>
  );
};
