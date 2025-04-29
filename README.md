# Cloud Playground ☁️ - Upload Center 🌆

A full-stack web application for uploading, analyzing, and managing data using **Google Cloud Platform** services.
Built for scalability, security, and modern DevOps workflows.

👉 React + Vite Frontend  
👉 Express + Node.js Backend  
👉 Google Cloud Storage, BigQuery, Cloud SQL  
👉 Cloud Run deployment with secure Cloud SQL Proxy  
👉 Full API security protections (Rate Limiters, CORS, Helmet, IP Logging)

---

## 🔗 Live Demo

> 🔗 [upload-center on Cloud Run](https://upload-center-177749780343.us-central1.run.app/)

---

## 💠 Tech Stack

- **Frontend:** React (Vite + TypeScript)
- **Backend:** Node.js + Express
- **Database:** Cloud SQL (PostgreSQL)
- **Storage:** Google Cloud Storage (GCS)
- **Big Data Analysis:** BigQuery
- **AI Integrations:** Vertex AI, Gemini AI (Sentiment + Image Analysis)
- **Security:** Cloud SQL Auth Proxy, Google Cloud IAM, reCAPTCHA v3 (planned), Rate Limiters, Helmet, CORS
- **CI/CD:** GitHub Actions + Docker
- **Hosting/Infra:** Google Cloud Run (Dockerized)

---

## ✨ Features

- ✅ Secure PostgreSQL access with Cloud SQL Proxy
- ✅ Upload and validate JSON files to Cloud Storage
- ✅ Auto-convert JSON arrays to newline-delimited JSON (NDJSON)
- ✅ Load and analyze uploaded files with BigQuery
- ✅ Display total rows, category breakdowns, and average scores
- ✅ Upload and analyze images with Gemini AI
- ✅ Vertex AI text file sentiment analysis
- ✅ Rate limiting on all sensitive routes
- ✅ IP logging for uploads and BigQuery loads
- ✅ CORS-restricted access to trusted domains
- ✅ Persistent Light/Dark Mode Theme
- ✅ GitHub Actions CI/CD for Dockerized Cloud Run deployment
- ✅ Fully responsive frontend

---

## 📂 Project Structure

```
/frontend            # Vite + React frontend
/backend             # Express server + API routes
/backend/db.js       # PostgreSQL connection (via Cloud SQL Proxy)
/backend/routes      # Upload, BigQuery, Sentiment, Image Analysis
/.env                # Environment variables (gitignored)
/.github/workflows/  # GitHub Actions CI/CD workflow files
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
GOOGLE_APPLICATION_CREDENTIALS=path-to-your-service-account.json
RECAPTCHA_SECRET_KEY=your-recaptcha-key (optional for bot protection)
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

### 3. Set Cloud Run environment variables

```
DB_USER=your-db-user
DB_PASSWORD=your-password
DB_NAME=your-db-name
DB_PORT=your-db-port
INSTANCE_CONNECTION_NAME=your-project:region:cloudsql-instance
GOOGLE_APPLICATION_CREDENTIALS=inline-json-or-mount-secret
RECAPTCHA_SECRET_KEY=your-recaptcha-key (optional)
```

### 4. Deploy via GitHub Actions or `gcloud run deploy`

---

## 🤔 Future Work

- User authentication (Firebase Auth or Clerk)
- Admin dashboard for managing uploads and analysis results
- Upload product images + automatic resizing
- Full GraphQL or gRPC backend (optional)
- reCAPTCHA v3 on upload forms
- GCS lifecycle rules (auto-delete old files after X days)

---

## 👨‍💼 Author

Created by [@stefanbobrowski](https://github.com/stefanbobrowski) —  
Feel free to reach out, contribute, or fork this project!

---

## 📄 License

Licensed under the **Apache License 2.0**.  
See [LICENSE](./LICENSE) for full details.

---
