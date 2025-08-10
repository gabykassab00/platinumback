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

// const getProducts = async (req, res) => {
//   try {
//     const { genre, type, brand } = req.query;
//     let query = 'SELECT * FROM myschema.primarytable WHERE 1=1';
//     const values = [];
//     let index = 1;

//     if (genre) {
//       query += ` AND genre = $${index++}`;
//       values.push(genre);
//     }

//     if (type) {
//       query += ` AND type = $${index++}`;
//       values.push(type);
//     }

//     if (brand) {
//       const brandList = brand.split(','); // For handling multiple brands
//       const brandConditions = brandList.map((_, i) => `brand = $${index + i}`);
//       query += ` AND (${brandConditions.join(' OR ')})`;
//       values.push(...brandList);
//       index += brandList.length;
//     }

//     const { rows } = await pool.query(query, values);
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


















// controllers/productController.js
const { getClient } = require('../config/db');

const getProducts = async (req, res) => {
  let client;
  try {
    client = await getClient();
    
    // Validate client connection
    await client.query('SELECT 1');
    
    const { genre, type, brand } = req.query;
    let query = 'SELECT * FROM myschema.primarytable WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    // Add filters
    if (genre) {
      query += ` AND genre = $${paramIndex++}`;
      values.push(genre);
    }

    if (type) {
      query += ` AND type = $${paramIndex++}`;
      values.push(type);
    }

    if (brand) {
      const brands = brand.split(',').filter(Boolean);
      if (brands.length > 0) {
        query += ` AND brand IN (${brands.map((_, i) => `$${paramIndex + i}`).join(',')})`;
        values.push(...brands);
        paramIndex += brands.length;
      }
    }

    // Execute query
    const { rows } = await client.query(query, values);
    res.json(rows);
    
  } catch (error) {
    console.error('Database error:', {
      message: error.message,
      code: error.code,
      query: error.query,
      parameters: error.parameters
    });
    
    res.status(500).json({ 
      error: 'Database operation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
    
  } finally {
    // Ensure client is always released
    if (client) {
      try {
        await client.release();
      } catch (releaseError) {
        console.error('Error releasing client:', releaseError);
      }
    }
  }
};

module.exports = {
  getProducts
};