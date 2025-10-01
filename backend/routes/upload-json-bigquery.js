const express = require("express");
const { BigQuery } = require("@google-cloud/bigquery");
const { Storage } = require("@google-cloud/storage");
const rateLimit = require("express-rate-limit");
const { verifyRecaptcha } = require("../helpers/verifyRecaptcha");

const router = express.Router();
const bigquery = new BigQuery();
const storage = new Storage();

const DATASET = "uploads";
const TABLE = "json_uploads";
const BUCKET_NAME = "upload-center-bucket";

// Limit to 5 analysis requests per 15 minutes per IP
const bigQueryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many analysis requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", bigQueryLimiter, async (req, res) => {
  const { gcsUrl } = req.body;
  const recaptchaToken = req.headers["x-recaptcha-token"];

  if (!gcsUrl) return res.status(400).json({ error: "Missing GCS URL." });
  if (!recaptchaToken) return res.status(400).json({ error: "Missing reCAPTCHA token." });

  console.log(`BigQuery load attempt from IP: ${req.ip}`);

  // ✅ reCAPTCHA verification
  try {
    const { success, score } = await verifyRecaptcha(recaptchaToken);
    if (!success || score < 0.5) {
      return res.status(403).json({ error: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    console.error("Error verifying reCAPTCHA:", err);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA." });
  }

  try {
    const filename = decodeURIComponent(gcsUrl.split("/").pop());
    const file = storage.bucket(BUCKET_NAME).file(`uploads/json/${filename}`);

    console.log("Loading file into BigQuery:", filename);

    const [job] = await bigquery.dataset(DATASET).table(TABLE).load(file, {
      sourceFormat: "NEWLINE_DELIMITED_JSON",
      autodetect: true,
      writeDisposition: "WRITE_TRUNCATE", // Clear old data before load
    });

    console.log(`BigQuery load job ${job.id} completed`);

    // --- Always get total row count ---
    const [totalRowsResult] = await bigquery.query({
      query: `SELECT COUNT(*) as total_rows FROM \`${bigquery.projectId}.${DATASET}.${TABLE}\``,
      location: "US",
    });

    let totalRows = Number(totalRowsResult[0]?.total_rows || 0);

    // --- Try to detect category field dynamically ---
    let categorySummary = [];
    try {
      const [schema] = await bigquery
        .dataset(DATASET)
        .table(TABLE)
        .getMetadata();

      const fields = schema.schema.fields.map((f) => f.name);
      let categoryField = fields.find((f) => f.toLowerCase() === "category");

      if (!categoryField) {
        // fallback: first STRING field
        categoryField = fields.find((f) => f.type === "STRING");
      }

      if (categoryField) {
        const [catSummaryResult] = await bigquery.query({
          query: `
            SELECT \`${categoryField}\` as category, COUNT(*) as total
            FROM \`${bigquery.projectId}.${DATASET}.${TABLE}\`
            GROUP BY category
            ORDER BY total DESC
            LIMIT 10
          `,
          location: "US",
        });

        categorySummary = catSummaryResult.map((r) => ({
          category: r.category,
          total: Number(r.total),
        }));
      }
    } catch (catErr) {
      console.warn("Category summary skipped:", catErr.message);
    }

    // --- Try to detect score field ---
    let averageScore = null;
    try {
      const [schema] = await bigquery
        .dataset(DATASET)
        .table(TABLE)
        .getMetadata();

      const fields = schema.schema.fields.map((f) => f.name.toLowerCase());
      if (fields.includes("score")) {
        const [avgScoreResult] = await bigquery.query({
          query: `
            SELECT AVG(score) as avg_score
            FROM \`${bigquery.projectId}.${DATASET}.${TABLE}\`
          `,
          location: "US",
        });
        averageScore =
          avgScoreResult[0]?.avg_score !== null
            ? Number(avgScoreResult[0]?.avg_score)
            : null;
      }
    } catch (avgErr) {
      console.warn("Average score skipped:", avgErr.message);
    }

    res.status(200).json({
      message: "✅ File loaded and analyzed in BigQuery",
      jobId: job.id,
      summary: {
        totalRows,
        categorySummary,
        averageScore,
      },
    });
  } catch (err) {
    console.error("BigQuery load error:", err);
    res.status(500).json({
      error: err?.message || "Unknown error during BigQuery load",
      details: err,
    });
  }
});

module.exports = router;
