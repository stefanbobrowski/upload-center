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
FROM node:20-alpine AS build-backend
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Copy Vite dist into backend
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

EXPOSE 8080
CMD ["node", "server.js"]
