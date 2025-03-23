# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --production

# COPY . .

# EXPOSE 8080

# CMD ["npm", "start"]

# Stage 1: Build frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev
COPY backend ./backend

# Copy frontend build to /app/frontend/dist (not inside backend)
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

# Start the app
WORKDIR /app/backend
EXPOSE 8080
CMD ["node", "server.js"]
