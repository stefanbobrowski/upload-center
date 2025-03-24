const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // 👈 this is the socket path
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
