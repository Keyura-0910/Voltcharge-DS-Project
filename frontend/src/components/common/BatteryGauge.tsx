import React from 'react';
import { Zap } from 'lucide-react';

interface BatteryGaugeProps {
  percent: number;
  chargingPowerKw?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const BatteryGauge: React.FC<BatteryGaugeProps> = ({ percent, chargingPowerKw, size = 'md' }) => {
  const getBatteryColor = (p: number) => {
    if (p > 50) return 'bg-emerald-500 text-emerald-700';
    if (p > 20) return 'bg-amber-500 text-amber-700';
    return 'bg-rose-500 text-rose-700';
  };

  const getBorderColor = (p: number) => {
    if (p > 50) return 'border-emerald-500';
    if (p > 20) return 'border-amber-500';
    return 'border-rose-500';
  };

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center">
        {/* Battery Ring Progress */}
        <div className="relative w-44 h-44 rounded-full border-8 border-slate-100 flex items-center justify-center shadow-inner">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="#e2e8f0"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="88"
              cy="88"
              r="76"
              stroke="#16a34a"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={477}
              strokeDashoffset={477 - (477 * percent) / 100}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="text-center z-10">
            <div className="flex items-center justify-center space-x-1 text-emerald-600 font-bold text-3xl">
              <Zap className="w-7 h-7 fill-current animate-pulse" />
              <span>{percent}%</span>
            </div>
            {chargingPowerKw && (
              <div className="text-xs text-slate-500 font-medium mt-1">
                {chargingPowerKw} kW Charging
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Rectangular Battery Icon */}
      <div className={`w-14 h-7 rounded-md border-2 ${getBorderColor(percent)} p-0.5 relative flex items-center bg-white`}>
        <div
          className={`h-full rounded-sm transition-all duration-500 ${getBatteryColor(percent).split(' ')[0]}`}
          style={{ width: `${percent}%` }}
        />
        {/* Battery Nub */}
        <div className={`absolute -right-2 top-2 bottom-2 w-1.5 rounded-r ${getBorderColor(percent).replace('border', 'bg')}`} />
      </div>
      <span className="font-bold text-slate-900 text-lg">{percent}%</span>
    </div>
  );
};
