// const express = require('express');
// const cors = require('cors');
// const productRoutes = require('./routes/productRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/products', productRoutes);

// // Static files (for images)per
// app.use('/images', express.static('C:/Users/Computop/Desktop/perfumes/back/backend/images'));

// module.exports = app;









// const express = require('express');
// const cors = require('cors');
// const productRoutes = require('./routes/productRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/products', productRoutes);

// // Static files (for images)
// app.use('/images', express.static('C:/Users/Computop/Desktop/perfumes/back/backend/images'));

// module.exports = app;










// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const productRoutes = require('./routes/productRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/products', productRoutes);

// // Serve images from the /images folder (relative to this file)
// app.use('/images', express.static(path.join(__dirname, 'images')));

// module.exports = app;












// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const sharp = require('sharp'); // 🔧 install via: npm install sharp
// const productRoutes = require('./routes/productRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/products', productRoutes);

// // ✅ Dynamically optimize & serve images using sharp
// app.get('/images/:folder/:filename', async (req, res) => {
//   const { folder, filename } = req.params;
//   const imagePath = path.join(__dirname, 'images', folder, filename);

//   try {
//     if (!fs.existsSync(imagePath)) {
//       return res.status(404).send('Image not found');
//     }

//     const transform = sharp(imagePath)
//       .resize({ width: 600 }) // 👈 Adjust as needed
//       .jpeg({ quality: 75 }); // 👈 Compress while keeping good quality

//     res.setHeader('Content-Type', 'image/jpeg');
//     transform.pipe(res);
//   } catch (err) {
//     console.error('Error processing image:', err);
//     res.status(500).send('Error loading image');
//   }
// });

// // ✅ Optional: fallback to serve raw files if sharp fails (e.g. for PNGs)
// // app.use('/images', express.static(path.join(__dirname, 'images')));

// module.exports = app;







// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const sharp = require('sharp');
// const productRoutes = require('./routes/productRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/products', productRoutes);

// // ✅ Dynamically optimize & serve images
// app.get('/images/:folder/:filename', async (req, res) => {
//   const { folder, filename } = req.params;
//   const imagePath = path.join(__dirname, 'images', folder, filename);

//   try {
//     if (!fs.existsSync(imagePath)) {
//       return res.status(404).send('Image not found');
//     }

//     const image = sharp(imagePath);
//     const metadata = await image.metadata();

//     // Only optimize if format is supported
//     if (!['jpeg', 'jpg', 'png', 'webp'].includes(metadata.format)) {
//       return res.status(415).send('Unsupported image format');
//     }

//     res.setHeader('Content-Type', `image/${metadata.format}`);

//     // Apply optimization
//     const transformer = image.resize({ width: 600 });

//     if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
//       transformer.jpeg({ quality: 75 });
//     } else if (metadata.format === 'png') {
//       transformer.png({ compressionLevel: 8 });
//     } else if (metadata.format === 'webp') {
//       transformer.webp({ quality: 75 });
//     }

//     transformer.pipe(res);
//   } catch (err) {
//     console.error('Error processing image:', err.message);
//     res.status(500).send('Error loading image');
//   }
// });

// module.exports = app;














// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const sharp = require('sharp');
// const compression = require('compression'); // ✅ compresses all responses
// const productRoutes = require('./routes/productRoutes');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(compression()); // ✅ gzip compression

// // API Routes
// app.use('/api/products', productRoutes);

// // ✅ Optimized Image Handler with Caching, WebP support, and Dynamic Resizing
// app.get('/images/:folder/:filename', async (req, res) => {
//   const { folder, filename } = req.params;
//   const width = parseInt(req.query.w) || 600; // ✅ optional ?w=300
//   const imagePath = path.join(__dirname, 'images', folder, filename);

//   try {
//     if (!fs.existsSync(imagePath)) {
//       return res.status(404).send('Image not found');
//     }

//     const image = sharp(imagePath);
//     const metadata = await image.metadata();

//     res.setHeader('Cache-Control', 'public, max-age=31536000'); // ✅ cache for 1 year

//     const accept = req.headers['accept'] || '';
//     if (accept.includes('image/webp')) {
//       res.setHeader('Content-Type', 'image/webp');
//       return image.resize({ width }).webp({ quality: 75 }).pipe(res); // ✅ convert to WebP
//     }

//     res.setHeader('Content-Type', `image/${metadata.format}`);
//     return image.resize({ width }).toFormat(metadata.format).pipe(res); // ✅ serve resized
//   } catch (err) {
//     console.error('Image error:', err.message);
//     return res.status(500).send('Image processing failed');
//   }
// });

// module.exports = app;

















// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const sharp = require('sharp');
// const compression = require('compression');
// require('dotenv').config(); // ✅ Load environment variables

// const productRoutes = require('./routes/productRoutes');
// const emailRoutes = require('./routes/emailRoutes'); // ✅ EmailJS route

// const app = express();

// // =========================
// // Middleware
// // =========================
// app.use(cors());
// app.use(express.json());
// app.use(compression()); // ✅ Enable Gzip compression

// // =========================
// // API Routes
// // =========================
// app.use('/api/products', productRoutes);
// app.use('/api/email', emailRoutes); // ✅ Email sending route

// // =========================
// // Optimized Image Handling
// // =========================
// app.get('/images/:folder/:filename', async (req, res) => {
//   const { folder, filename } = req.params;
//   const width = parseInt(req.query.w) || 600;
//   const imagePath = path.join(__dirname, 'images', folder, filename);

//   try {
//     if (!fs.existsSync(imagePath)) {
//       return res.status(404).send('Image not found');
//     }

//     const image = sharp(imagePath);
//     const metadata = await image.metadata();

//     res.setHeader('Cache-Control', 'public, max-age=31536000');

//     const accept = req.headers['accept'] || '';
//     if (accept.includes('image/webp')) {
//       res.setHeader('Content-Type', 'image/webp');
//       return image.resize({ width }).webp({ quality: 75 }).pipe(res);
//     }

//     res.setHeader('Content-Type', `image/${metadata.format}`);
//     return image.resize({ width }).toFormat(metadata.format).pipe(res);
//   } catch (err) {
//     console.error('Image processing error:', err.message);
//     return res.status(500).send('Image processing failed');
//   }
// });

// // =========================
// // Export App
// // =========================
// module.exports = app;







const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const compression = require('compression');
require('dotenv').config(); // ✅ Load environment variables

const productRoutes = require('./routes/productRoutes');
const emailRoutes = require('./routes/emailRoutes'); // ✅ EmailJS route

const app = express();

// =========================
// Middleware
// =========================
app.use(cors({
  origin: 'https://platinumfront.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(compression()); // ✅ Enable Gzip compression

// =========================
// API Routes
// =========================
app.use('/api/products', productRoutes);
app.use('/api/email', emailRoutes); // ✅ Email sending route

// =========================
// Optimized Image Handling
// =========================
app.get('/images/:folder/:filename', async (req, res) => {
  const { folder, filename } = req.params;
  const width = parseInt(req.query.w) || 600;
  const imagePath = path.join(__dirname, 'images', folder, filename);

  try {
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    res.setHeader('Cache-Control', 'public, max-age=31536000');

    const accept = req.headers['accept'] || '';
    if (accept.includes('image/webp')) {
      res.setHeader('Content-Type', 'image/webp');
      return image.resize({ width }).webp({ quality: 75 }).pipe(res);
    }

    res.setHeader('Content-Type', `image/${metadata.format}`);
    return image.resize({ width }).toFormat(metadata.format).pipe(res);
  } catch (err) {
    console.error('Image processing error:', err.message);
    return res.status(500).send('Image processing failed');
  }
});

// =========================
// Export App
// =========================
module.exports = app;
