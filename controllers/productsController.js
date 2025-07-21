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

// Cache for frequently accessed products
const productCache = new Map();
const CACHE_TTL = 30000; // 30 seconds cache lifetime

// Get all products with pagination
const getProducts = async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'all_products';
    if (productCache.has(cacheKey)) {
      const { timestamp, data } = productCache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) {
        return res.json(data);
      }
    }

    // Implement pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Only select needed columns
    const { rows } = await pool.query(`
      SELECT 
        id, title, info, final_price as "finalPrice", 
        original_price as "originalPrice", image_url as "imageUrl"
      FROM myschema.primarytable
      ORDER BY id
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    // Cache the results
    productCache.set(cacheKey, {
      timestamp: Date.now(),
      data: rows
    });

    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product by ID with caching
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check cache first
    if (productCache.has(id)) {
      return res.json(productCache.get(id));
    }

    // Only select needed columns
    const { rows } = await pool.query(`
      SELECT 
        id, title, info, final_price as "finalPrice", 
        original_price as "originalPrice", image_url as "imageUrl",
        tag, tagline, rate_count as "rateCount"
      FROM myschema.primarytable 
      WHERE id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cache the product
    productCache.set(id, rows[0]);
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Clear cache endpoint (optional, for development)
const clearCache = async (req, res) => {
  productCache.clear();
  res.json({ message: 'Cache cleared' });
};

module.exports = {
  getProducts,
  getProductById,
  clearCache // Optional
};