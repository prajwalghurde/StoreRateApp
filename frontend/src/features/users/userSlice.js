import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiServices from "../../services/apiServices";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (filters, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiServices.getUsers(token, filters);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiServices.getUserById(token, userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await apiServices.createUser(token, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedUser: null,
  status: "idle",
  error: null,
  totalCount: 0,
  currentPage: 1,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.users;
        state.totalCount = action.payload.pagination.total;
        state.currentPage = action.payload.pagination.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = "pending";
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectAllUsers = (state) => state.users.items;
export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;
export const selectSingleUser = (state) => state.users.selectedUser;

export default userSlice.reducer;
