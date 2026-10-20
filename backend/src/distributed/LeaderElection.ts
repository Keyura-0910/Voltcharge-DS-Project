import { LogicalClockManager } from './LogicalClock';

export interface ClusterNodeInfo {
  id: string;
  name: string;
  priority: number;
  isLeader: boolean;
  isAlive: boolean;
  lastHeartbeat: number;
}

export class LeaderElectionManager {
  private static instance: LeaderElectionManager;
  private nodes: Map<string, ClusterNodeInfo> = new Map();
  private currentLeaderId: string = 'Node-04-Routing';

  private constructor() {
    this.initCluster();
  }

  public static getInstance(): LeaderElectionManager {
    if (!LeaderElectionManager.instance) {
      LeaderElectionManager.instance = new LeaderElectionManager();
    }
    return LeaderElectionManager.instance;
  }

  private initCluster() {
    const defaultNodes: ClusterNodeInfo[] = [
      { id: 'Node-01-Booking', name: 'Booking Orchestrator', priority: 1, isLeader: false, isAlive: true, lastHeartbeat: Date.now() },
      { id: 'Node-02-Station', name: 'Station Telemetry Service', priority: 2, isLeader: false, isAlive: true, lastHeartbeat: Date.now() },
      { id: 'Node-03-Payment', name: 'Payment Gateway Proxy', priority: 3, isLeader: false, isAlive: true, lastHeartbeat: Date.now() },
      { id: 'Node-04-Routing', name: 'Primary Coordinator Node', priority: 4, isLeader: true, isAlive: true, lastHeartbeat: Date.now() },
    ];

    for (const node of defaultNodes) {
      this.nodes.set(node.id, node);
    }
  }

  public triggerElection(initiatedBy: string): { newLeaderId: string; electionLogs: string[] } {
    const clock = LogicalClockManager.getInstance();
    clock.tickLamport('Node-Booking');

    const logs: string[] = [];
    logs.push(`[Bully Election] Node '${initiatedBy}' detected leader timeout. Initiating election protocol.`);

    const aliveNodes = Array.from(this.nodes.values()).filter(n => n.isAlive);
    aliveNodes.sort((a, b) => b.priority - a.priority);

    if (aliveNodes.length === 0) {
      logs.push(`[Bully Election] ERROR: No alive nodes available to elect.`);
      return { newLeaderId: '', electionLogs: logs };
    }

    const newLeader = aliveNodes[0];
    
    for (const node of this.nodes.values()) {
      node.isLeader = (node.id === newLeader.id);
      if (node.id === newLeader.id) {
        logs.push(`[Bully Election] Node '${node.id}' (Priority ${node.priority}) sent VICTORY message to all lower nodes.`);
      }
    }

    this.currentLeaderId = newLeader.id;
    logs.push(`[Bully Election] New cluster coordinator elected: '${newLeader.id}' (${newLeader.name}).`);

    return {
      newLeaderId: newLeader.id,
      electionLogs: logs,
    };
  }

  public simulateNodeCrash(nodeId: string): { logs: string[] } {
    const node = this.nodes.get(nodeId);
    if (!node) return { logs: [`Node ${nodeId} not found`] };

    node.isAlive = false;
    node.isLeader = false;

    const logs: string[] = [`[Fault Injector] Node '${nodeId}' marked as CRASHED/DOWN.`];

    if (this.currentLeaderId === nodeId) {
      logs.push(`[Fault Injector] Leader node '${nodeId}' crashed! Triggering immediate Bully Election.`);
      const electionResult = this.triggerElection('Node-01-Booking');
      logs.push(...electionResult.electionLogs);
    }

    return { logs };
  }

  public recoverNode(nodeId: string): { logs: string[] } {
    const node = this.nodes.get(nodeId);
    if (!node) return { logs: [`Node ${nodeId} not found`] };

    node.isAlive = true;
    node.lastHeartbeat = Date.now();
    const logs: string[] = [`[Cluster Management] Node '${nodeId}' recovered and back ONLINE.`];

    const currentLeader = this.nodes.get(this.currentLeaderId);
    if (currentLeader && node.priority > currentLeader.priority) {
      logs.push(`[Bully Election] Recovered node '${nodeId}' has higher priority than current leader '${currentLeader.id}'. Initiating election.`);
      const result = this.triggerElection(nodeId);
      logs.push(...result.electionLogs);
    }

    return { logs };
  }

  public getNodes(): ClusterNodeInfo[] {
    return Array.from(this.nodes.values());
  }

  public getLeaderId(): string {
    return this.currentLeaderId;
  }
}
