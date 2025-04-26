const express = require('express');
const { Storage } = require('@google-cloud/storage');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const storage = new Storage();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Change this to your actual bucket name
const bucketName = 'upload-center-bucket';

router.post('/', async (req, res) => {
    const { gcsUrl } = req.body;

    if (!gcsUrl) {
        return res.status(400).json({ error: 'Missing GCS URL' });
    }

    try {
        // Extract file path from URL
        const filename = decodeURIComponent(gcsUrl.split('/').pop());
        const file = storage.bucket(bucketName).file(`uploads/text-files/${filename}`);
        const [contents] = await file.download();
        const text = contents.toString('utf8');

        // Use Gemini 1.5 to analyze the text
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: `Summarize this text in 2-3 sentences:\n\n${text}` }] }],
        });

        const responseText = result.response.text();

        res.json({ result: responseText });
    } catch (err) {
        console.error('Vertex AI analysis failed:', err);
        res.status(500).json({ error: 'Vertex AI analysis failed' });
    }
});

module.exports = router;
