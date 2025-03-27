require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db'); // path to your db.js
const app = express();
const sentimentRoute = require('./routes/sentiment');
const rateLimit = require('express-rate-limit');

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter); // Apply to all API routes

app.use('/api/sentiment', sentimentRoute);

// API route - fetch products
app.get('/api/products', async (req, res) => {
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
