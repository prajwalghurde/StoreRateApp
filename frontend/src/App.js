import React from "react";

import Navbar from "./components/common/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./hooks/useAuth";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUserListPage from "./pages/AdminUserListpage";
import AdminAddUserPage from "./pages/AdminAddUserPage";
import AdminUserDetailsPage from "./pages/AdminUserDetailsPage";
import AdminStoreListPage from "./pages/AdminStoreListPage";
import AdminAddStorePage from "./pages/AdminAddStorePage";
import UserDashboardPage from "./pages/UserDashboardPage";
import StoreOwnerDashboardPage from "./pages/StoreOwnerDashboardPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const { isAuthenticated, role } = useAuth();

  const getHomeRoute = () => {
    if (!isAuthenticated) return "/login";
    if (role === "admin") return "/admin/dashboard";
    if (role === "user") return "/dashboard";
    if (role === "owner") return "/store-owner/dashboard";
    return "/login";
  };
  return (
    <>
      <Router>
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={getHomeRoute()} replace />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Common Protected Route */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "user", "owner"]} />
              }
            >
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/** Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUserListPage />} />
              <Route path="/admin/users/add" element={<AdminAddUserPage />} />
              <Route
                path="/admin/users/:userId"
                element={<AdminUserDetailsPage />}
              />
              <Route path="/admin/stores" element={<AdminStoreListPage />} />
              <Route path="/admin/stores/add" element={<AdminAddStorePage />} />
            </Route>

            {/* Normal User Routes */}
            <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
              <Route path="/dashboard" element={<UserDashboardPage />} />
            </Route>

            {/* Store Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
              <Route
                path="/store-owner/dashboard"
                element={<StoreOwnerDashboardPage />}
              />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
