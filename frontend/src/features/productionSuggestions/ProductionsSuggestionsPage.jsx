import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductionSuggestions } from './productionSuggestionsSlice';

export default function ProductionSuggestionsPage() {
  const dispatch = useDispatch();
  const { suggestions, grandTotalValue, status, error } = useSelector(
    (state) => state.productionSuggestions
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProductionSuggestions());
    }
  }, [dispatch, status]);

  if (status === 'loading') return <p>Loading production suggestions...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Production Suggestions</h2>

      {suggestions.length === 0 ? (
        <p>No producible products with current stock.</p>
      ) : (
        <>
          <ul>
            {suggestions.map((s) => (
              <li key={s.productId}>
                <strong>{s.productCode}</strong> — {s.productName} — qty: {s.producibleQuantity} — unit: $
                {String(s.unitValue)} — total: ${String(s.totalValue)}
              </li>
            ))}
          </ul>

          <p>
            <strong>Grand total:</strong> ${grandTotalValue.toLocaleString()}
          </p>
        </>
      )}
    </div>
  );
}