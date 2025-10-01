# Stage 1: Build frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend container
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend code
COPY backend ./backend

# Copy built frontend into backend’s public dist folder
COPY --from=build-frontend /app/frontend/dist ./backend/frontend/dist

# Set working dir
WORKDIR /app/backend

# Cloud Run expects the app to listen on $PORT
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
