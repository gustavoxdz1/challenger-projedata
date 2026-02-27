import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductionSuggestions } from './productionSuggestionsSlice';

export default function ProductionSuggestionsPage() {
  const dispatch = useDispatch();
  const { suggestions, grandTotalValue, status, error } = useSelector(
    (state) => state.productionSuggestions
  );

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProductionSuggestions());
  }, [dispatch, status]);

  if (status === 'loading') return <p className="notice">Loading production suggestions...</p>;
  if (status === 'failed') return <div className="error">Error: {error}</div>;

  return (
    <div>
      {suggestions.length === 0 ? (
        <p className="notice">No producible products with current stock.</p>
      ) : (
        <>
          <ul className="list">
            {suggestions.map((s) => (
              <li className="item" key={s.productId}>
                <div className="itemTop">
                  <div className="itemMain">
                    <span className="code">{s.productCode}</span>
                    <span className="muted">—</span>
                    <span>{s.productName}</span>
                    <span className="muted">—</span>
                    <span className="muted">qty:</span>
                    <span>{s.producibleQuantity}</span>
                    <span className="muted">—</span>
                    <span className="muted">unit:</span>
                    <span>${String(s.unitValue)}</span>
                    <span className="muted">—</span>
                    <span className="muted">total:</span>
                    <span>${String(s.totalValue)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="notice">
            <strong>Grand total:</strong> ${Number(grandTotalValue).toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}