const productMaterialService = require('../services/productMaterialService');

async function listMaterials(req, res) {
  try {
    const productId = Number(req.params.productId);
    const result = await productMaterialService.listMaterials(productId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function addMaterial(req, res) {
  try {
    const productId = Number(req.params.productId);
    const created = await productMaterialService.addMaterial(productId, req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function updateMaterial(req, res) {
  try {
    const productId = Number(req.params.productId);
    const rawMaterialId = Number(req.params.rawMaterialId);
    const updated = await productMaterialService.updateMaterial(productId, rawMaterialId, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function removeMaterial(req, res) {
  try {
    const productId = Number(req.params.productId);
    const rawMaterialId = Number(req.params.rawMaterialId);
    const result = await productMaterialService.removeMaterial(productId, rawMaterialId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

module.exports = {
  listMaterials,
  addMaterial,
  updateMaterial,
  removeMaterial,
};