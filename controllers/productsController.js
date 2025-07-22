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






















const pool = require('../config/db');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Cache configuration
const NODE_ENV = process.env.NODE_ENV || 'development';
const CACHE_TTL = NODE_ENV === 'production' ? 3600000 : 60000; // 1 hour or 1 minute

// Get all products (optimized)
const getProducts = async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'all_products';
    const cachedData = await pool.query('SELECT * FROM product_cache WHERE key = $1', [cacheKey]);
    
    if (cachedData.rows.length > 0 && 
        Date.now() - cachedData.rows[0].updated_at < CACHE_TTL) {
      return res.json(cachedData.rows[0].data);
    }

    // Fetch fresh data
    const { rows } = await pool.query(`
      SELECT 
        id,
        name AS title,
        price AS finalPrice,
        image_url AS imageUrl,
        brand,
        genre,
        created_at,
        rating
      FROM myschema.primarytable
      ORDER BY created_at DESC
      LIMIT 100
    `);

    // Update cache
    await pool.query(`
      INSERT INTO product_cache (key, data)
      VALUES ($1, $2)
      ON CONFLICT (key) 
      DO UPDATE SET data = $2, updated_at = NOW()
    `, [cacheKey, rows]);

    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product by ID (optimized)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check cache first
    const cacheKey = `product_${id}`;
    const cachedData = await pool.query('SELECT * FROM product_cache WHERE key = $1', [cacheKey]);
    
    if (cachedData.rows.length > 0) {
      return res.json(cachedData.rows[0].data);
    }

    const { rows } = await pool.query(`
      SELECT 
        id,
        name AS title,
        price AS finalPrice,
        description AS info,
        image_url AS imageUrl,
        brand,
        genre,
        created_at,
        rating,
        tags
      FROM myschema.primarytable 
      WHERE id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cache for 1 day
    await pool.query(`
      INSERT INTO product_cache (key, data)
      VALUES ($1, $2)
      ON CONFLICT (key) 
      DO UPDATE SET data = $2, updated_at = NOW()
    `, [cacheKey, rows[0]]);

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Image optimization endpoint
const getOptimizedImage = async (req, res) => {
  const { imageName } = req.params;
  const width = parseInt(req.query.w) || 600;
  const quality = parseInt(req.query.q) || 80;
  const imagePath = path.join(__dirname, '../../public/images', imageName);

  try {
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }

    // Set aggressive caching
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    const accept = req.headers['accept'] || '';
    const useWebP = accept.includes('image/webp');

    if (useWebP) {
      res.type('image/webp');
      return sharp(imagePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, reductionEffort: 6 })
        .pipe(res);
    }

    const metadata = await sharp(imagePath).metadata();
    res.type(`image/${metadata.format}`);
    return sharp(imagePath)
      .resize({ width, withoutEnlargement: true })
      .toFormat(metadata.format)
      .pipe(res);
  } catch (error) {
    console.error('Image processing error:', error);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
    return res.status(500).send('Image processing failed');
  }
};

module.exports = {
  getProducts,
  getProductById,
  getOptimizedImage
};