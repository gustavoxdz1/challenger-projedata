const pool = require('../config/database');

async function listMaterialsByProduct(productId) {
  const query = `
    SELECT
      prm.product_id,
      prm.raw_material_id,
      rm.code AS raw_material_code,
      rm.name AS raw_material_name,
      rm.stock_quantity,
      prm.required_quantity
    FROM product_raw_materials prm
    JOIN raw_materials rm ON rm.id = prm.raw_material_id
    WHERE prm.product_id = $1
    ORDER BY rm.id ASC
  `;
  const result = await pool.query(query, [productId]);
  return result.rows;
}

async function addMaterialToProduct({ productId, rawMaterialId, requiredQuantity }) {
  const query = `
    INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity)
    VALUES ($1, $2, $3)
    RETURNING id, product_id, raw_material_id, required_quantity
  `;
  const values = [productId, rawMaterialId, requiredQuantity];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function updateRequiredQuantity({ productId, rawMaterialId, requiredQuantity }) {
  const query = `
    UPDATE product_raw_materials
    SET required_quantity = $1
    WHERE product_id = $2 AND raw_material_id = $3
    RETURNING id, product_id, raw_material_id, required_quantity
  `;
  const values = [requiredQuantity, productId, rawMaterialId];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
}

async function removeMaterialFromProduct({ productId, rawMaterialId }) {
  const query = `
    DELETE FROM product_raw_materials
    WHERE product_id = $1 AND raw_material_id = $2
    RETURNING id
  `;
  const result = await pool.query(query, [productId, rawMaterialId]);
  return result.rows[0] || null;
}

module.exports = {
  listMaterialsByProduct,
  addMaterialToProduct,
  updateRequiredQuantity,
  removeMaterialFromProduct,
};