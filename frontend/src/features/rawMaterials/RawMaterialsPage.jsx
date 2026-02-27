import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRawMaterials, createRawMaterial, deleteRawMaterial } from './rawMaterialsSlice';

export default function RawMaterialsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.rawMaterials);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRawMaterials());
    }
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

  return (
    <div>
      <h2>Raw Materials</h2>

      <form onSubmit={handleCreate}>
        <div>
          <label>
            Code:
            <input value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Name:
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>

        <div>
          <label>
            Stock quantity:
            <input
              type="number"
              step="0.001"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">Create</button>
      </form>

      {status === 'loading' && <p>Loading raw materials...</p>}
      {error && <p>Error: {error}</p>}

      {status === 'succeeded' && items.length === 0 && <p>No raw materials found.</p>}

      {items.length > 0 && (
        <ul>
          {items.map((rm) => (
            <li key={rm.id}>
              <strong>{rm.code}</strong> — {rm.name} — stock: {String(rm.stock_quantity)}{' '}
              <button type="button" onClick={() => handleDelete(rm.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}