import React, { createContext, useContext, useState, useEffect } from 'react';
import { Station, Charger, Booking, QueueEntry, ChargingSession, Payment, Vehicle, NotificationItem } from '../types';

interface EVDataContextType {
  stations: Station[];
  chargers: Charger[];
  bookings: Booking[];
  queueEntries: QueueEntry[];
  currentSession: ChargingSession | null;
  payments: Payment[];
  vehicles: Vehicle[];
  notifications: NotificationItem[];
  loading: boolean;
  fetchStations: (params?: Record<string, string>) => Promise<void>;
  createBooking: (stationId: string, chargerId: string, date?: string, timeSlot?: string) => Promise<{ success: boolean; message: string; occupied?: boolean }>;
  joinQueue: (stationId: string) => Promise<void>;
  leaveQueue: () => Promise<void>;
  repairCharger: (chargerId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EVDataContext = createContext<EVDataContextType | undefined>(undefined);

export const EVDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [currentSession, setCurrentSession] = useState<ChargingSession | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [stnRes, bkRes, qRes, payRes, vehRes, notifRes, chgRes, sesRes] = await Promise.all([
        fetch('/api/stations').then(r => r.json()),
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/queue').then(r => r.json()),
        fetch('/api/payments').then(r => r.json()),
        fetch('/api/vehicles').then(r => r.json()),
        fetch('/api/notifications').then(r => r.json()),
        fetch('/api/chargers').then(r => r.json()),
        fetch('/api/charging/current').then(r => r.json()),
      ]);

      setStations(stnRes || []);
      setBookings(bkRes || []);
      setQueueEntries(qRes || []);
      setPayments(payRes || []);
      setVehicles(vehRes || []);
      setNotifications(notifRes || []);
      setChargers(chgRes || []);
      setCurrentSession(sesRes?.session || null);
    } catch (e) {
      console.error('Failed to fetch EV data from backend:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async (params?: Record<string, string>) => {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`/api/stations${query}`);
      const data = await res.json();
      setStations(data || []);
    } catch (e) {
      console.error('Failed to search stations:', e);
    }
  };

  const createBooking = async (stationId: string, chargerId: string, date?: string, timeSlot?: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId, chargerId, date, timeSlot }),
      });
      const data = await res.json();
      await refreshData();
      return data;
    } catch (e) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const joinQueue = async (stationId: string) => {
    try {
      await fetch('/api/queue/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationId }),
      });
      await refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const leaveQueue = async () => {
    try {
      await fetch('/api/queue/leave', { method: 'POST' });
      await refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const repairCharger = async (chargerId: string) => {
    try {
      await fetch(`/api/maintenance/chargers/${chargerId}/repair`, { method: 'POST' });
      await refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <EVDataContext.Provider
      value={{
        stations,
        chargers,
        bookings,
        queueEntries,
        currentSession,
        payments,
        vehicles,
        notifications,
        loading,
        fetchStations,
        createBooking,
        joinQueue,
        leaveQueue,
        repairCharger,
        refreshData,
      }}
    >
      {children}
    </EVDataContext.Provider>
  );
};

export const useEVData = () => {
  const context = useContext(EVDataContext);
  if (!context) throw new Error('useEVData must be used within EVDataProvider');
  return context;
};
