// backend/routes/upload-file.js
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const storage = new Storage();
const bucketName = 'upload-center-bucket';
const bucket = storage.bucket(bucketName);

// Rate limiter for uploads
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many uploads from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', uploadLimiter, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Upload attempt from IP: ${req.ip}`);

    const file = req.file;
    const folder = req.body.path || 'uploads/';
    const gcsFilename = `${folder.replace(/\/?$/, '/')}${Date.now()}-${file.originalname}`;
    const blob = bucket.file(gcsFilename);
    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
    });

    blobStream.on('error', (err) => {
        console.error('Error uploading to GCS:', err);
        res.status(500).json({ error: 'Failed to upload file' });
    });

    blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        console.log(`Uploaded to ${publicUrl}`);
        res.status(200).json({ url: publicUrl });
    });

    blobStream.end(file.buffer);
});

module.exports = router;
