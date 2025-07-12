const db = require('../config/db');

const Product = {
  async getAll() {
    const { rows } = await db.query('SELECT * FROM products');
    return rows;
  },

  async create(product) {
    const { 
      title, 
      info, 
      originalPrice, 
      rateCount, 
      imageUrl,
      tag,
      tagline
    } = product;
    
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
      tag || null,
      tagline || null
    ];
    
    const { rows } = await db.query(query, values);
    return rows[0].id;
  }
};

module.exports = Product;