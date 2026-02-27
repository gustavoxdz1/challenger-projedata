import ProductsPage from './features/products/ProductsPage'
import ProductionSuggestionsPage from './features/productionSuggestions/ProductionsSuggestionsPage';
import RawMaterialsPage from './features/rawMaterials/rawMaterialspage';

export default function App() {
  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Inventory Production System</h1>
          <p className="sub">Products, raw materials, composition and production suggestions.</p>
        </div>
        <span className="badge">React + Redux Toolkit</span>
      </div>

      <div className="grid">
        <div className="card">
          <div className="cardTitle">
            <h2>Products</h2>
            <span className="badge">CRUD + Composition</span>
          </div>
          <ProductsPage />
        </div>

        <div className="card">
          <div className="cardTitle">
            <h2>Raw Materials</h2>
            <span className="badge">CRUD</span>
          </div>
          <RawMaterialsPage />
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="cardTitle">
            <h2>Production Suggestions</h2>
            <span className="badge">RF004</span>
          </div>
          <ProductionSuggestionsPage />
        </div>
      </div>
    </div>
  );
}