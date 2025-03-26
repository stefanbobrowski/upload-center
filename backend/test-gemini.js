require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: 'What is the sentiment of: "I love this product!"' }],
        },
      ],
    });

    console.log(result.response.text());
  } catch (err) {
    console.error('Gemini test failed:', err);
  }
})();
