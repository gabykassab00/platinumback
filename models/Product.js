// const db = require('../config/db');

// const Product = {
//   async getAll() {
//     const { rows } = await db.query('SELECT * FROM products');
//     return rows;
//   },

//   async create(product) {
//     const { 
//       title, 
//       info, 
//       originalPrice, 
//       rateCount, 
//       imageUrl,
//       tag,
//       tagline
//     } = product;
    
//     const query = `
//       INSERT INTO products 
//         (title, info, final_price, original_price, rate_count, image_url, tag, tagline)
//       VALUES 
//         ($1, $2, $3, $4, $5, $6, $7, $8)
//       RETURNING id
//     `;
//     const values = [
//       title, 
//       info, 
//       finalPrice, 
//       originalPrice, 
//       rateCount, 
//       imageUrl,
//       tag || null,
//       tagline || null
//     ];
    
//     const { rows } = await db.query(query, values);
//     return rows[0].id;
//   }
// };

// module.exports = Product;




const db = require('../config/db');

const Product = {
  async getAll() {
    // Only select necessary columns to reduce data transfer
    const { rows } = await db.query(`
      SELECT 
        id, title, info, final_price as "finalPrice", 
        original_price as "originalPrice", image_url as "imageUrl",
        tag, tagline
      FROM products
      ORDER BY id
    `);
    return rows;
  },

  async create(product) {
    // Destructure with defaults to avoid undefined values
    const { 
      title, 
      info, 
      originalPrice, 
      rateCount = 0, // Default value
      imageUrl,
      tag = null,
      tagline = null,
      finalPrice = originalPrice // Default to original if not provided
    } = product;
    
    // Use parameterized query for security and performance
    const query = `
      INSERT INTO products 
        (title, info, final_price, original_price, rate_count, image_url, tag, tagline)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `;
    
    const values = [
      title, 
      info, 
      finalPrice, 
      originalPrice, 
      rateCount, 
      imageUrl,
      tag,
      tagline
    ];
    
    const { rows } = await db.query(query, values);
    return rows[0].id;
  }
};

module.exports = Product;