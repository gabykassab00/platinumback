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










const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);

// Serve images from the /images folder (relative to this file)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
