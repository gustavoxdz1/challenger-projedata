import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../services/api';

export default function ProductMaterials({ productId }) {
  const [composition, setComposition] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [rawMaterialId, setRawMaterialId] = useState('');
  const [requiredQuantity, setRequiredQuantity] = useState('');
  const [error, setError] = useState(null);

  async function loadData() {
    setError(null);
    const [comp, rms] = await Promise.all([
      apiGet(`/products/${productId}/materials`),
      apiGet('/raw-materials'),
    ]);
    setComposition(comp);
    setRawMaterials(rms);
  }

  useEffect(() => {
    if (productId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    if (!rawMaterialId || requiredQuantity === '') return;

    try {
      await apiPost(`/products/${productId}/materials`, {
        rawMaterialId: Number(rawMaterialId),
        requiredQuantity: Number(requiredQuantity),
      });
      setRawMaterialId('');
      setRequiredQuantity('');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(rmId) {
    setError(null);
    try {
      await apiDelete(`/products/${productId}/materials/${rmId}`);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(rmId, currentQty) {
    const newQty = prompt('New required quantity:', String(currentQty));
    if (newQty === null || newQty === '') return;

    setError(null);
    try {
      await apiPut(`/products/${productId}/materials/${rmId}`, {
        requiredQuantity: Number(newQty),
      });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      {error && <div className="error">Error: {error}</div>}

      <form onSubmit={handleAdd} className="row" style={{ marginTop: 6 }}>
        <div className="field" style={{ minWidth: 220 }}>
          <label>Raw material</label>
          <select value={rawMaterialId} onChange={(e) => setRawMaterialId(e.target.value)}>
            <option value="">Select...</option>
            {rawMaterials.map((rm) => (
              <option key={rm.id} value={rm.id}>
                {rm.code} - {rm.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field" style={{ maxWidth: 220 }}>
          <label>Required qty</label>
          <input
            type="number"
            step="0.001"
            value={requiredQuantity}
            onChange={(e) => setRequiredQuantity(e.target.value)}
          />
        </div>

        <button className="btn btnPrimary" type="submit">
          Add
        </button>
      </form>

      {composition.length === 0 ? (
        <p className="notice">No materials associated.</p>
      ) : (
        <ul className="list">
          {composition.map((m) => (
            <li className="item" key={m.raw_material_id}>
              <div className="itemTop">
                <div className="itemMain">
                  <span className="code">{m.raw_material_code}</span>
                  <span className="muted">—</span>
                  <span>{m.raw_material_name}</span>
                  <span className="muted">—</span>
                  <span className="muted">required:</span>
                  <span>{String(m.required_quantity)}</span>
                  <span className="muted">—</span>
                  <span className="muted">stock:</span>
                  <span>{String(m.stock_quantity)}</span>
                </div>

                <div className="actions">
                  <button className="btn" type="button" onClick={() => handleUpdate(m.raw_material_id, m.required_quantity)}>
                    Update qty
                  </button>
                  <button className="btn btnDanger" type="button" onClick={() => handleRemove(m.raw_material_id)}>
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}