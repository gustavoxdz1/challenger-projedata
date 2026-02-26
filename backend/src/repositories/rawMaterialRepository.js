const pool = require('../config/database');

async function createRawMaterial({ code, name, stockQuantity }) {
  const query = `
    INSERT INTO raw_materials (code, name, stock_quantity)
    VALUES ($1, $2, $3)
    RETURNING id, code, name, stock_quantity
  `;
  const values = [code, name, stockQuantity];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function findAllRawMaterials() {
  const query = `
    SELECT id, code, name, stock_quantity
    FROM raw_materials
    ORDER BY id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
}

async function findRawMaterialById(id) {
  const query = `
    SELECT id, code, name, stock_quantity
    FROM raw_materials
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

async function updateRawMaterial(id, { code, name, stockQuantity }) {
  const query = `
    UPDATE raw_materials
    SET code = $1, name = $2, stock_quantity = $3
    WHERE id = $4
    RETURNING id, code, name, stock_quantity
  `;
  const values = [code, name, stockQuantity, id];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function deleteRawMaterial(id) {
  const query = `
    DELETE FROM raw_materials
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

module.exports = {
  createRawMaterial,
  findAllRawMaterials,
  findRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
};