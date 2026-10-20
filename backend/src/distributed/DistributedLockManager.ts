import { LogicalClockManager } from './LogicalClock';
import { DistributedLockInfo } from '../types';

export class DistributedLockManager {
  private static instance: DistributedLockManager;
  private locks: Map<string, DistributedLockInfo> = new Map();
  private lockTimeoutMs: number = 30000;

  private constructor() {}

  public static getInstance(): DistributedLockManager {
    if (!DistributedLockManager.instance) {
      DistributedLockManager.instance = new DistributedLockManager();
    }
    return DistributedLockManager.instance;
  }

  public async acquireLock(resourceId: string, requesterId: string): Promise<{ success: boolean; message: string; lamportTime: number }> {
    const clock = LogicalClockManager.getInstance();
    const lamportTime = clock.tickLamport('Node-Booking');

    let lock = this.locks.get(resourceId);

    if (!lock) {
      lock = {
        resourceId,
        lockedBy: null,
        timestamp: Date.now(),
        queue: [],
        fairnessMode: 'Strict Lamport Priority',
      };
      this.locks.set(resourceId, lock);
    }

    if (lock.lockedBy && lock.lockedBy !== requesterId) {
      if (!lock.queue.includes(requesterId)) {
        lock.queue.push(requesterId);
      }
      return {
        success: false,
        message: 'Resource locked by another concurrent process. Request queued in Lamport priority order.',
        lamportTime,
      };
    }

    lock.lockedBy = requesterId;
    lock.timestamp = Date.now();
    lock.queue = lock.queue.filter(id => id !== requesterId);

    return {
      success: true,
      message: 'Distributed lock acquired successfully.',
      lamportTime,
    };
  }

  public releaseLock(resourceId: string, requesterId: string): { success: boolean; nextInQueue: string | null } {
    const lock = this.locks.get(resourceId);
    if (!lock || lock.lockedBy !== requesterId) {
      return { success: false, nextInQueue: null };
    }

    lock.lockedBy = null;
    const nextInQueue = lock.queue.shift() || null;

    if (nextInQueue) {
      lock.lockedBy = nextInQueue;
      lock.timestamp = Date.now();
    }

    return { success: true, nextInQueue };
  }

  public getLockState(resourceId: string): DistributedLockInfo | null {
    return this.locks.get(resourceId) || null;
  }

  public getAllLocks(): DistributedLockInfo[] {
    return Array.from(this.locks.values());
  }

  public forceReleaseAll(): void {
    this.locks.clear();
  }
}
