import express from 'express';
import cors from 'cors';
import http from 'http';
import { apiRouter } from './routes/apiRoutes';
import { initWebSocketServer } from './websocket/wsServer';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'EV Charging Platform Backend Running' });
});

const server = http.createServer(app);

// Initialize WebSocket Telemetry & System Stream
initWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ EV Charging Platform Backend Server Listening on port ${PORT}`);
  console.log(`⚡ REST API: http://localhost:${PORT}/api`);
  console.log(`⚡ WebSocket Stream: ws://localhost:${PORT}`);
  console.log(`⚡ Academic Viva Route: http://localhost:${PORT}/api/admin/system`);
  console.log(`=======================================================`);
});
