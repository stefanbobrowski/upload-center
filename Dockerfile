# Stage 1: Build frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine
WORKDIR /app

# Copy backend package files and install deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend code
COPY backend ./backend

# Copy built frontend into backend's dist folder
COPY --from=build-frontend /app/frontend/dist ./backend/frontend/dist

# Set working directory to backend
WORKDIR /app/backend

EXPOSE 8080

# Explicit path to server.js
CMD ["node", "server.js"]

