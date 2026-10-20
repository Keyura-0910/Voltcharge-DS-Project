import React from 'react';
import { useEVData } from '../../context/EVDataContext';
import { CreditCard, CheckCircle2, AlertCircle, RefreshCw, Clock } from 'lucide-react';

export const Payments: React.FC = () => {
  const { payments } = useEVData();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Paid
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Refunded
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments & Invoices</h1>
        <p className="text-sm text-slate-500 mt-1">Review session billing history and downloaded payment receipts.</p>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Total Spent</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">₹770</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Wallet Balance</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">₹1,450</div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Default Method</div>
          <div className="text-sm font-bold text-slate-900 mt-1">HDFC Visa •••• 4092</div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-900">
          Payment History
        </div>

        <div className="divide-y divide-slate-100">
          {payments.map((p) => (
            <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-base">{p.stationName}</span>
                  {getStatusBadge(p.status)}
                </div>
                <div className="text-xs text-slate-500">
                  Transaction: <span className="font-mono">{p.transactionId}</span> • Method: {p.method}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-6">
                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900">₹{p.amount}</div>
                  <div className="text-[11px] text-slate-400">{p.date}</div>
                </div>

                <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline">
                  Receipt PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
