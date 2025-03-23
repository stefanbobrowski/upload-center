const express = require('express');
const path = require('path');
const app = express();

// // Serve static files from "public"
// app.use(express.static(path.join(__dirname, 'public')));

// // Default route
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// Serve static files from the Vite build output
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Serve index.html for any unknown routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Port for Cloud Run
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
