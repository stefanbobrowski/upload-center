# Stage 1: Build frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

# Accept build-time environment variable
ARG VITE_RECAPTCHA_SITE_KEY
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./

# 👇 Inject .env.production file with site key
RUN echo "VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY" > .env.production

# 👇 Make sure the key is also set as an ENV variable for logging
RUN echo "🔥 Docker build-time VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY"

RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine
WORKDIR /app

# Copy backend files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev
COPY backend ./backend

# Copy built frontend into backend’s public/dist folder
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
EXPOSE 8080
CMD ["node", "server.js"]
