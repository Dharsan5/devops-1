# Module 5 — Prometheus + Grafana Monitoring

## Access

| Service | URL | Username | Password |
|---|---|---|---|
| Prometheus | http://localhost:9090 | — | — |
| Grafana | http://localhost:3001 | `admin` | `crow123` |

---

## Prometheus

### Scrape Config

File: `monitoring/prometheus.yml`

Prometheus scrapes the backend every 15 seconds:

```yaml
scrape_configs:
  - job_name: crow-backend
    static_configs:
      - targets: ['backend:5000']
    metrics_path: /metrics
    scrape_interval: 15s
```

### Useful Queries (PromQL)

Open http://localhost:9090 and try these:

```promql
# Total HTTP requests by route
http_requests_total

# Request rate (per second, last 1 min)
rate(http_requests_total[1m])

# Active WebSocket connections
socket_connections_active

# Messages sent total
chat_messages_total

# HTTP response duration (p95)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

---

## Grafana

### Dashboard — Crow Chat Overview

Auto-provisioned at startup. Found at:
`Dashboards → Crow Chat → Crow Chat Overview`

| Panel | Metric |
|---|---|
| Request Rate | `rate(http_requests_total[1m])` |
| Active Connections | `socket_connections_active` |
| Messages Sent | `chat_messages_total` |
| Response Time (p95) | `histogram_quantile(0.95, ...)` |

### Datasource

Auto-provisioned from `monitoring/grafana/provisioning/datasources/`.

- Name: `Prometheus`
- URL: `http://crow-prometheus:9090`
- Access: Server (default)

---

## Backend Metrics Exposed

The backend uses `prom-client` to expose metrics at `GET /metrics`.

| Metric | Type | Description |
|---|---|---|
| `http_requests_total` | Counter | Total HTTP requests, labelled by method + route + status |
| `http_request_duration_seconds` | Histogram | Request duration in seconds |
| `socket_connections_active` | Gauge | Current active Socket.io connections |
| `chat_messages_total` | Counter | Total chat messages sent |
| `process_cpu_seconds_total` | Counter | Node.js CPU usage (default) |
| `process_resident_memory_bytes` | Gauge | Memory usage (default) |

---

## Alerting (manual setup)

To add an alert in Grafana:
1. Open a dashboard panel → **Edit**
2. Go to **Alert** tab
3. Set condition (e.g., `socket_connections_active > 100`)
4. Add notification channel (email, Slack, webhook)
