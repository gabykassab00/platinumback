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









const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Static files (for images)
app.use('/images', express.static('C:/Users/Computop/Desktop/perfumes/back/backend/images'));

module.exports = app;
