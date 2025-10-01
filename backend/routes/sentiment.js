const express = require("express");
const { VertexAI } = require("@google-cloud/vertexai");
const { verifyRecaptcha } = require("../helpers/verifyRecaptcha");

const router = express.Router();

// Init Vertex AI once
const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: process.env.GCLOUD_LOCATION || "us-central1",
});

// Define a schema for function calling
const sentimentSchema = {
  name: "analyze_sentiment",
  description: "Analyze sentiment of text and return structured results.",
  parameters: {
    type: "object",
    properties: {
      sentiment: {
        type: "string",
        enum: ["positive", "negative", "neutral"],
        description: "The overall sentiment category."
      },
      score: {
        type: "number",
        description: "A score from -1.0 (negative) to +1.0 (positive)."
      }
    },
    required: ["sentiment", "score"]
  }
};

router.post("/", async (req, res) => {
  console.log(`[SENTIMENT] Request from ${req.ip} @ ${new Date().toISOString()}`);

  const { text } = req.body;
  const recaptchaToken = req.headers["x-recaptcha-token"];

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required." });
  }
  if (!recaptchaToken) {
    return res.status(400).json({ error: "Missing reCAPTCHA token." });
  }

  // Verify reCAPTCHA
  try {
    const { success, score } = await verifyRecaptcha(recaptchaToken);
    if (!success || score < 0.5) {
      return res.status(403).json({ error: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    console.error("reCAPTCHA error:", err);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA." });
  }

  // Analyze with Vertex AI function calling
  try {
    const model = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ functionDeclarations: [sentimentSchema] }]
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text }] }]
    });

    const fnCall = result.response?.candidates?.[0]?.content?.parts?.[0]?.functionCall;
    if (!fnCall || !fnCall.args) {
      console.error("No function call returned:", JSON.stringify(result, null, 2));
      return res.status(500).json({ error: "No structured sentiment returned." });
    }

    // ✅ Safe structured JSON (no fences, no parsing issues)
    const sentiment = fnCall.args;

    res.json({ sentiment });
  } catch (err) {
    console.error("Vertex AI Sentiment Error:", err);
    res.status(500).json({ error: "Sentiment analysis failed." });
  }
});

module.exports = router;
