import React, { createContext, useContext, useEffect, useState } from 'react';
import { ChargingSession, SystemEventLog } from '../types';

interface WebSocketContextType {
  isConnected: boolean;
  liveSession: ChargingSession | null;
  systemEvents: SystemEventLog[];
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  liveSession: null,
  systemEvents: [],
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [liveSession, setLiveSession] = useState<ChargingSession | null>(null);
  const [systemEvents, setSystemEvents] = useState<SystemEventLog[]>([]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = window.location.port === '3000'
      ? `ws://${window.location.hostname}:5000`
      : `${protocol}//${window.location.host}`;
    let ws: WebSocket;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'CHARGING_TELEMETRY') {
            setLiveSession(data.session);
          } else if (data.type === 'SYSTEM_EVENT_STREAM') {
            setSystemEvents(data.events);
          }
        } catch (e) {
          // parse error ignored
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.warn('WebSocket connection error:', e);
    }

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, liveSession, systemEvents }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
