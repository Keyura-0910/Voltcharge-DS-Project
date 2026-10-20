import { Router } from 'express';
import { dataStore } from '../services/dataStore';
import { SagaOrchestrator } from '../distributed/SagaOrchestrator';
import { DistributedLockManager } from '../distributed/DistributedLockManager';
import { LeaderElectionManager } from '../distributed/LeaderElection';
import { NodeClusterManager } from '../distributed/NodeCluster';
import { EventBusBroker } from '../distributed/EventBus';
import { FaultInjectorEngine } from '../distributed/FaultInjector';
import { LogicalClockManager } from '../distributed/LogicalClock';

export const apiRouter = Router();

// Auth User Profile
apiRouter.get('/auth/me', (req, res) => {
  res.json({ user: dataStore.users[0], vehicles: dataStore.vehicles });
});

// Stations list & filter
apiRouter.get('/stations', (req, res) => {
  const { search, availableNow, fastCharging, lowCost } = req.query;
  let result = [...dataStore.stations];

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));
  }

  if (availableNow === 'true') {
    result = result.filter(s => s.availableChargers > 0);
  }

  if (fastCharging === 'true') {
    result = result.filter(s => s.pricePerKwh >= 12);
  }

  if (lowCost === 'true') {
    result = result.filter(s => s.pricePerKwh <= 12);
  }

  res.json(result);
});

apiRouter.get('/stations/:id', (req, res) => {
  const station = dataStore.stations.find(s => s.id === req.params.id);
  if (!station) return res.status(404).json({ error: 'Station not found' });

  const stationChargers = dataStore.chargers.filter(c => c.stationId === station.id);
  res.json({ ...station, chargers: stationChargers });
});

// Chargers by station
apiRouter.get('/chargers', (req, res) => {
  const stationId = req.query.stationId as string;
  if (stationId) {
    return res.json(dataStore.chargers.filter(c => c.stationId === stationId));
  }
  res.json(dataStore.chargers);
});

// Create Booking with Saga & Mutual Exclusion Lock
apiRouter.post('/bookings', async (req, res) => {
  const { stationId, chargerId, date, timeSlot } = req.body;

  const station = dataStore.stations.find(s => s.id === stationId);
  const charger = dataStore.chargers.find(c => c.id === chargerId);

  if (!station || !charger) {
    return res.status(400).json({ success: false, message: 'Invalid station or charger selection.' });
  }

  // Check fault injector for simulated payment failure or lock contention
  const faultStatus = FaultInjectorEngine.getInstance().getStatus();
  const simulateFail = faultStatus.simulatedPaymentFailure;

  const bookingId = `bk_${Date.now()}`;

  // Execute Saga with Distributed Lock Manager
  const sagaOrchestrator = SagaOrchestrator.getInstance();
  const sagaResult = await sagaOrchestrator.executeBookingSaga(
    bookingId,
    'usr_01',
    chargerId,
    simulateFail
  );

  if (!sagaResult.success) {
    if (charger.status !== 'Available') {
      return res.json({
        success: false,
        occupied: true,
        message: 'This charger is no longer available.',
      });
    }

    return res.json({
      success: false,
      message: sagaResult.userMessage,
    });
  }

  // Update DataStore state
  charger.status = 'Reserved';

  const newBooking = {
    id: bookingId,
    userId: 'usr_01',
    stationId,
    chargerId,
    stationName: station.name,
    chargerName: charger.name,
    date: date || 'Today',
    timeSlot: timeSlot || '10:30 AM',
    estimatedCost: 420,
    status: 'Confirmed' as const,
    createdAt: new Date().toLocaleTimeString(),
    lamportTimestamp: LogicalClockManager.getInstance().getLamportTime(),
    vectorClock: LogicalClockManager.getInstance().getVectorClock(),
  };

  dataStore.bookings.unshift(newBooking);

  // Add payment record
  dataStore.payments.unshift({
    id: `pay_${Date.now()}`,
    userId: 'usr_01',
    bookingId: newBooking.id,
    stationName: station.name,
    amount: 420,
    date: new Date().toISOString().split('T')[0],
    status: 'Paid',
    method: 'Credit Card / UPI',
    transactionId: `TXN_${Math.floor(Math.random() * 8999999 + 1000000)}`,
  });

  EventBusBroker.getInstance().publishEvent(
    'Node-01-Booking',
    'Node-02-Station',
    'BOOKING_CONFIRMED',
    `Charger ${charger.name} reserved for booking ${bookingId}.`,
    'Unit II: Inter-Service RPC'
  );

  res.json({
    success: true,
    message: 'Charger reserved successfully.',
    booking: newBooking,
  });
});

// Bookings List
apiRouter.get('/bookings', (req, res) => {
  res.json(dataStore.bookings);
});

// Queue Management
apiRouter.get('/queue', (req, res) => {
  res.json(dataStore.queueEntries);
});

apiRouter.post('/queue/join', (req, res) => {
  const { stationId } = req.body;
  const station = dataStore.stations.find(s => s.id === stationId) || dataStore.stations[0];

  const existing = dataStore.queueEntries.find(q => q.userId === 'usr_01' && q.status === 'Waiting');
  if (existing) {
    return res.json({ success: true, queue: existing });
  }

  const newQueueEntry = {
    id: `q_${Date.now()}`,
    userId: 'usr_01',
    userName: 'Alex Johnson',
    stationId: station.id,
    stationName: station.name,
    position: 3,
    estimatedWaitMinutes: 18,
    peopleAhead: 2,
    status: 'Waiting' as const,
    timestamp: new Date().toLocaleTimeString(),
  };

  dataStore.queueEntries.push(newQueueEntry);

  EventBusBroker.getInstance().publishEvent(
    'Node-01-Booking',
    'Node-02-Station',
    'QUEUE_JOIN',
    `User joined waiting list for ${station.name}. Position #3.`,
    'Unit III: Distributed Queue Synchronization'
  );

  res.json({ success: true, queue: newQueueEntry });
});

apiRouter.post('/queue/leave', (req, res) => {
  dataStore.queueEntries = dataStore.queueEntries.filter(q => q.userId !== 'usr_01');
  res.json({ success: true, message: 'You have left the waiting list.' });
});

// Live Charging Telemetry
apiRouter.get('/charging/current', (req, res) => {
  const session = dataStore.chargingSessions.find(s => s.userId === 'usr_01' && s.status === 'Charging');
  res.json({ session: session || null });
});

// Route Recommendation Algorithm
apiRouter.post('/route-recommendation', (req, res) => {
  const { currentLocation, destination, currentBattery } = req.body;

  const recommendation = {
    station: dataStore.stations[0],
    distanceKm: 2.4,
    availableChargers: 4,
    estimatedWaitMin: 5,
    reasons: [
      'Fast charging (150 kW CCS2 available)',
      'Low waiting time (only 5 minutes estimated)',
      'Convenient location directly on your trip route',
    ],
  };

  res.json(recommendation);
});

// Vehicles
apiRouter.get('/vehicles', (req, res) => {
  res.json(dataStore.vehicles);
});

// Notifications
apiRouter.get('/notifications', (req, res) => {
  res.json(dataStore.notifications);
});

// Payments
apiRouter.get('/payments', (req, res) => {
  res.json(dataStore.payments);
});

// Maintenance API (Operator)
apiRouter.get('/maintenance/chargers', (req, res) => {
  const issueChargers = dataStore.chargers.filter(c => c.status === 'Needs Attention' || c.status === 'Offline');
  res.json(issueChargers);
});

apiRouter.post('/maintenance/chargers/:id/repair', (req, res) => {
  const charger = dataStore.chargers.find(c => c.id === req.params.id);
  if (!charger) return res.status(404).json({ error: 'Charger not found' });

  charger.status = 'Available';
  charger.issueDescription = undefined;
  charger.lastMaintained = new Date().toISOString().split('T')[0];

  EventBusBroker.getInstance().publishEvent(
    'Node-02-Station',
    'Node-01-Booking',
    'CHARGER_REPAIRED',
    `Charger ${charger.name} marked as Repaired and Available.`,
    'Unit II: Event State Synchronization'
  );

  res.json({ success: true, charger });
});

// ACADEMIC VIVA DEMONSTRATION PROTECTED ROUTE (/admin/system)
apiRouter.get('/admin/system', (req, res) => {
  const nodes = NodeClusterManager.getInstance().getNodes();
  const leaderId = LeaderElectionManager.getInstance().getLeaderId();
  const clock = LogicalClockManager.getInstance();
  const lockMgr = DistributedLockManager.getInstance();
  const sagaOrchestrator = SagaOrchestrator.getInstance();
  const eventBus = EventBusBroker.getInstance();
  const faultEngine = FaultInjectorEngine.getInstance();

  res.json({
    nodes,
    leaderId,
    lamportClock: clock.getLamportTime(),
    vectorClock: clock.getVectorClock(),
    locks: lockMgr.getAllLocks(),
    sagas: sagaOrchestrator.getAllSagas(),
    recentEvents: eventBus.getRecentLogs(50),
    faultStatus: faultEngine.getStatus(),
  });
});

// Fault Injection Trigger Routes (Admin/Viva Demo Only)
apiRouter.post('/admin/fault-inject/node-crash', (req, res) => {
  const { nodeId } = req.body;
  const result = FaultInjectorEngine.getInstance().toggleNodeCrash(nodeId || 'Node-04-Routing');
  res.json(result);
});

apiRouter.post('/admin/fault-inject/payment-fail', (req, res) => {
  const active = FaultInjectorEngine.getInstance().togglePaymentFailure();
  res.json({ active, message: `Simulated Payment Saga Failure: ${active ? 'ENABLED' : 'DISABLED'}` });
});

apiRouter.post('/admin/fault-inject/clock-skew', (req, res) => {
  const { skewMs } = req.body;
  FaultInjectorEngine.getInstance().setClockSkew(skewMs || 500);
  res.json({ success: true, message: `Clock skew offset set to +${skewMs || 500}ms` });
});

apiRouter.post('/admin/fault-inject/lock-contention', (req, res) => {
  const active = FaultInjectorEngine.getInstance().toggleLockContention();
  res.json({ active, message: `Lock Contention: ${active ? 'ENABLED' : 'DISABLED'}` });
});
