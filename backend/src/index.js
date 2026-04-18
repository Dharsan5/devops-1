require('dotenv').config();
const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors   = require('cors');
const client = require('prom-client');
const { sql, initDB } = require('./db');

// ── Prometheus registry & metrics ─────────────────────────────
const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: 'crow_' });

const httpRequestsTotal = new client.Counter({
  name: 'crow_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const httpDuration = new client.Histogram({
  name: 'crow_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const activeConnections = new client.Gauge({
  name: 'crow_socket_active_connections',
  help: 'Number of active WebSocket connections',
  registers: [register],
});

const messagesTotal = new client.Counter({
  name: 'crow_chat_messages_total',
  help: 'Total chat messages sent',
  registers: [register],
});

const messageErrors = new client.Counter({
  name: 'crow_chat_message_errors_total',
  help: 'Total failed message inserts',
  registers: [register],
});

// ── App setup ─────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);

// HTTP metrics middleware
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => {
    const labels = { method: req.method, route: req.path, status: res.statusCode };
    httpRequestsTotal.inc(labels);
    end({ status: res.statusCode });
  });
  next();
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Prometheus scrape endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Message history
app.get('/messages', async (_req, res) => {
  try {
    const messages = await sql`
      SELECT * FROM messages ORDER BY created_at ASC LIMIT 50
    `;
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Socket.io ─────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  activeConnections.inc();

  socket.on('send_message', async ({ username, text }) => {
    try {
      const [msg] = await sql`
        INSERT INTO messages (username, text)
        VALUES (${username}, ${text})
        RETURNING *
      `;
      messagesTotal.inc();
      io.emit('receive_message', msg);
    } catch (err) {
      messageErrors.inc();
      console.error('DB error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    activeConnections.dec();
  });
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
initDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
