# Stage 1: Build frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend
FROM node:20-alpine
WORKDIR /app

# Copy backend dependencies & install
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend into backend's dist folder
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

EXPOSE 8080
CMD ["node", "server.js"]
