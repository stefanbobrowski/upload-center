const express = require("express");
const multer = require("multer");
const fs = require("fs");
const vision = require("@google-cloud/vision");
const { VertexAI } = require("@google-cloud/vertexai");
const { verifyRecaptcha } = require("../helpers/verifyRecaptcha");

const router = express.Router();

// Multer config
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});

const visionClient = new vision.ImageAnnotatorClient();
const vertexAI = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: process.env.GCLOUD_LOCATION || "us-central1",
});

// Function-calling schema
const analyzeImageSchema = {
  name: "analyze_image",
  description: "Analyze an image and return a short structured description.",
  parameters: {
    type: "object",
    properties: {
      description: {
        type: "string",
        description: "A short, safe description of the image content."
      }
    },
    required: ["description"]
  }
};

router.post("/", upload.single("image"), async (req, res) => {
  const prompt = (req.body.prompt || "Describe this image.").trim().slice(0, 300);
  const recaptchaToken = req.body.recaptchaToken;

  if (!recaptchaToken) return res.status(400).json({ error: "Missing reCAPTCHA token." });
  if (!req.file) return res.status(400).json({ error: "Image file is required." });

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

  const imagePath = req.file.path;

  try {
    // ✅ Content safety via Vision API
    const [result] = await visionClient.safeSearchDetection(imagePath);
    const safe = result.safeSearchAnnotation;
    if (
      ["LIKELY", "VERY_LIKELY"].includes(safe.adult) ||
      ["LIKELY", "VERY_LIKELY"].includes(safe.violence) ||
      safe.racy === "VERY_LIKELY"
    ) {
      return res.status(403).json({ error: "Image flagged as unsafe." });
    }

    // ✅ Read + encode
    const base64Image = fs.readFileSync(imagePath).toString("base64");

    // ✅ Vertex AI with function calling
    const model = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ functionDeclarations: [analyzeImageSchema] }],
    });

    const resultAI = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: req.file.mimetype, data: base64Image } },
            { text: prompt },
          ],
        },
      ],
      toolConfig: {
        functionCallingConfig: {
          mode: "ANY", // Force Gemini to pick a function instead of free text
        },
      },
    });

    // ✅ Extract function call
    const fnCall = resultAI.response?.candidates?.[0]?.content?.parts?.find(
      (p) => p.functionCall
    )?.functionCall;

    if (!fnCall || !fnCall.args) {
      console.error("❌ No structured functionCall:", JSON.stringify(resultAI, null, 2));
      return res.status(500).json({ error: "No structured description returned." });
    }

    // ✅ Clean, structured result
    const response = fnCall.args;
    res.json({ response });
  } catch (err) {
    console.error("Image analysis error:", err);
    res.status(500).json({ error: "Error analyzing image." });
  } finally {
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath); // cleanup temp upload
  }
});

module.exports = router;
