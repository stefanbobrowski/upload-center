require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db'); // path to your db.js
const app = express();
const sentimentRoute = require('./routes/sentiment');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

app.use(express.json());

// Only allow requests from your frontend domain
app.use(
  cors({
    origin: [
      'https://upload-center-177749780343.us-central1.run.app/',
      'http://localhost:5173',
    ], // include localhost for dev
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 10 requests per window
  message: 'Too many requests from this IP, please try again later.',
});
const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Limit each IP to 5 product requests per window
  message: 'Too many requests for products. Please try again later.',
});

app.use('/api', limiter); // Apply to all API routes

// API route - fetch products
app.get('/api/products', productLimiter, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    console.error('🔴 DB ERROR:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.use('/api/sentiment', sentimentRoute);

// // Serve static files from "public"
// app.use(express.static(path.join(__dirname, 'public')));

// // Default route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve index.html for any unknown routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Port for Cloud Run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
