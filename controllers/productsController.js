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


















const pool = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const { genre, type, brand } = req.query;
    let query = 'SELECT * FROM myschema.primarytable WHERE 1=1';
    const values = [];
    let index = 1;

    if (genre) {
      query += ` AND genre = $${index++}`;
      values.push(genre);
    }

    if (type) {
      query += ` AND type = $${index++}`;
      values.push(type);
    }

    if (brand) {
      const brandList = brand.split(','); // For handling multiple brands
      const brandConditions = brandList.map((_, i) => `brand = $${index + i}`);
      query += ` AND (${brandConditions.join(' OR ')})`;
      values.push(...brandList);
      index += brandList.length;
    }

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM myschema.primarytable WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  getProductById
};