# Security and Abuse Prevention - Cloud Playground - Upload Center Project

This project integrates multiple security measures to protect cloud resources, API endpoints, and user interactions against abuse and misuse. These practices ensure resilience in both demo and production environments.

---

## 🛡️ API Rate Limiting

<!-- Each sensitive API route is individually protected with `express-rate-limit`, enforcing strict per-IP request limits:

| Route                | Limit      | Window |
| :------------------- | :--------- | :----- |
| `/api/products`      | 5 requests | 1 hour |
| `/api/sentiment`     | 5 requests | 1 hour |
| `/api/analyze-image` | 5 requests | 1 hour |
| `/api/analyze-text`  | 5 requests | 1 hour |
| `/api/upload-file`   | 5 uploads  | 1 hour |
| `/api/upload-json`   | 5 uploads  | 1 hour | -->

All routes share the same global limit of 8 requests per hour.

---

## 🔒 CORS Protection

- CORS (Cross-Origin Resource Sharing) is restricted to known frontend domains:
  - `https://upload-center-177749780343.us-central1.run.app`
  - `http://localhost:5173` (development)
- Only `GET`, `POST`, and `OPTIONS` methods are permitted.
- Credentials (cookies, auth headers) are allowed for future secured extensions.

---

## 🔐 Helmet Middleware

- HTTP headers are set to secure defaults using `helmet`.
- Protections include:
  - Cross-Origin Resource Policy (CORP)
  - Basic XSS protection
  - Clickjacking mitigation (frameguard)
  - Hides Express server fingerprint (`X-Powered-By` removed)
- Content Security Policy (CSP) is currently disabled for maximum compatibility but can be enabled later.

---

## 📤 Upload Security

- File uploads to Google Cloud Storage use memory storage (no temporary disk files).
- Filenames are randomized with a timestamp prefix to prevent collisions.
- Upload attempts are IP-logged for security auditing.

---

## 📈 BigQuery Access Security

- BigQuery loads are protected via rate limiting.
- Each BigQuery load **overwrites** previous uploads (`WRITE_TRUNCATE`), preventing accidental data accumulation or bloating.
- Queries are limited to simple aggregations to prevent complex or expensive operations.

---

## 🧠 Additional Protection

- **reCAPTCHA v3** integrated on file upload and analysis triggers to stop bot traffic before even reaching the server.
- **IP blocklisting** can be added if abusive patterns are detected.
- **GCS Lifecycle Rules** (storage policies) can automatically delete old uploaded files after 7 days.

---

## 📋 Summary

This project was built with a strong focus on real-world web security and best practices:

- Rate limiting at the route level
- Secure upload and analysis pipelines
- Strict CORS origin control
- Industry-standard HTTP headers
- Clear abuse prevention logs and mechanisms

These protections help safeguard against DDoS attempts, bot abuse, credential stuffing, and excessive resource usage — while keeping user experience smooth for legitimate users.

---
