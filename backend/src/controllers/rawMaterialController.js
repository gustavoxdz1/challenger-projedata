const rawMaterialService = require('../services/rawMaterialService');

async function createRawMaterial(req, res) {
  try {
    const rawMaterial = await rawMaterialService.createRawMaterial(req.body);
    return res.status(201).json(rawMaterial);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function getAllRawMaterials(_req, res) {
  try {
    const rawMaterials = await rawMaterialService.getAllRawMaterials();
    return res.status(200).json(rawMaterials);
  } catch (_error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getRawMaterialById(req, res) {
  try {
    const id = Number(req.params.id);
    const rawMaterial = await rawMaterialService.getRawMaterialById(id);
    return res.status(200).json(rawMaterial);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function updateRawMaterial(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await rawMaterialService.updateRawMaterial(id, req.body);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

async function deleteRawMaterial(req, res) {
  try {
    const id = Number(req.params.id);
    const result = await rawMaterialService.deleteRawMaterial(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
}

module.exports = {
  createRawMaterial,
  getAllRawMaterials,
  getRawMaterialById,
  updateRawMaterial,
  deleteRawMaterial,
};