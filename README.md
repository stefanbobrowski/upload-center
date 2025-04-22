# Upload Center 🌆

A full-stack web application for uploading, storing, and managing data, powered by **Google Cloud Platform**.
Designed for scalability, modularity, and modern DevOps workflows.
Built with React, Express, PostgreSQL, and deployed via **Cloud Run** using secure **Cloud SQL Proxy** connections.

---

## 🔗 Live Demo

> 🔗 [upload-center on Cloud Run](https://upload-center-177749780343.us-central1.run.app/)

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite + TypeScript)
- **Backend:** Node.js + Express
- **Database:** Cloud SQL (Postgres SQL)
- **Storage:** Cloud Storage
- **Security:** Cloud SQL Auth Proxy (Unix socket connection), Cloud IAM, reCAPTCHA v3, Rate Limiters, Helmet, CORS,
- **CI/CD:** GitHub Actions + Docker
- **Infra:** Google Cloud Run (Dockerized)

---

## ✨ Features

- ✅ Secure DB access using Cloud SQL Proxy
- 🌍 React frontend hosted by Express
- ⚡ TypeScript end-to-end (frontend)
- ⚖️ PostgreSQL cloud-native database
- ♻️ GitHub Actions for automatic deploys
- ReCaptcha
- Persistent Light/Dark Mode theme
- 
- Cloud SQL example
- Gemini AI - Sentiment Analysis
- Gemini AI - Image Upload (multer local disk) and Analysis
- Cloud Storage upload, text file, images
- Vertex AI analysis of text file
- Cloud Storage json upload for big data
- BigQuery actions on cloud storage data file
- 

---

## 📂 Project Structure

```
/frontend       # React Vite frontend
/backend        # Express server + DB API routes
/backend/db.js  # PostgreSQL connection (via Cloud SQL Proxy)
/.env           # Local environment variables (gitignored)
/.github/workflows/google-cloudrun-docker.yml  # GitHub Actions CI/CD
```

---

## ⚙️ Local Development

### 1. Clone the repo

```bash
git clone https://github.com/stefanbobrowski/upload-center.git
cd upload-center
```

### 2. Set up backend environment variables

Create `backend/.env`:

```env
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=your-cloud-sql-ip (or socket path)
DB_NAME=your-db-name
DB_PORT=your-db-port
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Start the backend

```bash
cd backend
npm install
node server.js
```

---

## ☁️ Cloud Deployment (Cloud Run + Cloud SQL Proxy)

### 1. Build the frontend

```bash
cd frontend
npm run build
```

### 2. Docker build & push (CI/CD or manual)

```bash
docker build -t gcr.io/YOUR_PROJECT_ID/upload-center .
docker push gcr.io/YOUR_PROJECT_ID/upload-center
```

### 3. Set Cloud Run env vars

Add these variables to your Cloud Run service:

```
DB_USER=your-db-user
DB_PASSWORD=your-password
DB_NAME=your-db-name
DB_PORT=your-db-port
INSTANCE_CONNECTION_NAME=your-project:region:cloudsql-instance
```

### 4. ???

## 🤔 Future Work

- Upload product images to Google Cloud Storage
- Add user authentication (e.g. Firebase Auth or Clerk)
- Admin dashboard for product management
- Search, filtering, and pagination features

---

## 👨‍💼 Author

Created by [@stefanbobrowski](https://github.com/stefanbobrowski) — feel free to reach out or contribute!

---

## 📄 License

Licensed under the **Apache License 2.0**. See [LICENSE](./LICENSE) for details.
