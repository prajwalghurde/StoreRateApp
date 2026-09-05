import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/userSlice";
import storesReducer from "../features/stores/storesSlice";
import adminDashboardReducer from "../features/adminDashboard/adminDashboardSlice";
import storeOwnerDashboardReducer from "../features/storeOwnerDashboard/storeOwnerDashboardSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    stores: storesReducer,
    adminDashboard: adminDashboardReducer,
    storeOwnerDashboard: storeOwnerDashboardReducer,
  },
});
