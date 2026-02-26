const rawMaterialRepository = require('../repositories/rawMaterialRepository');

function validateRawMaterialPayload(payload = {}) {
  const { code, name, stockQuantity } = payload;

  if (!code || typeof code !== 'string' || !code.trim()) {
    return 'Code is required and must be a non-empty string.';
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Name is required and must be a non-empty string.';
  }

  if (stockQuantity === undefined || stockQuantity === null || Number.isNaN(Number(stockQuantity))) {
    return 'Stock quantity is required and must be a valid number.';
  }

  if (Number(stockQuantity) < 0) {
    return 'Stock quantity must be greater than or equal to 0.';
  }

  return null;
}

async function createRawMaterial(payload) {
  const validationError = validateRawMaterialPayload(payload);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  try {
    return await rawMaterialRepository.createRawMaterial({
      code: payload.code.trim(),
      name: payload.name.trim(),
      stockQuantity: Number(payload.stockQuantity),
    });
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('Raw material code already exists.');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
}

async function getAllRawMaterials() {
  return rawMaterialRepository.findAllRawMaterials();
}

async function getRawMaterialById(id) {
  const rawMaterial = await rawMaterialRepository.findRawMaterialById(id);

  if (!rawMaterial) {
    const error = new Error('Raw material not found.');
    error.statusCode = 404;
    throw error;
  }

  return rawMaterial;
}

async function updateRawMaterial(id, payload) {
  const validationError = validateRawMaterialPayload(payload);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  try {
    const updated = await rawMaterialRepository.updateRawMaterial(id, {
      code: payload.code.trim(),
      name: payload.name.trim(),
      stockQuantity: Number(payload.stockQuantity),
    });

    if (!updated) {
      const error = new Error('Raw material not found.');
      error.statusCode = 404;
      throw error;
    }

    return updated;
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('Raw material code already exists.');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
}

async function deleteRawMaterial(id) {
  const deleted = await rawMaterialRepository.deleteRawMaterial(id);

  if (!deleted) {
    const error = new Error('Raw material not found.');
    error.statusCode = 404;
    throw error;
  }

  return { message: 'Raw material deleted successfully.' };
}

module.exports = {
  createRawMaterial,
  getAllRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
};