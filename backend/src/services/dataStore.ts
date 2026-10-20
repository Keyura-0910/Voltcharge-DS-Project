import { Station, Charger, Booking, QueueEntry, ChargingSession, Payment, Vehicle, NotificationItem, User } from '../types/index.js';

class DataStore {
  private static instance: DataStore;

  public users: User[] = [
    { id: 'usr_01', name: 'Alex Johnson', email: 'alex.johnson@example.com', role: 'customer', currentVehicleId: 'veh_01' },
    { id: 'usr_operator', name: 'Sam Miller', email: 'operator@pune-charging.com', role: 'operator' },
    { id: 'usr_admin', name: 'Prof. Davis (Admin)', email: 'admin@ev-platform.org', role: 'admin' },
  ];

  public vehicles: Vehicle[] = [
    { id: 'veh_01', userId: 'usr_01', make: 'Tata Motors', model: 'Nexon EV Max', batteryCapacityKwh: 40.5, currentBatteryPercent: 68, connectorType: 'CCS2', licensePlate: 'MH 12 EV 8892' },
    { id: 'veh_02', userId: 'usr_01', make: 'MG Motor', model: 'ZS EV', batteryCapacityKwh: 50.3, currentBatteryPercent: 42, connectorType: 'CCS2', licensePlate: 'MH 14 AB 1234' },
  ];

  public stations: Station[] = [
    {
      id: 'stn_01',
      name: 'Pune Central Charging Hub',
      address: '78 MG Road, Shivajinagar, Pune, Maharashtra 411005',
      city: 'Pune',
      distanceKm: 2.4,
      openingHours: 'Open 24/7',
      totalChargers: 8,
      availableChargers: 4,
      pricePerKwh: 12,
      rating: 4.8,
      estimatedWaitMin: 5,
      coordinates: { lat: 18.5204, lng: 73.8567 },
    },
    {
      id: 'stn_02',
      name: 'Viman Nagar Fast Supercharger',
      address: 'Near Phoenix Marketcity, Viman Nagar, Pune 411014',
      city: 'Pune',
      distanceKm: 6.1,
      openingHours: 'Open 24/7',
      totalChargers: 6,
      availableChargers: 2,
      pricePerKwh: 14,
      rating: 4.6,
      estimatedWaitMin: 12,
      coordinates: { lat: 18.5679, lng: 73.9143 },
    },
    {
      id: 'stn_03',
      name: 'Kothrud EcoStation',
      address: 'Paud Road, Kothrud, Pune 411038',
      city: 'Pune',
      distanceKm: 4.8,
      openingHours: '6:00 AM - 11:00 PM',
      totalChargers: 4,
      availableChargers: 0,
      pricePerKwh: 10,
      rating: 4.4,
      estimatedWaitMin: 22,
      coordinates: { lat: 18.5074, lng: 73.8077 },
    },
    {
      id: 'stn_04',
      name: 'Baner Tech Hub EV Plaza',
      address: 'High Street, Baner, Pune 411045',
      city: 'Pune',
      distanceKm: 8.3,
      openingHours: 'Open 24/7',
      totalChargers: 10,
      availableChargers: 7,
      pricePerKwh: 13,
      rating: 4.9,
      estimatedWaitMin: 0,
      coordinates: { lat: 18.5590, lng: 73.7868 },
    },
  ];

  public chargers: Charger[] = [
    { id: 'chg_01', stationId: 'stn_01', name: 'Charger 01', status: 'Available', powerKw: 150, connectorType: 'CCS2', pricePerKwh: 12 },
    { id: 'chg_02', stationId: 'stn_01', name: 'Charger 02', status: 'Charging', powerKw: 150, connectorType: 'CCS2', pricePerKwh: 12, currentBatteryPercent: 82, currentSessionId: 'ses_01' },
    { id: 'chg_03', stationId: 'stn_01', name: 'Charger 03', status: 'Available', powerKw: 60, connectorType: 'Type 2', pricePerKwh: 12 },
    { id: 'chg_04', stationId: 'stn_01', name: 'Charger 04', status: 'Needs Attention', powerKw: 60, connectorType: 'CCS2', pricePerKwh: 12, issueDescription: 'Charging connector latch mechanism error reported.', lastMaintained: '2026-08-20' },
    { id: 'chg_05', stationId: 'stn_01', name: 'Charger 05', status: 'Available', powerKw: 120, connectorType: 'CCS2', pricePerKwh: 12 },
    { id: 'chg_06', stationId: 'stn_01', name: 'Charger 06', status: 'Available', powerKw: 120, connectorType: 'CCS2', pricePerKwh: 12 },
    { id: 'chg_07', stationId: 'stn_01', name: 'Charger 07', status: 'Reserved', powerKw: 60, connectorType: 'Type 2', pricePerKwh: 12 },
    { id: 'chg_08', stationId: 'stn_01', name: 'Charger 08', status: 'Offline', powerKw: 150, connectorType: 'CCS2', pricePerKwh: 12 },
  ];

  public bookings: Booking[] = [
    {
      id: 'bk_101',
      userId: 'usr_01',
      stationId: 'stn_01',
      chargerId: 'chg_01',
      stationName: 'Pune Central Charging Hub',
      chargerName: 'Charger 01',
      date: 'Today',
      timeSlot: '10:30 AM - 11:30 AM',
      estimatedCost: 420,
      status: 'Confirmed',
      createdAt: '2026-08-27 09:15 AM',
      lamportTimestamp: 104,
    },
    {
      id: 'bk_100',
      userId: 'usr_01',
      stationId: 'stn_02',
      chargerId: 'chg_02',
      stationName: 'Viman Nagar Fast Supercharger',
      chargerName: 'Charger 02',
      date: '2026-08-25',
      timeSlot: '04:00 PM - 05:00 PM',
      estimatedCost: 350,
      status: 'Completed',
      createdAt: '2026-08-25 03:30 PM',
      lamportTimestamp: 88,
    },
  ];

  public queueEntries: QueueEntry[] = [
    {
      id: 'q_01',
      userId: 'usr_01',
      userName: 'Alex Johnson',
      stationId: 'stn_03',
      stationName: 'Kothrud EcoStation',
      position: 3,
      estimatedWaitMinutes: 18,
      peopleAhead: 2,
      status: 'Waiting',
      timestamp: '11:45 AM',
    },
  ];

  public chargingSessions: ChargingSession[] = [
    {
      id: 'ses_01',
      bookingId: 'bk_101',
      userId: 'usr_01',
      stationId: 'stn_01',
      chargerId: 'chg_01',
      stationName: 'Pune Central Charging Hub',
      chargerName: 'Charger C01',
      batteryPercent: 68,
      energyDeliveredKwh: 24.6,
      chargingPowerKw: 118,
      timeElapsedMinutes: 18,
      estimatedRemainingMinutes: 12,
      costSoFar: 295,
      status: 'Charging',
      startTime: '11:30 AM',
    },
  ];

  public payments: Payment[] = [
    {
      id: 'pay_901',
      userId: 'usr_01',
      bookingId: 'bk_101',
      stationName: 'Pune Central Charging Hub',
      amount: 420,
      date: '2026-08-27',
      status: 'Paid',
      method: 'UPI / Credit Card',
      transactionId: 'TXN_8819203910',
    },
    {
      id: 'pay_900',
      userId: 'usr_01',
      bookingId: 'bk_100',
      stationName: 'Viman Nagar Fast Supercharger',
      amount: 350,
      date: '2026-08-25',
      status: 'Paid',
      method: 'EV Wallet',
      transactionId: 'TXN_7721839211',
    },
  ];

  public notifications: NotificationItem[] = [
    {
      id: 'notif_01',
      userId: 'usr_01',
      title: 'Booking Confirmed',
      message: 'Your slot at Pune Central Charging Hub (Charger 01) is confirmed for 10:30 AM.',
      timestamp: '10 mins ago',
      read: false,
      type: 'success',
    },
    {
      id: 'notif_02',
      userId: 'usr_01',
      title: 'Charging Progress',
      message: 'Vehicle battery reached 68%. Estimated 12 mins remaining.',
      timestamp: ' Just now',
      read: false,
      type: 'info',
    },
  ];

  private constructor() {}

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }
}

export const dataStore = DataStore.getInstance();
