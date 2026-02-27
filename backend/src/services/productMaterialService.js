const productRepository = require('../repositories/productRepository');
const rawMaterialRepository = require('../repositories/rawMaterialRepository');
const productMaterialRepository = require('../repositories/productMaterialRepository');

function ensureValidId(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    const err = new Error(`${fieldName} must be a positive integer.`);
    err.statusCode = 400;
    throw err;
  }
}

function ensureValidRequiredQuantity(payload = {}) {
  const { requiredQuantity } = payload;

  if (requiredQuantity === undefined || requiredQuantity === null || Number.isNaN(Number(requiredQuantity))) {
    const err = new Error('Required quantity is required and must be a valid number.');
    err.statusCode = 400;
    throw err;
  }

  const qty = Number(requiredQuantity);
  if (qty <= 0) {
    const err = new Error('Required quantity must be greater than 0.');
    err.statusCode = 400;
    throw err;
  }

  return qty;
}

async function listMaterials(productId) {
  ensureValidId(productId, 'productId');

  const product = await productRepository.findProductById(productId);
  if (!product) {
    const err = new Error('Product not found.');
    err.statusCode = 404;
    throw err;
  }

  return productMaterialRepository.listMaterialsByProduct(productId);
}

async function addMaterial(productId, payload = {}) {
  ensureValidId(productId, 'productId');

  const rawMaterialId = Number(payload.rawMaterialId);
  ensureValidId(rawMaterialId, 'rawMaterialId');

  const requiredQuantity = ensureValidRequiredQuantity(payload);

  const product = await productRepository.findProductById(productId);
  if (!product) {
    const err = new Error('Product not found.');
    err.statusCode = 404;
    throw err;
  }

  const rawMaterial = await rawMaterialRepository.findRawMaterialById(rawMaterialId);
  if (!rawMaterial) {
    const err = new Error('Raw material not found.');
    err.statusCode = 404;
    throw err;
  }

  try {
    return await productMaterialRepository.addMaterialToProduct({
      productId,
      rawMaterialId,
      requiredQuantity,
    });
  } catch (err) {
    if (err.code === '23505') {
      const e = new Error('This raw material is already associated with the product.');
      e.statusCode = 409;
      throw e;
    }
    throw err;
  }
}

async function updateMaterial(productId, rawMaterialId, payload = {}) {
  ensureValidId(productId, 'productId');
  ensureValidId(rawMaterialId, 'rawMaterialId');

  const requiredQuantity = ensureValidRequiredQuantity(payload);

  const updated = await productMaterialRepository.updateRequiredQuantity({
    productId,
    rawMaterialId,
    requiredQuantity,
  });

  if (!updated) {
    const err = new Error('Association not found for this product and raw material.');
    err.statusCode = 404;
    throw err;
  }

  return updated;
}

async function removeMaterial(productId, rawMaterialId) {
  ensureValidId(productId, 'productId');
  ensureValidId(rawMaterialId, 'rawMaterialId');

  const deleted = await productMaterialRepository.removeMaterialFromProduct({
    productId,
    rawMaterialId,
  });

  if (!deleted) {
    const err = new Error('Association not found for this product and raw material.');
    err.statusCode = 404;
    throw err;
  }

  return { message: 'Material removed from product successfully.' };
}

module.exports = {
  listMaterials,
  addMaterial,
  updateMaterial,
  removeMaterial,
};