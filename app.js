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












const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // 🔧 install via: npm install sharp
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);

// ✅ Dynamically optimize & serve images using sharp
app.get('/images/:folder/:filename', async (req, res) => {
  const { folder, filename } = req.params;
  const imagePath = path.join(__dirname, 'images', folder, filename);

  try {
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }

    const transform = sharp(imagePath)
      .resize({ width: 600 }) // 👈 Adjust as needed
      .jpeg({ quality: 75 }); // 👈 Compress while keeping good quality

    res.setHeader('Content-Type', 'image/jpeg');
    transform.pipe(res);
  } catch (err) {
    console.error('Error processing image:', err);
    res.status(500).send('Error loading image');
  }
});

// ✅ Optional: fallback to serve raw files if sharp fails (e.g. for PNGs)
// app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
