// const pool = require('../config/db');

// const getProducts = async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM platinum');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   getProducts
// };





// const pool = require('../config/db');

// // Get all products
// const getProducts = async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM platinum');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Get single product by ID
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rows } = await pool.query('SELECT * FROM platinum WHERE id = $1', [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error('Error fetching product by ID:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   getProducts,
//   getProductById
// };
















// const pool = require('../config/db');

// // Get all products
// const getProducts = async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM myschema.primarytable');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Get single product by ID
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rows } = await pool.query('SELECT * FROM myschema.primarytable WHERE id = $1', [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error('Error fetching product by ID:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   getProducts,
//   getProductById
// };













// const pool = require('../config/db');

// // Get all products
// const getProducts = async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT * FROM myschema.primarytable');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Get single product by ID
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rows } = await pool.query('SELECT * FROM myschema.primarytable WHERE id = $1', [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error('Error fetching product by ID:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   getProducts,
//   getProductById
// };










const pool = require('../config/db');

// Simple memory cache
const productCache = new Map();

const getProducts = async (req, res) => {
  try {
    // Cache check (1ms response if cached)
    const cacheKey = 'all_products_light';
    if (productCache.has(cacheKey)) {
      return res.json(productCache.get(cacheKey));
    }

    // Minimal query - only absolute essentials
    const { rows } = await pool.query(`
      SELECT 
        id,
        name AS title,        -- Adjust to your actual column name
        price AS finalPrice,  -- Adjust to your actual column name
        image_url AS imageUrl -- Adjust to your actual column name
      FROM myschema.primarytable
      ORDER BY id
      LIMIT 50                -- Fetch less data initially
    `);

    // Cache for 15 seconds
    productCache.set(cacheKey, rows);
    setTimeout(() => productCache.delete(cacheKey), 15000);

    res.json(rows);
  } catch (error) {
    console.error('Fast fetch error:', error);
    res.status(500).json({ error: 'Loading products - please refresh' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Cache check
    if (productCache.has(id)) {
      return res.json(productCache.get(id));
    }

    // Minimal single product query
    const { rows } = await pool.query(`
      SELECT 
        id,
        name AS title,
        description AS info,
        price AS finalPrice,
        image_url AS imageUrl
      FROM myschema.primarytable 
      WHERE id = $1
    `, [id]);

    if (!rows.length) return res.status(404).json({ error: 'Not found' });

    // Cache for 5 minutes
    productCache.set(id, rows[0]);
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Fast single fetch error:', error);
    res.status(500).json({ error: 'Loading product - please try again' });
  }
};

module.exports = { getProducts, getProductById };





