const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

const productRoutes = require('./routes/productRoutes');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const productMaterialRoutes = require('./routes/productMaterialRoutes');
const productionSuggestionRoutes = require('./routes/productionSuggestionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/production-suggestions', productionSuggestionRoutes);
app.use('/api/products/:productId/materials', productMaterialRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/products', productRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({
      status: 'ok',
      api: 'online',
      database: 'connected',
    });
  } catch (error) {
    return res.status(503).json({
      status: 'error',
      api: 'online',
      database: 'disconnected',
      message: error.message,
    });
  }
});

app.get('/', (_req, res) => {
  return res.status(200).json({ message: 'API running' });
});

module.exports = app;