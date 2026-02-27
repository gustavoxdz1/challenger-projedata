import ProductsPage from './features/products/ProductsPage';
import RawMaterialsPage from './features/rawMaterials/RawMaterialsPage';
import ProductionSuggestionsPage from './features/productionSuggestions/ProductionsSuggestionsPage';

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Inventory Production System</h1>

      <ProductsPage />
      <hr />

      <RawMaterialsPage />
      <hr />

      <ProductionSuggestionsPage />
    </div>
  );
}