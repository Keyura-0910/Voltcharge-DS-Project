export type UserRole = 'customer' | 'operator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  currentVehicleId?: string;
}

export type ChargerStatus = 'Available' | 'Charging' | 'Reserved' | 'Needs Attention' | 'Offline';
export type ConnectorType = 'CCS2' | 'Type 2' | 'CHAdeMO';

export interface Charger {
  id: string;
  stationId: string;
  name: string;
  status: ChargerStatus;
  powerKw: number;
  connectorType: ConnectorType;
  pricePerKwh: number;
  currentSessionId?: string;
  currentBatteryPercent?: number;
  issueDescription?: string;
  lastMaintained?: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  distanceKm: number;
  openingHours: string;
  totalChargers: number;
  availableChargers: number;
  pricePerKwh: number;
  rating: number;
  estimatedWaitMin: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Booking {
  id: string;
  userId: string;
  stationId: string;
  chargerId: string;
  stationName: string;
  chargerName: string;
  date: string;
  timeSlot: string;
  estimatedCost: number;
  status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled' | 'Pending';
  createdAt: string;
  vectorClock?: Record<string, number>;
  lamportTimestamp?: number;
}

export interface QueueEntry {
  id: string;
  userId: string;
  userName: string;
  stationId: string;
  stationName: string;
  position: number;
  estimatedWaitMinutes: number;
  peopleAhead: number;
  status: 'Waiting' | 'Ready' | 'Expired';
  assignedChargerId?: string;
  timestamp: string;
}

export interface ChargingSession {
  id: string;
  bookingId?: string;
  userId: string;
  stationId: string;
  chargerId: string;
  stationName: string;
  chargerName: string;
  batteryPercent: number;
  energyDeliveredKwh: number;
  chargingPowerKw: number;
  timeElapsedMinutes: number;
  estimatedRemainingMinutes: number;
  costSoFar: number;
  status: 'Charging' | 'Completed' | 'Interrupted';
  startTime: string;
}

export interface Payment {
  id: string;
  userId: string;
  bookingId: string;
  stationName: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  method: string;
  transactionId: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  batteryCapacityKwh: number;
  currentBatteryPercent: number;
  connectorType: ConnectorType;
  licensePlate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

// Academic / System Diagnostic Interfaces
export interface ServiceNode {
  nodeId: string;
  serviceName: string;
  host: string;
  port: number;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'RECOVERING';
  isLeader: boolean;
  heartbeatPingMs: number;
  lamportClock: number;
  vectorClock: Record<string, number>;
  activeRequests: number;
}

export interface SystemEventLog {
  id: string;
  lamportTimestamp: number;
  vectorClock: Record<string, number>;
  originNode: string;
  targetNode: string;
  eventType: string;
  details: string;
  academicTag: string; // e.g., 'Unit III: Vector Clock', 'Unit II: RPC Message', 'Unit III: Fair Lock'
  timestamp: string;
}

export interface DistributedLockInfo {
  resourceId: string;
  lockedBy: string | null;
  timestamp: number;
  queue: string[];
  fairnessMode: 'Strict Lamport Priority' | 'FIFO Queue';
}

export interface SagaTransaction {
  sagaId: string;
  bookingId: string;
  userId: string;
  chargerId: string;
  currentStep: 'INIT' | 'HOLD_CHARGER' | 'PROCESS_PAYMENT' | 'CONFIRM_RESERVATION' | 'COMPENSATING' | 'FAILED' | 'SUCCESS';
  stepsCompleted: string[];
  compensationLog: string[];
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ROLLED_BACK';
}

export interface SystemFaultStatus {
  simulatedNodeCrash: boolean;
  crashedNodeId?: string;
  simulatedNetworkPartition: boolean;
  simulatedClockSkewMs: number;
  simulatedLockContention: boolean;
  simulatedPaymentFailure: boolean;
}
