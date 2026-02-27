const productionSuggestionService = require('../services/productionSuggestionService');

async function getSuggestions(_req, res) {
  try {
    const result = await productionSuggestionService.getProductionSuggestions();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Internal server error',
    });
  }
}

module.exports = { getSuggestions };