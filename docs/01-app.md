# Module 1 — MERN Chat App

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Socket.io-client, emoji-picker-react |
| Backend | Node.js, Express 4, Socket.io 4 |
| Database | PostgreSQL via NeonDB (serverless) |
| Styling | Custom CSS — Discord-inspired (black + orange) |

---

## Backend API

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns `{ status: "ok" }` |
| `GET` | `/metrics` | Prometheus metrics |
| `GET` | `/api/messages` | Fetch last 50 messages |
| `POST` | `/api/messages` | Save a new message |

### WebSocket Events (Socket.io)

| Event | Direction | Payload |
|---|---|---|
| `connection` | server ← client | — |
| `chat message` | server ← client | `{ username, message }` |
| `chat message` | server → client | `{ id, username, message, timestamp }` |
| `disconnect` | server ← client | — |

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS messages (
  id        SERIAL PRIMARY KEY,
  username  TEXT NOT NULL,
  message   TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

Table is created automatically on first backend startup.

---

## Environment Variables

File: `backend/.env`

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
PORT=5000
CLIENT_URL=http://localhost:3000
```

Copy from the example:
```bash
cp backend/.env.example backend/.env
```

---

## Running Locally (without Docker)

```bash
# Backend
cd backend
npm install
npm run dev        # starts with nodemon on port 5000

# Frontend (new terminal)
cd frontend
npm install
npm start          # starts React dev server on port 3000
```
