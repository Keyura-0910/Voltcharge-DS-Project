import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { dataStore } from '../services/dataStore';
import { EventBusBroker } from '../distributed/EventBus';

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'WebSocket Telemetry Connected' }));

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG' }));
        }
      } catch (e) {}
    });
  });

  setInterval(() => {
    const session = dataStore.chargingSessions.find(s => s.status === 'Charging');
    if (session) {
      if (session.batteryPercent < 100) {
        session.batteryPercent = Math.min(100, session.batteryPercent + 1);
        session.energyDeliveredKwh = Number((session.energyDeliveredKwh + 0.35).toFixed(2));
        session.timeElapsedMinutes += 1;
        session.estimatedRemainingMinutes = Math.max(0, session.estimatedRemainingMinutes - 1);
        session.costSoFar = Math.round(session.energyDeliveredKwh * 12);
      } else {
        session.status = 'Completed';
      }

      const payload = JSON.stringify({
        type: 'CHARGING_TELEMETRY',
        session,
      });

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    }

    const logs = EventBusBroker.getInstance().getRecentLogs(10);
    const adminPayload = JSON.stringify({
      type: 'SYSTEM_EVENT_STREAM',
      events: logs,
    });

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(adminPayload);
      }
    });
  }, 3000);

  return wss;
}
