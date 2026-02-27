const pool = require('../config/database');

async function fetchProductionData() {
  const query = `
    SELECT
      p.id AS product_id,
      p.code AS product_code,
      p.name AS product_name,
      p.value AS product_value,
      prm.raw_material_id,
      prm.required_quantity,
      rm.stock_quantity,
      rm.code AS raw_material_code,
      rm.name AS raw_material_name
    FROM products p
    LEFT JOIN product_raw_materials prm ON prm.product_id = p.id
    LEFT JOIN raw_materials rm ON rm.id = prm.raw_material_id
    ORDER BY p.value DESC, p.id ASC, rm.id ASC
  `;

  const result = await pool.query(query);
  return result.rows;
}

module.exports = { fetchProductionData };