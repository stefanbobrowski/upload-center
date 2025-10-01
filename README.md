# Cloud Playground ☁️ - Upload Center 🌆

A full-stack web application for uploading, analyzing, and managing data using **Google Cloud Platform** services. Built for scalability, security, and modern DevOps workflows.

👉 React + Vite Frontend  
👉 Express + Node.js Backend  
👉 Google Cloud Storage, BigQuery, Cloud SQL  
👉 Cloud Run deployment with secure Cloud SQL Proxy  
👉 Full API security protections (Rate Limiters, CORS, Helmet, IP Logging)

---

## 🔗 Live Demo

> 🔗 [upload-center on Cloud Run](https://upload-center-177749780343.us-central1.run.app/)

---

## 🔠 Project Overview

Welcome to the Cloud Playground — Upload Center!

Explore hands-on examples to see it in action, showcasing the power of modern backend development, scalable cloud infrastructure, and AI integrations — all built on **Google Cloud Platform (GCP)**.

This project demonstrates a secure, production-grade full-stack architecture featuring:

- **Cloud SQL (PostgreSQL):** Structured data storage
- **Cloud Run:** Dockerized backend + full app delivery
- **Cloud Storage:** File uploads (text, images, JSON)
- **BigQuery:** Large-scale JSON analysis
- **Vertex AI & Gemini Pro:** Text and image understanding

---

## 🛠️ Technology Stack Overview

| Layer    | Technologies Used                              |
| -------- | ---------------------------------------------- |
| Frontend | Vite + React (TypeScript, SWC)                 |
| Backend  | Node.js, Express                               |
| AI       | Gemini 2.5 (text + image), Vertex AI       |
| Big Data | BigQuery                                       |
| Database | Cloud SQL (PostgreSQL)                         |
| Storage  | Google Cloud Storage                           |
| Security | IAM, Helmet, CORS, Rate Limiting, reCAPTCHA v3 |
| Build    | Docker                                         |
| CI/CD    | GitHub Actions (Docker build & deploy)         |
| Hosting  | Cloud Run, Artifact Registry                   |

---

## 🔐 Focus on Security

Built with real-world production security in mind. Heavy focus on securing access and preventing abuse of cloud resources from users and bot traffic. Measures include:

- Global & route-based API rate limiting
- reCAPTCHA v3 integration
- IP logging & strict CORS rules
- Hardened HTTP headers with Helmet
- Role-based access controls via Google Cloud IAM

---

## 🚀 Why It Matters

Upload Center is more than a learning sandbox — it's a blueprint for building secure, scalable, cloud-native web applications using today's most powerful tools from Google Cloud. Whether you're testing uploads, analyzing data, or integrating AI, this platform offers a real-world, extensible foundation for modern web development.

---

## 📆 Features

- ✅ Secure PostgreSQL access with Cloud SQL Proxy
- ✅ Text sentiment analysis with Gemini AI
- ✅ Upload and analyze images with Gemini AI
- ✅ Vertex AI text file sentiment analysis
- ✅ Upload and validate JSON files to Cloud Storage
- ✅ Load and analyze uploaded files with BigQuery
- ✅ Rate limiting on all sensitive routes
- ✅ GitHub Actions CI/CD for Dockerized Cloud Run deployment
- ✅ Persistent Light/Dark Mode Theme

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

- User login / authentication

---

## 👨‍💻 Author

Created by [@stefanbobrowski](https://github.com/stefanbobrowski)
Website: https://stefanbobrowski.com

---

## 📄 License

Licensed under the **Apache License 2.0**.  
See [LICENSE](./LICENSE) for full details.

---

## 📁 Full Code Repository

Feel free to view the code or contribute with a pull request.
You can explore the full source code for Upload Center here:
[📁 GitHub – Upload Center](https://github.com/stefanbobrowski/upload-center)
