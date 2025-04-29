const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 7 * 1024 * 1024 }, }); // 7 MB limit
const storage = new Storage();
const bucketName = 'upload-center-bucket';
const bucket = storage.bucket(bucketName);

router.post('/', upload.single('file'), async (req, res) => {
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
