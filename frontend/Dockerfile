# Stage 1 — build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json .
RUN npm install

COPY public/ ./public/
COPY src/ ./src/

ARG REACT_APP_BACKEND_URL=http://localhost:5000
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
