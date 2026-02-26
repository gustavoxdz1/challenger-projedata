const express = require('express');
const rawMaterialController = require('../controllers/rawMaterialController');

const router = express.Router();

router.post('/', rawMaterialController.createRawMaterial);
router.get('/', rawMaterialController.getAllRawMaterials);
router.get('/:id', rawMaterialController.getRawMaterialById);
router.put('/:id', rawMaterialController.updateRawMaterial);
router.delete('/:id', rawMaterialController.deleteRawMaterial);

module.exports = router;