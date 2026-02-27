const productionRepository = require('../repositories/productionRepository');

function groupRowsByProduct(rows) {
  const map = new Map();

  for (const r of rows) {
    if (!map.has(r.product_id)) {
      map.set(r.product_id, {
        productId: Number(r.product_id),
        productCode: r.product_code,
        productName: r.product_name,
        unitValue: Number(r.product_value),
        materials: [],
      });
    }

    // Se não tem composição (LEFT JOIN), raw_material_id vem null
    if (r.raw_material_id) {
      map.get(r.product_id).materials.push({
        rawMaterialId: Number(r.raw_material_id),
        requiredQuantity: Number(r.required_quantity),
        stockQuantity: Number(r.stock_quantity),
      });
    }
  }

  return Array.from(map.values());
}

async function getProductionSuggestions() {
  const rows = await productionRepository.fetchProductionData();

  const products = groupRowsByProduct(rows)
    .sort((a, b) => b.unitValue - a.unitValue || a.productId - b.productId);

  // Estoque virtual por matéria-prima
  const virtualStock = new Map();
  for (const r of rows) {
    if (r.raw_material_id && !virtualStock.has(Number(r.raw_material_id))) {
      virtualStock.set(Number(r.raw_material_id), Number(r.stock_quantity));
    }
  }

  const suggestions = [];
  let grandTotalValue = 0;

  for (const p of products) {
    // Sem composição => não dá para produzir (regra do teste)
    if (!p.materials.length) continue;

    // Quantidade produzível é o gargalo (min entre materiais)
    let producible = Infinity;

    for (const m of p.materials) {
      const available = virtualStock.get(m.rawMaterialId) ?? 0;
      const possibleForThisMaterial = Math.floor(available / m.requiredQuantity);
      producible = Math.min(producible, possibleForThisMaterial);
    }

    if (!Number.isFinite(producible) || producible <= 0) continue;

    // Consumir estoque virtual
    for (const m of p.materials) {
      const available = virtualStock.get(m.rawMaterialId) ?? 0;
      const consume = producible * m.requiredQuantity;
      virtualStock.set(m.rawMaterialId, available - consume);
    }

    const totalValue = producible * p.unitValue;
    grandTotalValue += totalValue;

    suggestions.push({
      productId: p.productId,
      productCode: p.productCode,
      productName: p.productName,
      unitValue: p.unitValue,
      producibleQuantity: producible,
      totalValue,
    });
  }

  return {
    suggestions,
    grandTotalValue,
  };
}

module.exports = { getProductionSuggestions };