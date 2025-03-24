require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db'); // path to your db.js
const app = express();

app.use(express.json());

// API route - fetch products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching products:', err);
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
