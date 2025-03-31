require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const sentimentRoute = require('./routes/sentiment');
const analyzeImageRoute = require('./routes/analyze-image');

const app = express();

// ✅ Ensure forms and multipart bodies can be parsed
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Secure headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ✅ CORS policy (restricts origin access)
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

// ✅ Rate limiters
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests from this IP, please try again later.',
});
const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many requests for products. Please try again later.',
  standardHeaders: true, // ✅ Adds X-RateLimit-* headers
  legacyHeaders: false,
});
const sentimentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many sentiment analysis requests. Please try again later.',
  standardHeaders: true, // ✅ Adds X-RateLimit-* headers
  legacyHeaders: false,
});
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many image analysis requests. Please try again later.',
  standardHeaders: true, // ✅ Adds X-RateLimit-* headers
  legacyHeaders: false,
});

app.use('/api', limiter);

// ✅ Routes
app.get('/api/products', productLimiter, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('🔴 DB ERROR:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.use('/api/sentiment', sentimentLimiter, sentimentRoute);
app.use('/api/analyze-image', analyzeLimiter, analyzeImageRoute);

// ✅ Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// ✅ Serve static assets with caching
app.use(
  express.static(path.join(__dirname, '../frontend/dist'), {
    maxAge: '1d',
    etag: true,
  })
);

// ✅ Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
