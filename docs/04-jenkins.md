# Module 4 — Jenkins CI/CD Pipeline

## Access

| Field | Value |
|---|---|
| URL | http://localhost:8080 |
| Username | `admin` |
| Password | `admin123` |

---

## Starting Jenkins

```bash
# From project root
docker compose -f jenkins/docker-compose.jenkins.yml up -d --build

# Stop Jenkins
docker compose -f jenkins/docker-compose.jenkins.yml down

# Full reset (removes all jobs, history, credentials)
docker compose -f jenkins/docker-compose.jenkins.yml down -v
```

---

## Installed Plugins

| Plugin | Purpose |
|---|---|
| `workflow-aggregator` | Pipeline (declarative + scripted) |
| `docker-workflow` | Docker build/push steps |
| `git` | Git SCM checkout |
| `credentials-binding` | Inject secrets as env vars |
| `configuration-as-code` | Load config from `jenkins.yaml` |
| `pipeline-stage-view` | Visual stage progress in UI |

---

## Credentials

Stored in Jenkins → Manage Jenkins → Credentials → Global:

| ID | Kind | Value |
|---|---|---|
| `neon-database-url` | Secret text | Full NeonDB connection string |

**Adding/updating the credential:**
1. Go to `http://localhost:8080/manage/credentials/store/system/domain/_/`
2. Click the credential → **Update**
3. Set **ID** field to exactly `neon-database-url`
4. Paste the full URI: `postgresql://user:pass@host/db?sslmode=require`

---

## Pipeline Stages

```
Checkout → Validate → Build (parallel) → Smoke Test → Deploy
```

| Stage | What it does |
|---|---|
| **Checkout** | Verifies project files are present in `/workspace/crow-chat` |
| **Validate** | Runs `docker compose config -q` to verify compose syntax |
| **Build** | Builds backend and frontend Docker images in parallel, tagged with build number and `latest` |
| **Smoke Test** | Verifies both built images exist (`docker image inspect`) |
| **Deploy** | Stops old containers, starts fresh ones using `docker run` with `DATABASE_URL` injected |

### Post Actions (always runs)
- Stops any running `chat-backend` / `chat-frontend` containers
- Prunes dangling images to free disk space

---

## Creating the Pipeline Job

1. Open Jenkins → **New Item**
2. Name: `CrowApp` → Select **Pipeline** → OK
3. Scroll to **Pipeline** section
4. Definition: `Pipeline script`
5. Paste contents of `Jenkinsfile`
6. Click **Save**
7. Click **Build Now**

---

## Jenkinsfile Location

`Devops#1/Jenkinsfile`

The pipeline uses these environment variables (auto-set):

| Variable | Value |
|---|---|
| `PROJECT_DIR` | `/workspace/crow-chat` |
| `BACKEND_IMAGE` | `crow-chat-backend` |
| `FRONTEND_IMAGE` | `crow-chat-frontend` |
| `BUILD_NUMBER` | Jenkins build number (auto) |
| `DATABASE_URL` | Injected from `neon-database-url` credential |
