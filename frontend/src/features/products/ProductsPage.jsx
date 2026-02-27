import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, deleteProduct, updateProduct } from './productsSlice';
import ProductMaterials from './ProductMaterials';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  async function handleCreate(e) {
    e.preventDefault();
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

  async function handleEdit(product) {
    const newCode = prompt('New code:', product.code);
    if (newCode === null) return;

    const newName = prompt('New name:', product.name);
    if (newName === null) return;

    const newValue = prompt('New value:', String(product.value));
    if (newValue === null) return;

    await dispatch(
      updateProduct({
        productId: product.id,
        payload: {
          code: newCode.trim(),
          name: newName.trim(),
          value: Number(newValue),
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
          <label>Value</label>
          <input type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} />
        </div>

        <button className="btn btnPrimary" type="submit">
          Create
        </button>
      </form>

      {status === 'loading' && <p className="notice">Loading products...</p>}
      {error && <div className="error">Error: {error}</div>}
      {status === 'succeeded' && items.length === 0 && <p className="notice">No products found.</p>}

      {items.length > 0 && (
        <ul className="list">
          {items.map((p) => (
            <li className="item" key={p.id}>
              <div className="itemTop">
                <div className="itemMain">
                  <span className="code">{p.code}</span>
                  <span className="muted">—</span>
                  <span>{p.name}</span>
                  <span className="muted">—</span>
                  <span>${String(p.value)}</span>
                </div>

                <div className="actions">
                  <button className="btn" type="button" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button className="btn btnDanger" type="button" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <div className="hr" />
              <div className="smallTitle">Composition</div>
              <ProductMaterials productId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}