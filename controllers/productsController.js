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

// Get paginated products
const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const offset = parseInt(req.query.offset) || 0;

    const filters = [];
    const values = [];
    let index = 1;

    if (req.query.genre) {
      filters.push(`genre ILIKE $${index++}`);
      values.push(req.query.genre);
    }

    if (req.query.maxPrice) {
      filters.push(`price <= $${index++}`);
      values.push(parseFloat(req.query.maxPrice));
    }

    if (req.query.brand) {
      filters.push(`brand ILIKE $${index++}`);
      values.push(req.query.brand);
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const productsQuery = `
      SELECT * FROM myschema.primarytable
      ${whereClause}
      ORDER BY id DESC
      LIMIT $${index++} OFFSET $${index}
    `;
    values.push(limit, offset);

    const countQuery = `SELECT COUNT(*) FROM myschema.primarytable ${whereClause}`;
    const [productsResult, countResult] = await Promise.all([
      pool.query(productsQuery, values),
      pool.query(countQuery, values.slice(0, values.length - 2))
    ]);

    res.json({
      products: productsResult.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProducts
};
