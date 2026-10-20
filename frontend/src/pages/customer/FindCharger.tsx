import React, { useState } from 'react';
import { useEVData } from '../../context/EVDataContext';
import { StationCard } from '../../components/common/StationCard';
import { InteractiveMap } from '../../components/common/InteractiveMap';
import { Search, Filter, Map, List, Check } from 'lucide-react';

export const FindCharger: React.FC = () => {
  const { stations, fetchStations } = useEVData();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Filter States
  const [filters, setFilters] = useState({
    availableNow: false,
    fastCharging: false,
    lowCost: false,
    openNow: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStations({
      search: searchTerm,
      availableNow: String(filters.availableNow),
      fastCharging: String(filters.fastCharging),
      lowCost: String(filters.lowCost),
    });
  };

  const toggleFilter = (key: keyof typeof filters) => {
    const updated = { ...filters, [key]: !filters[key] };
    setFilters(updated);
    fetchStations({
      search: searchTerm,
      availableNow: String(updated.availableNow),
      fastCharging: String(updated.fastCharging),
      lowCost: String(updated.lowCost),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Find EV Charger</h1>
          <p className="text-sm text-slate-500 mt-1">
            Search nearby fast charging stations, check live availability, and reserve your slot.
          </p>
        </div>

        {/* List / Map Toggle */}
        <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'map' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Quick Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search location (e.g. Pune Central, Viman Nagar, Shivajinagar)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
          >
            Search
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Filters:
          </span>

          <button
            onClick={() => toggleFilter('availableNow')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1 ${
              filters.availableNow
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filters.availableNow && <Check className="w-3 h-3 text-emerald-600" />}
            <span>Available Now</span>
          </button>

          <button
            onClick={() => toggleFilter('fastCharging')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1 ${
              filters.fastCharging
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filters.fastCharging && <Check className="w-3 h-3 text-emerald-600" />}
            <span>Fast Charging (150 kW)</span>
          </button>

          <button
            onClick={() => toggleFilter('lowCost')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1 ${
              filters.lowCost
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filters.lowCost && <Check className="w-3 h-3 text-emerald-600" />}
            <span>Low Cost (≤ ₹12/kWh)</span>
          </button>
        </div>
      </div>

      {/* Interactive Map View */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <InteractiveMap stations={stations} />
        </div>
      )}

      {/* Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stations.map((stn) => (
          <StationCard key={stn.id} station={stn} />
        ))}
      </div>

    </div>
  );
};
