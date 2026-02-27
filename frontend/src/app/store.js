import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import rawMaterialsReducer from '../features/rawMaterials/rawMaterialsSlice';
import productionSuggestionsReducer from '../features/productionSuggestions/productionSuggestionsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    rawMaterials: rawMaterialsReducer,
    productionSuggestions: productionSuggestionsReducer,
  },
});