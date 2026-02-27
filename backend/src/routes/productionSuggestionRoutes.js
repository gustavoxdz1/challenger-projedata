const express = require('express');
const productionSuggestionController = require('../controllers/productionSuggestionController');

const router = express.Router();

router.get('/', productionSuggestionController.getSuggestions);

module.exports = router;