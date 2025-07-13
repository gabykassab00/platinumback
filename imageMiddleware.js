// imageMiddleware.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

router.get('/:imageName', async (req, res) => {
  const imagePath = path.join(__dirname, 'images', req.params.imageName);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).send('Image not found');
  }

  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Allow only certain formats (skip unsupported ones)
    if (!['jpeg', 'jpg', 'png', 'webp'].includes(metadata.format)) {
      console.warn(`Unsupported format: ${metadata.format}`);
      return res.status(415).send('Unsupported image format');
    }

    res.set('Content-Type', `image/${metadata.format}`);
    fs.createReadStream(imagePath).pipe(res);
  } catch (err) {
    console.error(`Error serving image ${req.params.imageName}:`, err.message);
    res.status(500).send('Error processing image');
  }
});

module.exports = router;
