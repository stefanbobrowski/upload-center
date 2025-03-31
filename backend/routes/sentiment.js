const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  console.log(
    `[SENTIMENT] IP: ${req.ip}, UA: ${req.get(
      'user-agent'
    )}, Time: ${new Date().toISOString()}`
  );

  const { text } = req.body;
  const recaptchaToken = req.headers['x-recaptcha-token'];

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required.' });
  }

  if (!recaptchaToken) {
    return res.status(400).json({ error: 'Missing reCAPTCHA token' });
  }

  try {
    // ✅ Verify reCAPTCHA v3
    const verifyRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    const { success, score } = verifyRes.data;
    console.log(`[reCAPTCHA] Score: ${score}, Success: ${success}`);

    if (!success || score < 0.5) {
      return res.status(403).json({ error: 'Failed reCAPTCHA verification' });
    }

    // ✅ Analyze with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const prompt = `
Analyze the sentiment of the following text and return only this JSON format:
{ "sentiment": "positive", "score": 0.92 }

Text: "${text}"
`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const output = result.response.text().trim();
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: output };

    res.json({ sentiment: parsed });
  } catch (err) {
    console.error('Gemini Sentiment Error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Sentiment analysis failed' });
    }
  }
});

module.exports = router;
