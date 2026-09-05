import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createUser,
  selectUserStatus,
  selectUserError,
} from "../features/users/userSlice";
// Assuming you have fetchStores in storesSlice to get stores for Store Owner assignment
// import { fetchStores, selectAllStores } from '../../features/stores/storesSlice';
import LoadingSpinner from "../components/common/LoadingSpinner";

import {
  validateEmail,
  validatePassword,
  validateName,
  validateAddress,
} from "../utils/formValidators";
import ToastMessage from "../components/common/ToastMessage";

const AdminAddUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStatus = useSelector(selectUserStatus);
  const userError = useSelector(selectUserError);
  // const availableStores = useSelector(selectAllStores); // If using a dropdown for storeId

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user", // Default role
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateName(formData.name))
      newErrors.name = "Name must be Min 20 and Max 60 characters.";
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format.";
    if (!validatePassword(formData.password))
      newErrors.password = "Password: 8-16 chars, 1 uppercase, 1 special char.";
    if (!validateAddress(formData.address))
      newErrors.address = "Address cannot exceed 400 characters.";
    if (!formData.role) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (userStatus !== "loading") {
      try {
        await dispatch(createUser(formData)).unwrap();
        setToast({
          message: "User created successfully!.",
          type: "success",
        });
        setTimeout(() => navigate("/admin/users"), 3000);
      } catch (error) {
        // Error is handled by selectUserError
        console.error("Failed to create user:", error);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Add New User</h1>
      {userError && <ToastMessage message={userError} />}{" "}
      {toast.message && (
        <ToastMessage message={toast.message} type={toast.type} />
      )}
      <form onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`shadow appearance-none border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`shadow appearance-none border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`shadow appearance-none border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address
          </label>
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className={`shadow appearance-none border ${
              errors.address ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          ></textarea>
          {errors.address && (
            <p className="text-red-500 text-xs italic">{errors.address}</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role
          </label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            required
            className={`shadow appearance-none border ${
              errors.role ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs italic">{errors.role}</p>
          )}
        </div>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={userStatus === "loading"}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          >
            {userStatus === "loading" ? (
              <LoadingSpinner size="sm" />
            ) : (
              "Create User"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddUserPage;
