const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    console.error("🔴 DB ERROR:", { message: err.message, stack: err.stack });
    res.status(500).json({ error: "Database query failed" });
  }
});

module.exports = router;
