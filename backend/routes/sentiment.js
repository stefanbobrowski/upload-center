const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Load your Gemini API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const prompt = `
Analyze the sentiment of the following text and return only this JSON format:
{ "sentiment": "positive", "score": 0.92 }

Text: "${text}"
`;

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    });

    const output = result.response.text().trim();

    // Try to extract the JSON object from the output
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: output };

    res.json({ sentiment: parsed });
  } catch (err) {
    console.error('Gemini Sentiment Error:', err);
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

module.exports = router;
