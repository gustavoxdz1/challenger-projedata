const productRepository = require('../repositories/productRepository');

function validateProductPayload(payload = {}) {
  const { code, name, value } = payload;

  if (!code || typeof code !== 'string' || !code.trim()) {
    return 'Code is required and must be a non-empty string.';
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return 'Name is required and must be a non-empty string.';
  }

  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return 'Value is required and must be a valid number.';
  }

  if (Number(value) < 0) {
    return 'Value must be greater than or equal to 0.';
  }

  return null;
}

async function createProduct(payload) {
  const validationError = validateProductPayload(payload);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  try {
    const product = await productRepository.createProduct({
      code: payload.code.trim(),
      name: payload.name.trim(),
      value: Number(payload.value),
    });

    return product;
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('Product code already exists.');
      error.statusCode = 409;
      throw error;
    }

    throw err;
  }
}

async function getAllProducts() {
  return productRepository.findAllProducts();
}

async function getProductById(id) {
  const product = await productRepository.findProductById(id);

  if (!product) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  return product;
}

async function updateProduct(id, payload) {
  const validationError = validateProductPayload(payload);

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  try {
    const updatedProduct = await productRepository.updateProduct(id, {
      code: payload.code.trim(),
      name: payload.name.trim(),
      value: Number(payload.value),
    });

    if (!updatedProduct) {
      const error = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    return updatedProduct;
  } catch (err) {
    if (err.code === '23505') {
      const error = new Error('Product code already exists.');
      error.statusCode = 409;
      throw error;
    }

    throw err;
  }
}

async function deleteProduct(id) {
  const deleted = await productRepository.deleteProduct(id);

  if (!deleted) {
    const error = new Error('Product not found.');
    error.statusCode = 404;
    throw error;
  }

  return { message: 'Product deleted successfully.' };
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};