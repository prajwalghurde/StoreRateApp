import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiServices from "../../services/apiServices";

export const fetchStores = createAsyncThunk(
  "stores/fetchStores",
  async (filters, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;

      const response = await apiServices.getStores(filters, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createStoreByAdmin = createAsyncThunk(
  "stores/createStoreByAdmin",
  async (storeData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiServices.createStore(token, storeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitStoreRating = createAsyncThunk(
  "stores/submitStoreRating",
  async ({ storeId, rating }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiServices.rateStore(token, storeId, rating);
      return {
        storeId,
        newAverageRating: response.data.newAverageRating,
        userRating: rating,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const modifyStoreRating = createAsyncThunk(
  "stores/modifyStoreRating",
  async (
    { ratingId, newRatingValue, storeId },
    { getState, rejectWithValue }
  ) => {
    try {
      const { token } = getState().auth;
      // Backend for PUT /ratings/:ratingId returns:
      // { message: "Rating updated successfully", data: updatedRatingObject, newAverageStoreRating: X.X }
      // where updatedRatingObject is the updated rating: { id, userId, storeId, rating }
      const responseData = await apiServices.updateExistingRating(
        token,
        ratingId,
        newRatingValue
      );
      return {
        storeId, // storeId is passed through to find the store in slice
        userRatingDetails: responseData.data, // The updated rating object from backend
        newAverageRating: responseData.newAverageStoreRating, // Crucial for updating overall store rating
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserStores = createAsyncThunk(
  "stores/fetchUserStores",
  async (filters, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiServices.getUserStores(filters, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  totalCount: 0,
  currentPage: 1,
};

const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.stores;
        state.totalCount = action.payload.pagination.total;
        state.currentPage = action.payload.pagination.page;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createStoreByAdmin.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createStoreByAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createStoreByAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserStores.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchUserStores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUserStores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(submitStoreRating.pending, (state) => {
        state.ratingStatus = "loading";
        state.ratingError = null;
      })
      .addCase(submitStoreRating.fulfilled, (state, action) => {
        const { storeId, newAverageRating, userRatingDetails } = action.payload;
        const storeIndex = state.items.findIndex(
          (store) => store.id === storeId
        );
        if (storeIndex !== -1) {
          state.items[storeIndex].rating = newAverageRating; // Overall rating
          state.items[storeIndex].userRatingDetails = userRatingDetails; // Store the new rating details
        }
        state.ratingStatus = "succeeded";
      })
      .addCase(submitStoreRating.rejected, (state, action) => {
        state.ratingStatus = "failed";
        state.ratingError = action.payload;
      })
      .addCase(modifyStoreRating.pending, (state) => {
        state.ratingStatus = "loading";
        state.ratingError = null;
      })
      .addCase(modifyStoreRating.fulfilled, (state, action) => {
        const { storeId, userRatingDetails, newAverageRating } = action.payload;
        const storeIndex = state.items.findIndex(
          (store) => store.id === storeId
        );
        if (storeIndex !== -1) {
          state.items[storeIndex].rating = newAverageRating; // Update overall store rating
          state.items[storeIndex].userRatingDetails = userRatingDetails; // Update user's specific rating details
        }
        state.ratingStatus = "succeeded";
      })
      .addCase(modifyStoreRating.rejected, (state, action) => {
        state.ratingStatus = "failed";
        state.ratingError = action.payload;
      });
  },
});

export const selectAllStores = (state) => state.stores.items;
export const selectStoresStatus = (state) => state.stores.status;
export const selectStoresError = (state) => state.stores.error;
export const selectRatingStatus = (state) => state.stores.ratingStatus;
export const selectRatingError = (state) => state.stores.ratingError;

export default storesSlice.reducer;
