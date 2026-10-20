import { SystemFaultStatus } from '../types';
import { LeaderElectionManager } from './LeaderElection';
import { NodeClusterManager } from './NodeCluster';
import { EventBusBroker } from './EventBus';
import { LogicalClockManager } from './LogicalClock';

export class FaultInjectorEngine {
  private static instance: FaultInjectorEngine;
  private status: SystemFaultStatus = {
    simulatedNodeCrash: false,
    simulatedNetworkPartition: false,
    simulatedClockSkewMs: 0,
    simulatedLockContention: false,
    simulatedPaymentFailure: false,
  };

  private constructor() {}

  public static getInstance(): FaultInjectorEngine {
    if (!FaultInjectorEngine.instance) {
      FaultInjectorEngine.instance = new FaultInjectorEngine();
    }
    return FaultInjectorEngine.instance;
  }

  public getStatus(): SystemFaultStatus {
    return { ...this.status };
  }

  public toggleNodeCrash(targetNodeId: string = 'Node-04-Routing'): { active: boolean; logs: string[] } {
    const leaderMgr = LeaderElectionManager.getInstance();
    const clusterMgr = NodeClusterManager.getInstance();
    const eventBus = EventBusBroker.getInstance();

    if (!this.status.simulatedNodeCrash) {
      this.status.simulatedNodeCrash = true;
      this.status.crashedNodeId = targetNodeId;

      clusterMgr.updateNodeStatus(targetNodeId, 'FAILED');
      const crashResult = leaderMgr.simulateNodeCrash(targetNodeId);

      eventBus.publishEvent(
        'FaultInjector',
        targetNodeId,
        'FAULT_INJECT_NODE_CRASH',
        `Simulated crash injected on '${targetNodeId}'. Heartbeats interrupted.`,
        'Unit II & III: Fault Tolerance & Leader Election'
      );

      return { active: true, logs: crashResult.logs };
    } else {
      const crashedId = this.status.crashedNodeId || targetNodeId;
      this.status.simulatedNodeCrash = false;
      this.status.crashedNodeId = undefined;

      clusterMgr.updateNodeStatus(crashedId, 'HEALTHY');
      const recoverResult = leaderMgr.recoverNode(crashedId);

      eventBus.publishEvent(
        'FaultInjector',
        crashedId,
        'FAULT_RECOVER_NODE',
        `Node '${crashedId}' recovered. Resumed heartbeats.`,
        'Unit III: Heartbeat Recovery'
      );

      return { active: false, logs: recoverResult.logs };
    }
  }

  public togglePaymentFailure(): boolean {
    this.status.simulatedPaymentFailure = !this.status.simulatedPaymentFailure;
    EventBusBroker.getInstance().publishEvent(
      'FaultInjector',
      'Node-03-Payment',
      'FAULT_INJECT_SAGA_FAIL',
      `Saga payment failure simulation toggled: ${this.status.simulatedPaymentFailure ? 'ENABLED' : 'DISABLED'}`,
      'Unit IV: Saga Pattern Compensation'
    );
    return this.status.simulatedPaymentFailure;
  }

  public setClockSkew(skewMs: number): void {
    this.status.simulatedClockSkewMs = skewMs;
    LogicalClockManager.getInstance().applyClockSkew(skewMs);
    EventBusBroker.getInstance().publishEvent(
      'FaultInjector',
      'Node-01-Booking',
      'FAULT_INJECT_CLOCK_SKEW',
      `Logical clock drift offset set to +${skewMs}ms.`,
      'Unit III: Clock Synchronization'
    );
  }

  public toggleLockContention(): boolean {
    this.status.simulatedLockContention = !this.status.simulatedLockContention;
    EventBusBroker.getInstance().publishEvent(
      'FaultInjector',
      'Node-01-Booking',
      'FAULT_INJECT_LOCK_CONTENTION',
      `Lock contention simulation toggled: ${this.status.simulatedLockContention ? 'ENABLED' : 'DISABLED'}`,
      'Unit III: Mutual Exclusion'
    );
    return this.status.simulatedLockContention;
  }
}
