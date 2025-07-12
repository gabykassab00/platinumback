// const express = require('express');
// const router = express.Router();
// const { getProducts } = require('../controllers/productsController');

// router.get('/', getProducts);

// module.exports = router;






// const express = require('express');
// const router = express.Router();
// const { getProducts, getProductById } = require('../controllers/productsController');

// // GET all products
// router.get('/', getProducts);

// // GET product by ID
// router.get('/:id', getProductById);

// module.exports = router;









// const express = require('express');
// const router = express.Router();
// const { getProducts, getProductById } = require('../controllers/productsController');
// const db = require('../config/db');

// // GET all products
// router.get('/', getProducts);

// // ✅ MUST come before /:id
// router.get('/recommend', async (req, res) => {
//   const { baseImagePath, genre } = req.query;

//   try {
//     let query = `SELECT * FROM platinum WHERE image_path ILIKE $1`;
//     const values = [`%images/${baseImagePath}/%`]; // no leading slash

//     if (baseImagePath === 'jehiz' && genre) {
//       query += ` AND genre = $2`;
//       values.push(genre);
//     }

//     query += ` ORDER BY RANDOM() LIMIT 4`;

//     console.log('Running query:', query, 'with values:', values);

//     const result = await db.query(query, values);
//     res.json(result.rows);
//   } catch (error) {
//     console.error('Error fetching recommendations:', error.message);
//     res.status(500).json({ error: 'Failed to fetch recommended products' });
//   }
// });

// // GET product by ID — must come after /recommend
// router.get('/:id', getProductById);

// module.exports = router;
















const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getProducts, getProductById } = require('../controllers/productsController');

// ==============================
// GET /api/products/           → All products
// ==============================
router.get('/', getProducts);

// ==============================
// GET /api/products/recommend  → Recommendations
// ==============================
router.get('/recommend', async (req, res) => {
  const { baseImagePath, genre } = req.query;

  try {
    let query = `SELECT * FROM platinum WHERE image_path ILIKE $1`;
    const values = [`%images/${baseImagePath}/%`];

    if (baseImagePath === 'jehiz' && genre) {
      query += ` AND genre = $2`;
      values.push(genre);
    }

    query += ` ORDER BY RANDOM() LIMIT 4`;

    console.log('Running query:', query, 'with values:', values);

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    res.status(500).json({ error: 'Failed to fetch recommended products' });
  }
});

// ==============================
// GET /api/products/search?q=  → Full text search
// ==============================
router.get('/search', async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Search query is required.' });
  }

  try {
    const searchTerm = `%${query.toLowerCase()}%`;

    const result = await db.query(
      `SELECT * FROM platinum WHERE LOWER(name) LIKE $1 ORDER BY name ASC LIMIT 50`,
      [searchTerm]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error searching products:', err);
    res.status(500).json({ error: 'Failed to fetch search results.' });
  }
});

// ==============================
// GET /api/products/:id        → Single product by ID
// ==============================
router.get('/:id', getProductById);

module.exports = router;
