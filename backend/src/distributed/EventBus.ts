import { SystemEventLog } from '../types';
import { LogicalClockManager } from './LogicalClock';

export class EventBusBroker {
  private static instance: EventBusBroker;
  private logs: SystemEventLog[] = [];
  private maxLogs: number = 100;

  private constructor() {
    this.seedInitialLogs();
  }

  public static getInstance(): EventBusBroker {
    if (!EventBusBroker.instance) {
      EventBusBroker.instance = new EventBusBroker();
    }
    return EventBusBroker.instance;
  }

  private seedInitialLogs() {
    this.publishEvent('Node-04-Routing', 'Node-01-Booking', 'SYSTEM_BOOT', 'Distributed microservice cluster initialized successfully.', 'Unit I: Distributed Systems Architecture');
    this.publishEvent('Node-01-Booking', 'Node-02-Station', 'MUTUAL_EXCLUSION_INIT', 'Fair distributed lock manager registered for station chargers.', 'Unit III: Fair Mutual Exclusion');
    this.publishEvent('Node-04-Routing', 'Node-ALL', 'BEACON_HEARTBEAT', 'Leader node sent periodic beacon broadcast ping.', 'Unit III: Beacon Protocol & Heartbeats');
  }

  public publishEvent(
    originNode: string,
    targetNode: string,
    eventType: string,
    details: string,
    academicTag: string
  ): SystemEventLog {
    const clockMgr = LogicalClockManager.getInstance();
    const lamportTimestamp = clockMgr.tickLamport(originNode);
    const vectorClock = clockMgr.getVectorClock();

    const eventLog: SystemEventLog = {
      id: `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      lamportTimestamp,
      vectorClock,
      originNode,
      targetNode,
      eventType,
      details,
      academicTag,
      timestamp: new Date().toLocaleTimeString(),
    };

    this.logs.unshift(eventLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    return eventLog;
  }

  public getRecentLogs(limit: number = 50): SystemEventLog[] {
    return this.logs.slice(0, limit);
  }
}
