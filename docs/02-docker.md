# Module 2 — Dockerfiles

## Backend Dockerfile

Location: `backend/Dockerfile`

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY src/ ./src/
EXPOSE 5000
CMD ["node", "src/index.js"]
```

**Key decisions:**
- `node:18-alpine` — minimal image (~50 MB vs ~900 MB for full node)
- `--omit=dev` — skips devDependencies (nodemon etc.) in production
- Copies `package.json` first so npm install layer is cached unless deps change

---

## Frontend Dockerfile

Location: `frontend/Dockerfile`

```dockerfile
# Stage 1 — Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY public/ ./public/
COPY src/ ./src/
ARG REACT_APP_BACKEND_URL=http://localhost:5000
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

# Stage 2 — Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Key decisions:**
- Multi-stage build — final image contains only nginx + static files (~25 MB)
- `REACT_APP_BACKEND_URL` is a build-arg so the URL is baked into the JS bundle
- nginx serves static files and proxies `/api` and `/socket.io` to the backend

---

## Building Images Manually

```bash
# Backend
docker build -t crow-chat-backend:latest ./backend

# Frontend (pass backend URL at build time)
docker build \
  --build-arg REACT_APP_BACKEND_URL=http://localhost:5000 \
  -t crow-chat-frontend:latest \
  ./frontend
```

---

## Image Sizes

| Image | Base | Approx Size |
|---|---|---|
| `crow-chat-backend` | node:18-alpine | ~120 MB |
| `crow-chat-frontend` | nginx:alpine | ~25 MB |
