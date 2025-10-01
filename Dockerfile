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

# Copy built frontend into the folder server.js expects
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
