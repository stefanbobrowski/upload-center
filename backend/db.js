require('dotenv').config();
const { Pool } = require('pg');

const isLocal = process.env.NODE_ENV !== 'production';

const pool = new Pool({
  user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  host: isLocal
    ? process.env.DB_HOST // public IP of db for local development
    : `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`, // Unix socket for Cloud Run for Production
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
