import { ServiceNode } from '../types';
import { LeaderElectionManager } from './LeaderElection';
import { LogicalClockManager } from './LogicalClock';

export class NodeClusterManager {
  private static instance: NodeClusterManager;
  private nodes: Map<string, ServiceNode> = new Map();

  private constructor() {
    this.initNodes();
  }

  public static getInstance(): NodeClusterManager {
    if (!NodeClusterManager.instance) {
      NodeClusterManager.instance = new NodeClusterManager();
    }
    return NodeClusterManager.instance;
  }

  private initNodes() {
    const initialNodes: ServiceNode[] = [
      {
        nodeId: 'Node-01-Booking',
        serviceName: 'Booking Orchestration Service',
        host: '192.168.1.101',
        port: 8081,
        status: 'HEALTHY',
        isLeader: false,
        heartbeatPingMs: 4,
        lamportClock: 12,
        vectorClock: { 'Node-01-Booking': 12, 'Node-02-Station': 8, 'Node-03-Payment': 5, 'Node-04-Routing': 14 },
        activeRequests: 3,
      },
      {
        nodeId: 'Node-02-Station',
        serviceName: 'Station & Charger Telemetry Service',
        host: '192.168.1.102',
        port: 8082,
        status: 'HEALTHY',
        isLeader: false,
        heartbeatPingMs: 6,
        lamportClock: 18,
        vectorClock: { 'Node-01-Booking': 12, 'Node-02-Station': 18, 'Node-03-Payment': 5, 'Node-04-Routing': 14 },
        activeRequests: 12,
      },
      {
        nodeId: 'Node-03-Payment',
        serviceName: 'Payment & Billing Saga Service',
        host: '192.168.1.103',
        port: 8083,
        status: 'HEALTHY',
        isLeader: false,
        heartbeatPingMs: 9,
        lamportClock: 15,
        vectorClock: { 'Node-01-Booking': 12, 'Node-02-Station': 18, 'Node-03-Payment': 15, 'Node-04-Routing': 14 },
        activeRequests: 1,
      },
      {
        nodeId: 'Node-04-Routing',
        serviceName: 'Trip Route Recommendation Service',
        host: '192.168.1.104',
        port: 8084,
        status: 'HEALTHY',
        isLeader: true,
        heartbeatPingMs: 3,
        lamportClock: 22,
        vectorClock: { 'Node-01-Booking': 12, 'Node-02-Station': 18, 'Node-03-Payment': 15, 'Node-04-Routing': 22 },
        activeRequests: 5,
      },
    ];

    for (const node of initialNodes) {
      this.nodes.set(node.nodeId, node);
    }
  }

  public getNodes(): ServiceNode[] {
    const leaderId = LeaderElectionManager.getInstance().getLeaderId();
    const globalClock = LogicalClockManager.getInstance().getLamportTime();
    const globalVector = LogicalClockManager.getInstance().getVectorClock();

    const nodeList = Array.from(this.nodes.values());
    for (const n of nodeList) {
      n.isLeader = (n.nodeId === leaderId);
      n.lamportClock = globalClock + Math.floor(Math.random() * 3);
      n.vectorClock = { ...globalVector };
      if (n.status === 'HEALTHY') {
        n.heartbeatPingMs = 3 + Math.floor(Math.random() * 8);
      }
    }

    return nodeList;
  }

  public updateNodeStatus(nodeId: string, status: 'HEALTHY' | 'DEGRADED' | 'FAILED' | 'RECOVERING'): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.status = status;
      if (status === 'FAILED') {
        node.heartbeatPingMs = 999;
      }
    }
  }
}
