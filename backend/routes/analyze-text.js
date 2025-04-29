const express = require("express");
const { Storage } = require("@google-cloud/storage");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { verifyRecaptcha } = require("../helpers/verifyRecaptcha");

const router = express.Router();
const storage = new Storage();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const bucketName = "upload-center-bucket";

router.post("/", async (req, res) => {
  const { gcsUrl } = req.body;
  const recaptchaToken = req.headers["x-recaptcha-token"];

  if (!gcsUrl) {
    return res.status(400).json({ error: "Missing GCS URL." });
  }

  if (!recaptchaToken) {
    return res.status(400).json({ error: "Missing reCAPTCHA token." });
  }

  // ✅ reCAPTCHA verification
  try {
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);

    const score = recaptchaResult.score ?? 0;
    const success = recaptchaResult.success === true;

    if (!success || score < 0.5) {
      console.warn("⚠️ reCAPTCHA verification failed", {
        ip: req.ip,
        score,
        success,
      });
      return res.status(403).json({ error: "reCAPTCHA verification failed." });
    }
  } catch (err) {
    console.error("Error verifying reCAPTCHA:", err);
    return res.status(500).json({ error: "Failed to verify reCAPTCHA." });
  }

  try {
    // Extract file contents
    const filename = decodeURIComponent(gcsUrl.split("/").pop());
    const file = storage
      .bucket(bucketName)
      .file(`uploads/text-files/${filename}`);
    const [contents] = await file.download();
    const text = contents.toString("utf8");

    // Analyze with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: `Summarize this text in 2-3 sentences:\n\n${text}` }],
        },
      ],
    });

    const responseText = result.response.text();

    res.json({ result: responseText });
  } catch (err) {
    console.error("Vertex AI analysis failed:", err);
    res.status(500).json({ error: "Vertex AI analysis failed." });
  }
});

module.exports = router;
