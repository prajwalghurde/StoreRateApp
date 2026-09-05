import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
  const { isAuthenticated, isAdmin, isUser, isOwner } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/login");
    });
  };
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          StoreRatings
        </Link>
        <div className="space-x-4">
          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="hover:text-blue-200">
                Register
              </Link>
            </>
          )}
          {isAuthenticated && (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="hover:text-blue-200">
                    Admin Dashboard
                  </Link>
                  <Link to="/admin/users" className="hover:text-blue-200">
                    Manage Users
                  </Link>
                  <Link to="/admin/stores" className="hover:text-blue-200">
                    Manage Stores
                  </Link>
                </>
              )}
              {isUser && (
                <Link to="/dashboard" className="hover:text-blue-200">
                  Stores
                </Link>
              )}
              {isOwner && (
                <Link
                  to="/store-owner/dashboard"
                  className="hover:text-blue-200"
                >
                  My Store Dashboard
                </Link>
              )}
              <Link to="/profile" className="hover:text-blue-200">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
