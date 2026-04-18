# Module 3 — Docker Compose

## Services

| Service | Container Name | Port | Image |
|---|---|---|---|
| backend | `chat-backend` | `5000` | built from `./backend` |
| frontend | `chat-frontend` | `3000` | built from `./frontend` |
| prometheus | `crow-prometheus` | `9090` | `prom/prometheus:latest` |
| grafana | `crow-grafana` | `3001` | `grafana/grafana:latest` |

All services share the `chat-net` bridge network.

---

## Start / Stop

```bash
# Start everything (build if needed)
docker compose up -d --build

# Stop everything (keep volumes)
docker compose down

# Full reset — remove containers AND volumes
docker compose down -v

# Restart a single service
docker compose restart backend

# View logs
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Health Check

The backend has a built-in health check:

```yaml
healthcheck:
  test: ["CMD", "wget", "-qO-", "http://localhost:5000/health"]
  interval: 15s
  timeout: 5s
  retries: 3
```

The frontend container waits for the backend to be `healthy` before starting (`condition: service_healthy`).

---

## Volumes

| Volume | Used by | Purpose |
|---|---|---|
| `prometheus-data` | Prometheus | Stores scraped metrics (7-day retention) |
| `grafana-data` | Grafana | Stores dashboards, users, settings |

---

## Networks

```
chat-net (bridge)
  ├── chat-backend     (backend:5000)
  ├── chat-frontend    (frontend:80)
  ├── crow-prometheus  (prometheus:9090)
  └── crow-grafana     (grafana:3000)
```

Services communicate by container name inside the network (e.g., Prometheus scrapes `http://backend:5000/metrics`).

---

## Dev Compose Override

For local development with hot reload:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

`docker-compose.dev.yml` mounts source code as volumes and runs the backend with `nodemon`.
