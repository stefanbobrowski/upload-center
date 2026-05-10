# Cloud Playground ☁️ - Upload Center 🌆

```
.             .        .     .     |--|--|--|--|--|--|  |===|==|   /    i
        .            ______________|__|__|__|__|__|_ |  |===|==|  *  . /=\
__ *            .   /______________________________|-|  |===|==|       |=|  .
__|  .      .   .  //______________________________| :----------------------.
__|   /|\      _|_|//       ooooooooooooooooooooo  |-|                      |
__|  |/|\|__   ||l|/,-------8                   8 -| |       UPLOAD         |
__|._|/|\|||.l |[=|/,-------8                   8 -|-|                      |
__|[+|-|-||||li|[=|---------8                   8 -| |       CENTER         |
_-----.|/| //:\_[=|\`-------8                   8 -|-|                      |
 /|  /||//8/ :  8_|\`------ 8ooooooooooooooooooo8 -| |                      |
/=| //||/ |  .  | |\\_____________  ____  _________|-|                      |
==|//||  /   .   \ \\_____________ |X|  | _________| `---==------------==---'
==| ||  /         \ \_____________ |X| \| _________|     ||            ||
==| |~ /     .     \
LS|/  /             \______________________________________________________
```

A full-stack web application for uploading, analyzing, and managing data using **Google Cloud Platform** services. Built for scalability, security, and modern DevOps workflows.

- React + Vite Frontend
- Express + Node.js Backend
- Full API security protections (Rate Limiters, CORS, Helmet, IP Logging)
- Google Cloud Storage, BigQuery, Cloud SQL for storage
- Cloud Run deployment

---

## 🔗 Live Demo

> 🔗 [upload-center on Cloud Run](https://upload-center-177749780343.us-central1.run.app/)

---

## 🔠 Project Overview

Welcome to the Cloud Playground - Upload Center!

Explore hands-on examples demonstrating the power of modern full-stack development, scalable cloud infrastructure, and AI integrations - all built on **Google Cloud Platform (GCP)**.

- **Cloud Run:** Dockerized backend + full app delivery
- **Cloud SQL (PostgreSQL):** Structured data storage
- **Cloud Storage:** File uploads (text, images, JSON)
- **BigQuery:** Large-scale JSON analysis
- **Vertex AI & Gemini Pro:** Text and image analysis

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

## 🛠️ Technology Stack Overview

| Layer    | Technologies Used                              |
| -------- | ---------------------------------------------- |
| Frontend | Vite + React (TypeScript, SWC)                 |
| Backend  | Node.js, Express                               |
| AI       | Gemini 2.5 (text + image), Vertex AI           |
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

Upload Center is more than a learning sandbox, it's a blueprint for building secure, scalable, cloud-native web applications using today's most powerful tools from Google Cloud. Whether you're testing uploads, analyzing data, or integrating AI, this platform offers a real-world, extensible foundation for modern web development.

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

[📁 GitHub – Upload Center](https://github.com/stefanbobrowski/upload-center)
