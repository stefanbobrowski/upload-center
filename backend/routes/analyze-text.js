const express = require("express");
const { Storage } = require("@google-cloud/storage");
const { VertexAI } = require("@google-cloud/vertexai");
const { verifyRecaptcha } = require("../helpers/verifyRecaptcha");

const router = express.Router();
const storage = new Storage();
const bucketName = "upload-center-bucket";

const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: process.env.GCLOUD_LOCATION || "us-central1",
});

router.post("/", async (req, res) => {
  const { gcsUrl } = req.body;
  const recaptchaToken = req.headers["x-recaptcha-token"];

  if (!gcsUrl) return res.status(400).json({ error: "Missing GCS URL." });
  if (!recaptchaToken) return res.status(400).json({ error: "Missing reCAPTCHA token." });

  // reCAPTCHA check
  try {
    const { success, score } = await verifyRecaptcha(recaptchaToken);
    if (!success || score < 0.5) {
      return res.status(403).json({ error: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    console.error("reCAPTCHA error:", err);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA." });
  }

  try {
    // Download text file from GCS
    const filename = decodeURIComponent(gcsUrl.split("/").pop());
    const file = storage.bucket(bucketName).file(`uploads/text-files/${filename}`);
    const [contents] = await file.download();
    const text = contents.toString("utf8");

    const MAX_CHARS = 7000;
    const safeText = text.slice(0, MAX_CHARS);

    // Vertex function-calling with enforced JSON
    const model = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize the following text into 2–3 sentences. 
Return only JSON with this shape:
{ "summary": string }

Text:
${safeText}`,
            },
          ],
        },
      ],
    });

    // ✅ Pull structured JSON directly from response
    const raw = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(raw);

    res.json({ summary: parsed.summary });
  } catch (err) {
    console.error("Vertex AI text analysis failed:", err);
    res.status(500).json({ error: "Text analysis failed." });
  }
});

module.exports = router;
