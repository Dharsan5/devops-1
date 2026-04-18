# Crow Chat — MERN DevOps Project

A real-time chat application built with the MERN stack, fully containerized and automated with a CI/CD pipeline and live monitoring.

---

## Credentials

| Service | URL | Username | Password |
|---|---|---|---|
| **Frontend** | http://localhost:3000 | — | — |
| **Backend API** | http://localhost:5000 | — | — |
| **Jenkins** | http://localhost:8080 | `admin` | `admin123` |
| **Prometheus** | http://localhost:9090 | — | — |
| **Grafana** | http://localhost:3001 | `admin` | `crow123` |

> **NeonDB** — credentials are stored as a Jenkins Secret (`neon-database-url`) and in `backend/.env`.

---

## Quick Start

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd Devops#1
```

### 2. Create the backend environment file
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set your DATABASE_URL from NeonDB
```

### 3. Start the app stack
```bash
docker compose up -d --build
```

### 4. Start Jenkins (separate)
```bash
docker compose -f jenkins/docker-compose.jenkins.yml up -d --build
```

### 5. Open services
- Chat app → http://localhost:3000
- Grafana dashboard → http://localhost:3001
- Jenkins pipelines → http://localhost:8080

---

## Project Structure

```
Devops#1/
├── backend/                  # Node.js + Express + Socket.io
│   ├── src/
│   │   └── index.js          # Entry point, API routes, Socket events
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # React + Discord-style UI
│   ├── src/
│   │   ├── components/       # Chat, Sidebar, MessageList, Input
│   │   └── App.js
│   ├── nginx.conf            # Production reverse proxy config
│   ├── Dockerfile
│   └── package.json
│
├── monitoring/
│   ├── prometheus.yml        # Scrape config (backend:5000/metrics)
│   └── grafana/
│       └── provisioning/     # Auto-loaded datasource + dashboard
│
├── jenkins/
│   ├── Dockerfile            # Jenkins + plugins pre-installed
│   ├── jenkins.yaml          # JCasC admin user config
│   ├── plugins.txt           # Plugin list
│   └── docker-compose.jenkins.yml
│
├── docker-compose.yml        # App + Monitoring stack
├── docker-compose.dev.yml    # Local dev overrides
├── Jenkinsfile               # CI/CD pipeline definition
└── README.md
```

---

## Architecture

```
Browser
  │
  ├──► React (port 3000 / nginx)
  │         │  REST + WebSocket
  │         ▼
  ├──► Node.js / Express / Socket.io (port 5000)
  │         │  SQL via @neondatabase/serverless
  │         ▼
  │    NeonDB (PostgreSQL — cloud)
  │
  ├──► Prometheus (port 9090)  ◄── scrapes /metrics from backend
  └──► Grafana (port 3001)     ◄── reads from Prometheus
```

---

## Modules

| # | Module | Details |
|---|---|---|
| 1 | MERN Chat App | [docs/01-app.md](docs/01-app.md) |
| 2 | Dockerfiles | [docs/02-docker.md](docs/02-docker.md) |
| 3 | Docker Compose | [docs/03-compose.md](docs/03-compose.md) |
| 4 | Jenkins Pipeline | [docs/04-jenkins.md](docs/04-jenkins.md) |
| 5 | Monitoring | [docs/05-monitoring.md](docs/05-monitoring.md) |

---

## Stopping Everything

```bash
# Stop app + monitoring
docker compose down

# Stop Jenkins
docker compose -f jenkins/docker-compose.jenkins.yml down

# Stop and remove all volumes (full reset)
docker compose down -v
docker compose -f jenkins/docker-compose.jenkins.yml down -v
```
