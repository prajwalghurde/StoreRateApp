import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility to add token to requests
const authHeader = (token) => {
  if (token) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
};

// --- AUTH ----

const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

const updatePassword = async (token, passwordData) => {
  const response = await apiClient.put("/users/update-password", passwordData, {
    headers: authHeader(token),
  });
  return response.data;
};

// --- ADMIN ---

const getUsers = async (token, filters = {}) => {
  const response = await apiClient.get("/admin/users", {
    headers: authHeader(token),
    params: filters,
  });
  return response.data;
};

const getUserById = async (token, userId) => {
  const response = await apiClient.get(`/admin/users/${userId}`, {
    headers: authHeader(token),
  });
  return response.data;
};

const createUser = async (token, userData) => {
  const response = await apiClient.post("/admin/users", userData, {
    headers: authHeader(token),
  });
  return response.data;
};

//  --- STORES ---
const getStores = async (filters = {}, token) => {
  const response = await apiClient.get("/admin/stores", {
    params: filters,
    headers: authHeader(token),
  });
  return response.data;
};

const createStore = async (token, storeData) => {
  const response = await apiClient.post("/admin/stores", storeData, {
    headers: authHeader(token),
  });
  return response.data;
};

const rateStore = async (token, storeId, rating) => {
  // rating is a number 1-5
  const response = await apiClient.post(
    `/users/ratings`,
    { storeId, rating },
    { headers: authHeader(token) }
  );
  return response.data; // Expects { message: "Rating submitted", newAverageRating: 4.5 } or similar
};

const updateExistingRating = async (token, ratingId, newRatingValue) => {
  const response = await apiClient.put(
    `users/ratings/${ratingId}`,
    { rating: newRatingValue },
    { headers: authHeader(token) }
  );
  // Expect response to include the updated rating, and ideally the store's new average rating.
  // e.g., { updatedRating: { id, userId, storeId, rating }, newAverageStoreRating: 4.3 }
  return response.data;
};

// --- ADMIN DASHBOARD ---
const getAdminDashboardStats = async (token) => {
  const response = await apiClient.get(`/admin/dashboard`, {
    headers: authHeader(token),
  });

  return response.data;
};

// --- STORE OWNER DASHBOARD ---
const getStoreOwnerDashboardData = async (token) => {
  const response = await apiClient.get("/storeOwner/dashboard", {
    headers: authHeader(token),
  });
  return response.data;
};

const getUserStores = async (filters, token) => {
  const queryParams = new URLSearchParams();
  if (filters.name) queryParams.append("name", filters.name);
  if (filters.address) queryParams.append("address", filters.address);

  const response = await apiClient.get(
    `/users/stores?${queryParams.toString()}`,
    { headers: authHeader(token) }
  );

  return response.data;
};

const apiServices = {
  login,
  register,
  updatePassword,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
  rateStore,
  updateExistingRating,
  getAdminDashboardStats,
  getStoreOwnerDashboardData,
  getUserStores,
};

export default apiServices;
