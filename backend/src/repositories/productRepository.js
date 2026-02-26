const pool = require("../config/database");

async function createProduct({ code, name, value }) {
  const query = `
    INSERT INTO products (code, name, value)
    VALUES ($1, $2, $3)
    RETURNING id, code, name, value
  `;
  const values = [code, name, value];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function findAllProducts() {
  const query = `
    SELECT id, code, name, value
    FROM products
    ORDER BY id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function findProductById(id) {
  const query = `
    SELECT id, code, name, value
    FROM products
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

async function updateProduct(id, { code, name, value }) {
  const query = `
    UPDATE products
    SET code = $1, name = $2, value = $3
    WHERE id = $4
    RETURNING id, code, name, value
  `;
  const values = [code, name, value, id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteProduct(id) {
  const query = `
    DELETE FROM products
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

module.exports = {
  createProduct,
  findAllProducts,
  findProductById,
  updateProduct,
  deleteProduct,
};
