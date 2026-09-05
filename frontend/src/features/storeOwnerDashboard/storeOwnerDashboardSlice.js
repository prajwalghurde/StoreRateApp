import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "../../services/apiServices";

export const fetchStoreOwnerData = createAsyncThunk(
  "storeOwnerDashboard/fetchStoreOwnerData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiService.getStoreOwnerDashboardData(token);
      return response.data.dashboard;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  stores: [], // Array of stores with their ratings
  status: "idle",
  error: null,
};

const storeOwnerDashboardSlice = createSlice({
  name: "storeOwnerDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreOwnerData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStoreOwnerData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stores = action.payload;
      })
      .addCase(fetchStoreOwnerData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectStoreOwnerStores = (state) =>
  state.storeOwnerDashboard.stores;
export const selectStoreOwnerStatus = (state) =>
  state.storeOwnerDashboard.status;
export const selectStoreOwnerError = (state) => state.storeOwnerDashboard.error;

// Helper selectors
export const selectStoreById = (state, storeId) =>
  state.storeOwnerDashboard.stores.find((store) => store.storeId === storeId);

export const selectStoreRatings = (state, storeId) => {
  const store = selectStoreById(state, storeId);
  return store ? store.ratedByUsers : [];
};

export const selectStoreAverageRating = (state, storeId) => {
  const store = selectStoreById(state, storeId);
  return store ? store.averageRating : "N/A";
};

export default storeOwnerDashboardSlice.reducer;
