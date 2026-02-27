import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, deleteProduct } from './productsSlice';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  async function handleCreate(e) {
    e.preventDefault();

    // validação mínima
    if (!code.trim() || !name.trim() || value === '') return;

    await dispatch(
      createProduct({
        code: code.trim(),
        name: name.trim(),
        value: Number(value),
      })
    );

    setCode('');
    setName('');
    setValue('');
  }

  async function handleDelete(id) {
    await dispatch(deleteProduct(id));
  }

  return (
    <div>
      <h2>Products</h2>

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
            Value:
            <input
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
        </div>

        <button type="submit">Create</button>
      </form>

      {status === 'loading' && <p>Loading products...</p>}
      {error && <p>Error: {error}</p>}

      {status === 'succeeded' && items.length === 0 && <p>No products found.</p>}

      {items.length > 0 && (
        <ul>
          {items.map((p) => (
            <li key={p.id}>
              <strong>{p.code}</strong> — {p.name} — ${String(p.value)}{' '}
              <button type="button" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}