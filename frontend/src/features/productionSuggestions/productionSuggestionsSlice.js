import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet } from '../../services/api';

export const fetchProductionSuggestions = createAsyncThunk(
  'productionSuggestions/fetchProductionSuggestions',
  async () => {
    const data = await apiGet('/production-suggestions');
    return data;
  }
);

const productionSuggestionsSlice = createSlice({
  name: 'productionSuggestions',
  initialState: {
    suggestions: [],
    grandTotalValue: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductionSuggestions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProductionSuggestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.suggestions = action.payload?.suggestions ?? [];
        state.grandTotalValue = Number(action.payload?.grandTotalValue ?? 0);
})
      .addCase(fetchProductionSuggestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch production suggestions';
      });
  },
});

export default productionSuggestionsSlice.reducer;