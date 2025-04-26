require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const sentimentRoute = require('./routes/sentiment');
const analyzeImageRoute = require('./routes/analyze-image');
const uploadFileRoute = require('./routes/upload-file');
const analyzeTextRoute = require('./routes/analyze-text');
const uploadJSONRoute = require('./routes/upload-json-bigquery');

const app = express();

// ✅ Middleware: parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Middleware: security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ✅ Middleware: CORS policy
app.use(
  cors({
    origin: [
      'https://upload-center-177749780343.us-central1.run.app',
      'http://localhost:5173',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Organized rate limiters (slower: 5 per hour)
const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

const productLimiter = rateLimit({
  windowMs: oneHour,
  max: 5,
  message: 'Too many product requests, please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

const sentimentLimiter = rateLimit({
  windowMs: oneHour,
  max: 5,
  message: 'Too many sentiment analysis requests, please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

const analyzeImageLimiter = rateLimit({
  windowMs: oneHour,
  max: 5,
  message: 'Too many image analysis requests, please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

const analyzeTextLimiter = rateLimit({
  windowMs: oneHour,
  max: 5,
  message: 'Too many text analysis requests, please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: oneHour,
  max: 5,
  message: 'Too many uploads, please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ API Routes

// Products (Cloud SQL)
app.get('/api/products', productLimiter, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('🔴 DB ERROR:', { message: err.message, stack: err.stack });
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Sentiment Analysis (Vertex AI)
app.use('/api/sentiment', sentimentLimiter, sentimentRoute);

// Image Analysis (Vertex AI)
app.use('/api/analyze-image', analyzeImageLimiter, analyzeImageRoute);

// Text Analysis (Vertex AI)
app.use('/api/analyze-text', analyzeTextLimiter, analyzeTextRoute);

// Upload file to GCS
app.use('/api/upload-file', uploadLimiter, uploadFileRoute);

// Upload JSON + BigQuery analysis
app.use('/api/upload-json', uploadLimiter, uploadJSONRoute);

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ Serve static frontend
app.use(
  express.static(path.join(__dirname, '../frontend/dist'), {
    maxAge: '1d',
    etag: true,
  })
);

// ✅ Catch-all route for frontend SPA
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
