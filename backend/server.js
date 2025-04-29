require("dotenv").config();
const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const sentimentRoute = require("./routes/sentiment");
const analyzeImageRoute = require("./routes/analyze-image");
const uploadFileRoute = require("./routes/upload-file");
const analyzeTextRoute = require("./routes/analyze-text");
const uploadJSONRoute = require("./routes/upload-json-bigquery");
const productsRoute = require("./routes/products");
const { MAX_REQUESTS_PER_HOUR } = require("../constants/rateLimits");

const app = express();

// ✅ Middleware: parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Middleware: security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// ✅ Middleware: CORS policy
app.use(
  cors({
    origin: [
      "https://upload-center-177749780343.us-central1.run.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// ✅ Global rate limiter (across ALL APIs)
const oneHour = 60 * 60 * 1000;
const globalLimiter = rateLimit({
  windowMs: oneHour,
  max: MAX_REQUESTS_PER_HOUR,
  message: "Too many requests, please try again in an hour.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", globalLimiter);

// Example limiter for specific routes
// const sentimentLimiter = rateLimit({
//   windowMs: oneHour,
//   max: 5,
//   message: 'Too many sentiment analysis requests, please try again in an hour.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use('/api/sentiment', sentimentLimiter, sentimentRoute);

// ✅ API Routes
app.use("/api/products", productsRoute);
app.use("/api/sentiment", sentimentRoute);
app.use("/api/analyze-image", analyzeImageRoute);
app.use("/api/analyze-text", analyzeTextRoute);
app.use("/api/upload-file", uploadFileRoute);
app.use("/api/upload-json", uploadJSONRoute);

app.get("/api/rate-limit-status", (req, res) => {
  const remaining = req.rateLimit?.remaining ?? 0;
  res.json({ requestsRemaining: remaining });
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Serve static frontend
app.use(
  express.static(path.join(__dirname, "../frontend/dist"), {
    maxAge: "1d",
    etag: true,
  }),
);

// ✅ Catch-all route for frontend
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
