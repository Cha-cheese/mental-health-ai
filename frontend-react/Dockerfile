# ── Stage 1: Build React app ─────────────────────────────────
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build production files
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ────────────────────────────────
# Nginx is a lightweight web server, much smaller than Node.js
FROM nginx:alpine

# Copy built files to Nginx's serve directory
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
