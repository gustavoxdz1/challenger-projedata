const express = require('express');
const productMaterialController = require('../controllers/productMaterialController');

const router = express.Router({ mergeParams: true });

router.get('/', productMaterialController.listMaterials);
router.post('/', productMaterialController.addMaterial);
router.put('/:rawMaterialId', productMaterialController.updateMaterial);
router.delete('/:rawMaterialId', productMaterialController.removeMaterial);

module.exports = router;