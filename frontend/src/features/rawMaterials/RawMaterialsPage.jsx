import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRawMaterials,
  createRawMaterial,
  deleteRawMaterial,
  updateRawMaterial,
} from './rawMaterialsSlice';

export default function RawMaterialsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.rawMaterials);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRawMaterials());
  }, [dispatch, status]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!code.trim() || !name.trim() || stockQuantity === '') return;

    await dispatch(
      createRawMaterial({
        code: code.trim(),
        name: name.trim(),
        stockQuantity: Number(stockQuantity),
      })
    );

    setCode('');
    setName('');
    setStockQuantity('');
  }

  async function handleDelete(id) {
    await dispatch(deleteRawMaterial(id));
  }

  async function handleEdit(rm) {
    const newCode = prompt('New code:', rm.code);
    if (newCode === null) return;

    const newName = prompt('New name:', rm.name);
    if (newName === null) return;

    const currentStock = rm.stock_quantity ?? 0;
    const newStock = prompt('New stock quantity:', String(currentStock));
    if (newStock === null) return;

    await dispatch(
      updateRawMaterial({
        rawMaterialId: rm.id,
        payload: {
          code: newCode.trim(),
          name: newName.trim(),
          stockQuantity: Number(newStock),
        },
      })
    );
  }

  return (
    <div>
      <form onSubmit={handleCreate} className="row">
        <div className="field">
          <label>Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} />
        </div>

        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="field" style={{ maxWidth: 220 }}>
          <label>Stock quantity</label>
          <input
            type="number"
            step="0.001"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
        </div>

        <button className="btn btnPrimary" type="submit">
          Create
        </button>
      </form>

      {status === 'loading' && <p className="notice">Loading raw materials...</p>}
      {error && <div className="error">Error: {error}</div>}
      {status === 'succeeded' && items.length === 0 && <p className="notice">No raw materials found.</p>}

      {items.length > 0 && (
        <ul className="list">
          {items.map((rm) => (
            <li className="item" key={rm.id}>
              <div className="itemTop">
                <div className="itemMain">
                  <span className="code">{rm.code}</span>
                  <span className="muted">—</span>
                  <span>{rm.name}</span>
                  <span className="muted">—</span>
                  <span className="muted">stock:</span>
                  <span>{String(rm.stock_quantity)}</span>
                </div>

                <div className="actions">
                  <button className="btn" type="button" onClick={() => handleEdit(rm)}>
                    Edit
                  </button>
                  <button className="btn btnDanger" type="button" onClick={() => handleDelete(rm.id)}>
                    Delete
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