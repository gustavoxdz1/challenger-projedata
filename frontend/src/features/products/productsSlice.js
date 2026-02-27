import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet, apiPost, apiDelete, apiPut } from "../../services/api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const data = await apiGet("/products");
    return data;
  },
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload) => {
    const data = await apiPost("/products", payload);
    return data;
  },
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId) => {
    await apiDelete(`/products/${productId}`);
    return productId;
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, payload }) => {
    const data = await apiPut(`/products/${productId}`, payload);
    return data;
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle", // idle ou loading ou succeeded ou failed retorna um estatus para o suario se falhou ou deu certo a requisição
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      })

      // createProduct
      .addCase(createProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create product";
      })

      // deleteProduct
      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => Number(p.id) !== Number(action.payload),
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete product";
      })
      //updateProduct/ ATUALIZA O PRODUTO
      .addCase(updateProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex(
          (p) => Number(p.id) === Number(updated.id),
        );
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update product";
      });
  },
});

export default productsSlice.reducer;
