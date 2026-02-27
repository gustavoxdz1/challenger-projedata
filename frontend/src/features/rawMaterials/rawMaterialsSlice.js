import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGet, apiPost, apiDelete, apiPut } from '../../services/api';

export const fetchRawMaterials = createAsyncThunk(
  'rawMaterials/fetchRawMaterials',
  async () => {
    const data = await apiGet('/raw-materials');
    return data;
  }
);

export const createRawMaterial = createAsyncThunk(
  'rawMaterials/createRawMaterial',
  async (payload) => {
    const data = await apiPost('/raw-materials', payload);
    return data;
  }
);

export const deleteRawMaterial = createAsyncThunk(
  'rawMaterials/deleteRawMaterial',
  async (rawMaterialId) => {
    await apiDelete(`/raw-materials/${rawMaterialId}`);
    return rawMaterialId;
  }
);

export const updateRawMaterial = createAsyncThunk(
  'rawMaterials/updateRawMaterial',
  async ({ rawMaterialId, payload }) => {
    const data = await apiPut(`/raw-materials/${rawMaterialId}`, payload);
    return data;
  }
);

const rawMaterialsSlice = createSlice({
  name: 'rawMaterials',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch isso aqui tambem cria uma função para buscar as materias primas e adicionar a lista de materias primas
      .addCase(fetchRawMaterials.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch raw materials';
      })

      // create / para criar  amateria prima e adicionar a lista de materias primas
      .addCase(createRawMaterial.pending, (state) => {
        state.error = null;
      })
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create raw material';
      })

      // delete e aqui deleta uma materia prima e remove da lista de materias primas
      .addCase(deleteRawMaterial.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((rm) => Number(rm.id) !== Number(action.payload));
      })
      .addCase(deleteRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete raw material';
      })

          .addCase(updateRawMaterial.pending, (state) => {
      state.error = null;
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex((rm) => Number(rm.id) === Number(updated.id));
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(updateRawMaterial.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update raw material';
      })
        
      },
});  

export default rawMaterialsSlice.reducer;