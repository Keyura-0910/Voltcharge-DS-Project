/**
 * Unit III: Clock Synchronization & Logical Clocks
 * Implements Lamport Timestamps & Vector Clocks for causal ordering across microservices.
 */

export class LogicalClockManager {
  private static instance: LogicalClockManager;
  private lamportClock: number = 0;
  private nodes: string[] = ['Node-Booking', 'Node-Station', 'Node-Payment', 'Node-Routing'];
  private vectorClock: Record<string, number> = {
    'Node-Booking': 0,
    'Node-Station': 0,
    'Node-Payment': 0,
    'Node-Routing': 0,
  };

  private constructor() {}

  public static getInstance(): LogicalClockManager {
    if (!LogicalClockManager.instance) {
      LogicalClockManager.instance = new LogicalClockManager();
    }
    return LogicalClockManager.instance;
  }

  // Lamport Clock: Increment on local event
  public tickLamport(nodeId: string = 'Node-Booking'): number {
    this.lamportClock += 1;
    this.vectorClock[nodeId] = (this.vectorClock[nodeId] || 0) + 1;
    return this.lamportClock;
  }

  // Lamport Clock: Update on receiving incoming message (L_receive = max(L_local, L_msg) + 1)
  public receiveLamport(incomingTimestamp: number, nodeId: string = 'Node-Booking'): number {
    this.lamportClock = Math.max(this.lamportClock, incomingTimestamp) + 1;
    this.vectorClock[nodeId] = (this.vectorClock[nodeId] || 0) + 1;
    return this.lamportClock;
  }

  // Vector Clock: Receive and merge vector
  public mergeVectorClock(incomingVector: Record<string, number>, nodeId: string): Record<string, number> {
    for (const key of Object.keys(incomingVector)) {
      this.vectorClock[key] = Math.max(this.vectorClock[key] || 0, incomingVector[key] || 0);
    }
    this.vectorClock[nodeId] = (this.vectorClock[nodeId] || 0) + 1;
    return { ...this.vectorClock };
  }

  public getLamportTime(): number {
    return this.lamportClock;
  }

  public getVectorClock(): Record<string, number> {
    return { ...this.vectorClock };
  }

  public applyClockSkew(skewMs: number): void {
    if (skewMs > 0) {
      this.lamportClock += Math.floor(skewMs / 100);
    }
  }
}
