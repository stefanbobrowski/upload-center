const express = require("express");
const multer = require("multer");
const fs = require("fs");
const fetch = require("node-fetch");
const vision = require("@google-cloud/vision");
const { verifyRecaptcha } = require("../helpers/verifyRecaptcha");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

if (!GEMINI_API_KEY) throw new Error("Gemini API key is required.");
if (!RECAPTCHA_SECRET_KEY) throw new Error("reCAPTCHA secret key is required.");

const visionClient = new vision.ImageAnnotatorClient();

router.post("/", upload.single("image"), async (req, res) => {
  const userPrompt = req.body.prompt || "Describe this image.";
  const prompt = `Respond briefly: ${userPrompt} (Limit your answer to one short sentence.)`;
  const cleanPrompt = prompt.trim().replace(/[^a-zA-Z0-9 ?.,!"()\-]/g, "");
  const recaptchaToken = req.body.recaptchaToken;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "Missing reCAPTCHA token." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required." });
  }

  if (!cleanPrompt || cleanPrompt.length > 300) {
    return res.status(400).json({ error: "Prompt must be 1–300 characters." });
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

  const imagePath = req.file.path;

  try {
    // NSFW filtering using Cloud Vision SafeSearch
    const [result] = await visionClient.safeSearchDetection(imagePath);
    const safe = result.safeSearchAnnotation;

    if (
      safe.adult === "LIKELY" ||
      safe.adult === "VERY_LIKELY" ||
      safe.violence === "LIKELY" ||
      safe.violence === "VERY_LIKELY" ||
      safe.racy === "VERY_LIKELY"
    ) {
      console.warn("Blocked NSFW image:", safe);
      return res
        .status(403)
        .json({ error: "Image flagged as unsafe by content filter." });
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: req.file.mimetype,
                    data: base64Image,
                  },
                },
                {
                  text: cleanPrompt,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json();
      console.error("Gemini API error:", errorData);
      return res.status(geminiRes.status).json({
        error: errorData.error?.message || "Unknown error from Gemini API.",
      });
    }

    const data = await geminiRes.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));

    const responseText = data.candidates?.length
      ? data.candidates[0].content?.parts?.[0]?.text ||
        "Response format unexpected."
      : "No candidates returned from Gemini.";

    res.json({ response: responseText });
  } catch (err) {
    console.error("Error analyzing image:", err);
    res.status(500).json({ error: "Error analyzing image." });
  } finally {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Cleanup temp file
    }
  }
});

module.exports = router;
