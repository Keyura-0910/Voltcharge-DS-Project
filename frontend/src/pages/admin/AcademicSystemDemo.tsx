import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../context/WebSocketContext';
import {
  ShieldAlert,
  Cpu,
  Clock,
  Lock,
  RefreshCw,
  Zap,
  Activity,
  AlertTriangle,
  Play,
  CheckCircle2,
  Server,
  Layers,
  FileCode,
} from 'lucide-react';
import { ServiceNode, SystemEventLog, DistributedLockInfo, SagaTransaction, SystemFaultStatus } from '../../types';

export const AcademicSystemDemo: React.FC = () => {
  const { user } = useAuth();
  const { systemEvents: wsEvents } = useWebSocket();

  const [nodes, setNodes] = useState<ServiceNode[]>([]);
  const [leaderId, setLeaderId] = useState<string>('');
  const [lamportClock, setLamportClock] = useState<number>(0);
  const [vectorClock, setVectorClock] = useState<Record<string, number>>({});
  const [locks, setLocks] = useState<DistributedLockInfo[]>([]);
  const [sagas, setSagas] = useState<SagaTransaction[]>([]);
  const [events, setEvents] = useState<SystemEventLog[]>([]);
  const [faultStatus, setFaultStatus] = useState<SystemFaultStatus>({
    simulatedNodeCrash: false,
    simulatedNetworkPartition: false,
    simulatedClockSkewMs: 0,
    simulatedLockContention: false,
    simulatedPaymentFailure: false,
  });

  const [activeTab, setActiveTab] = useState<'matrix' | 'nodes' | 'clocks' | 'locks' | 'sagas' | 'faults'>('matrix');
  const [faultLogs, setFaultLogs] = useState<string[]>([]);

  const fetchDiagnosticData = async () => {
    try {
      const res = await fetch('/api/admin/system');
      const data = await res.json();
      setNodes(data.nodes || []);
      setLeaderId(data.leaderId || '');
      setLamportClock(data.lamportClock || 0);
      setVectorClock(data.vectorClock || {});
      setLocks(data.locks || []);
      setSagas(data.sagas || []);
      if (!wsEvents || wsEvents.length === 0) {
        setEvents(data.recentEvents || []);
      }
      setFaultStatus(data.faultStatus || {});
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDiagnosticData();
    const interval = setInterval(fetchDiagnosticData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (wsEvents && wsEvents.length > 0) {
      setEvents(wsEvents);
    }
  }, [wsEvents]);

  // Fault Control Handlers
  const handleToggleNodeCrash = async () => {
    const res = await fetch('/api/admin/fault-inject/node-crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeId: 'Node-04-Routing' }),
    });
    const data = await res.json();
    setFaultLogs((prev) => [...(data.logs || []), ...prev]);
    fetchDiagnosticData();
  };

  const handleTogglePaymentFailure = async () => {
    const res = await fetch('/api/admin/fault-inject/payment-fail', { method: 'POST' });
    const data = await res.json();
    setFaultLogs((prev) => [data.message, ...prev]);
    fetchDiagnosticData();
  };

  const handleApplyClockSkew = async () => {
    const res = await fetch('/api/admin/fault-inject/clock-skew', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skewMs: 500 }),
    });
    const data = await res.json();
    setFaultLogs((prev) => [data.message, ...prev]);
    fetchDiagnosticData();
  };

  // Restrict access if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center text-rose-800 space-y-4 max-w-xl mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold">Access Denied: Protected Viva Route</h2>
        <p className="text-xs text-rose-700">
          This academic demonstration route (/admin/system) is restricted to Administrators/Professors. Please switch role to Admin using the top navbar role selector.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-800/80 px-3 py-1 rounded-full text-xs font-bold text-purple-200 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
              <span>Academic Demonstration Area (/admin/system)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Distributed Systems Viva Diagnostic Console
            </h1>
            <p className="text-purple-200 text-xs mt-1">
              Hidden from normal customer UI. Exposes Units I–IV algorithms, vector clocks, leader consensus, and saga rollbacks.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-purple-900/90 border border-purple-700 p-4 rounded-2xl">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-purple-300">Lamport Clock</div>
              <div className="text-xl font-extrabold text-amber-300">{lamportClock}</div>
            </div>
            <div className="h-8 w-px bg-purple-700" />
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-purple-300">Leader Node</div>
              <div className="text-xs font-bold text-emerald-400">{leaderId || 'Node-04'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'matrix', label: 'Unit I–IV Syllabus Matrix', icon: Layers },
          { id: 'nodes', label: 'Node Cluster & Leader', icon: Server },
          { id: 'clocks', label: 'Lamport & Vector Clocks', icon: Clock },
          { id: 'locks', label: 'Mutual Exclusion Locks', icon: Lock },
          { id: 'sagas', label: 'Saga Transactions', icon: RefreshCw },
          { id: 'faults', label: 'Fault Simulation Engine', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SYLLABUS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Layers className="w-5 h-5 text-purple-600 mr-2" />
            Distributed Systems Unit I–IV Academic Coverage Matrix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-purple-900 text-sm">Unit I: System Architecture & Computation</h3>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li><strong>Microservice Topology:</strong> 4 decoupled service nodes (Booking, Station, Payment, Routing).</li>
                <li><strong>Virtualization & State Isolation:</strong> In-memory state store with strict API boundaries.</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-purple-900 text-sm">Unit II: Communication & Fault Tolerance</h3>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li><strong>Inter-Service RPC & WebSockets:</strong> Asynchronous event messaging and telemetry streaming.</li>
                <li><strong>Message Brokers & Stream Pub/Sub:</strong> EventBus for event audit trails.</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-purple-900 text-sm">Unit III: Synchronization, Clocks & Locks</h3>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li><strong>Lamport & Vector Clocks:</strong> Causal event ordering across all service messages.</li>
                <li><strong>Bully Leader Election:</strong> Automatic reelection upon primary node timeout.</li>
                <li><strong>Fair Mutual Exclusion:</strong> Distributed locks preventing charger double-bookings.</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
              <h3 className="font-extrabold text-purple-900 text-sm">Unit IV: Distributed Objects & Saga Transactions</h3>
              <ul className="space-y-1 text-slate-700 list-disc list-inside">
                <li><strong>Saga Pattern Orchestration:</strong> Multi-step reservation with automated rollback compensation.</li>
                <li><strong>High Availability Case Study:</strong> Resilient charging grid fault handling.</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: NODE CLUSTER */}
      {activeTab === 'nodes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nodes.map((node) => (
              <div
                key={node.nodeId}
                className={`bg-white border rounded-2xl p-5 shadow-sm space-y-3 ${
                  node.isLeader ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      node.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {node.status}
                  </span>
                  {node.isLeader && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-700 text-white rounded">
                      LEADER NODE
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{node.serviceName}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{node.host}:{node.port}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Heartbeat Ping:</span>
                    <strong className="text-slate-900">{node.heartbeatPingMs} ms</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lamport Counter:</span>
                    <strong className="text-purple-700 font-mono">{node.lamportClock}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LAMPORT & VECTOR CLOCKS */}
      {activeTab === 'clocks' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                Lamport & Vector Clock Event Stream
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Causal order timestamps attached to inter-service messages.</p>
            </div>

            {/* Current Vector Clock Display */}
            <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-xs">
              <span className="font-bold text-purple-900">Current Vector Clock State:</span>
              <pre className="font-mono text-purple-700 mt-0.5">{JSON.stringify(vectorClock)}</pre>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2">
            {events.map((evt) => (
              <div key={evt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px]">
                      L:{evt.lamportTimestamp}
                    </span>
                    <span className="font-semibold text-slate-900">{evt.eventType}</span>
                    <span className="text-slate-400">({evt.originNode} → {evt.targetNode})</span>
                  </div>
                  <div className="text-slate-600">{evt.details}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded">
                    {evt.academicTag}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{evt.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MUTUAL EXCLUSION LOCKS */}
      {activeTab === 'locks' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <Lock className="w-5 h-5 text-purple-600 mr-2" />
            Distributed Lock Manager (Fair Mutual Exclusion)
          </h2>

          <div className="space-y-4">
            {locks.length > 0 ? (
              locks.map((lock) => (
                <div key={lock.resourceId} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Resource Lock ID: <code className="text-purple-700">{lock.resourceId}</code></span>
                    <span className="text-emerald-600">Mode: {lock.fairnessMode}</span>
                  </div>
                  <div className="text-slate-600">
                    Currently Held By: <strong>{lock.lockedBy || 'NONE (Unlocked)'}</strong>
                  </div>
                  <div className="text-slate-500">
                    Lamport Priority Wait Queue: <code className="font-mono">{JSON.stringify(lock.queue)}</code>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No active distributed locks held. All charger locks released.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: SAGA TRANSACTIONS */}
      {activeTab === 'sagas' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <RefreshCw className="w-5 h-5 text-purple-600 mr-2" />
            Saga Transaction Orchestration & Compensating Rollbacks
          </h2>

          <div className="space-y-4">
            {sagas.length > 0 ? (
              sagas.map((saga) => (
                <div key={saga.sagaId} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-slate-900">Saga ID: {saga.sagaId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      saga.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {saga.status}
                    </span>
                  </div>

                  <div>
                    <strong className="text-slate-700">Completed Steps:</strong>
                    <ul className="list-disc list-inside text-slate-600 mt-1">
                      {saga.stepsCompleted.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  {saga.compensationLog.length > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-1">
                      <strong className="font-bold">Compensating Actions Executed (Rollback):</strong>
                      <ul className="list-disc list-inside">
                        {saga.compensationLog.map((c, idx) => (
                          <li key={idx}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No active Saga transactions currently executing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: FAULT SIMULATION */}
      {activeTab === 'faults' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            Live System Fault Simulation Engine (Viva Controls)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Simulate Node Crash</h3>
              <p className="text-xs text-slate-500">Crashes Leader Node-04 and triggers Bully Election protocol.</p>
              <button
                onClick={handleToggleNodeCrash}
                className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all ${
                  faultStatus.simulatedNodeCrash
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {faultStatus.simulatedNodeCrash ? 'Recover Crashed Node' : 'Simulate Node Crash'}
              </button>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Saga Payment Failure</h3>
              <p className="text-xs text-slate-500">Forces payment gateway failure to trigger automated saga compensations.</p>
              <button
                onClick={handleTogglePaymentFailure}
                className={`w-full text-xs font-bold py-2.5 rounded-xl transition-all ${
                  faultStatus.simulatedPaymentFailure
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {faultStatus.simulatedPaymentFailure ? 'Disable Payment Fail' : 'Enable Payment Fail'}
              </button>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Clock Skew Injection</h3>
              <p className="text-xs text-slate-500">Offsets Lamport logical clock counter by +500ms to test clock sync.</p>
              <button
                onClick={handleApplyClockSkew}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                Inject +500ms Skew
              </button>
            </div>

          </div>

          {/* Fault Simulation Event Log */}
          {faultLogs.length > 0 && (
            <div className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs space-y-1">
              <div className="font-bold text-white mb-2">Live Fault Simulation Console Output:</div>
              {faultLogs.map((log, idx) => (
                <div key={idx}>&gt; {log}</div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
