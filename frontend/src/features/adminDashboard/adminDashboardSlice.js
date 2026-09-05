import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiServices from "../../services/apiServices";

export const fetchAdminStats = createAsyncThunk(
  "adminDashboard/fetchAdminStats",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiServices.getAdminDashboardStats(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  stats: {
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  },
  status: "idle",
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectAdminDashboardStats = (state) => state.adminDashboard.stats;
export const selectAdminDashboardStatus = (state) =>
  state.adminDashboard.status;

export default adminDashboardSlice.reducer;
