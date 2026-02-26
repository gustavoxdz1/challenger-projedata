const productService = require('../services/productService');

async function createProduct(req, res) {
    console.log('BODY:', req.body);
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function getAllProducts(_req, res) {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedProduct = await productService.updateProduct(id, req.body);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const result = await productService.deleteProduct(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};