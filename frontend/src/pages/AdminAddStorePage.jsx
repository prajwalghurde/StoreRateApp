import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createStoreByAdmin,
  selectStoresStatus,
  selectStoresError,
} from "../features/stores/storesSlice";
import { fetchUsers, selectAllUsers } from "../features/users/userSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

import {
  validateName,
  validateEmail,
  validateAddress,
} from "../utils/formValidators"; // Assuming name validation is generic
import ToastMessage from "../components/common/ToastMessage";

const AdminAddStorePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storeStatus = useSelector(selectStoresStatus); // Use a more specific status for create if available
  const storeError = useSelector(selectStoresError); // Use a more specific error for create if available
  const users = useSelector(selectAllUsers);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    // Fetch users to populate owner dropdown
    dispatch(fetchUsers({ role: "owner" }));
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    // Using generic name validation for store name, adjust if needed
    if (!validateName(formData.name))
      newErrors.name = "Store name must be Min 20 and Max 60 characters.";
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format for store.";
    if (!validateAddress(formData.address))
      newErrors.address = "Store address cannot exceed 400 characters.";
    if (!formData.ownerId) newErrors.ownerId = "Please select a store owner.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (storeStatus !== "loading") {
      // Check specific status for 'creating'
      try {
        await dispatch(createStoreByAdmin(formData)).unwrap();
        setToast({
          message: "Store created successfully!.",
          type: "success",
        });
        setTimeout(() => navigate("/admin/stores"), 3000);
      } catch (error) {
        console.error("Failed to create store:", error);
        // Error is in storeError
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Add New Store</h1>
      {storeError && <ToastMessage message={storeError} />}
      {toast.message && (
        <ToastMessage message={toast.message} type={toast.type} />
      )}
      <form onSubmit={handleSubmit} noValidate>
        {/* Store Name */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Store Name
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

        {/* Store Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Store Email
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

        {/* Store Address */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Store Address
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

        {/* Store Owner */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ownerId"
          >
            Store Owner
          </label>
          <select
            name="ownerId"
            id="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            required
            className={`shadow appearance-none border ${
              errors.ownerId ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          >
            <option value="">Select a store owner</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.ownerId && (
            <p className="text-red-500 text-xs italic">{errors.ownerId}</p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/stores")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={storeStatus === "loading"}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          >
            {storeStatus === "loading" ? (
              <LoadingSpinner size="sm" />
            ) : (
              "Create Store"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddStorePage;
