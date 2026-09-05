import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthStatus } from "../../features/auth/authSlice";
import apiService from "../../services/apiServices";
import LoadingSpinner from "./LoadingSpinner";

import { validatePassword } from "../../utils/formValidators";

const UpdatePasswordForm = () => {
  const authStatus = useSelector(selectAuthStatus);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formMessage, setFormMessage] = useState({ type: "", text: "" }); // For success/error messages

  const [localLoading, setLocalLoading] = useState(false); // Local loading for direct API call

  const validate = () => {
    const newErrors = {};
    if (!currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (!validatePassword(newPassword)) {
      newErrors.newPassword =
        "New Password: 8-16 chars, 1 uppercase, 1 special char.";
    }
    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "New passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: "", text: "" });
    if (!validate()) return;

    setLocalLoading(true); // Start local loading
    try {
      const token = localStorage.getItem("token"); // Or from Redux store
      if (!token) {
        setFormMessage({
          type: "error",
          text: "Authentication token not found. Please log in again.",
        });
        setLocalLoading(false);
        return;
      }
      // Update to use correct parameter names that match the backend schema
      await apiService.updatePassword(token, {
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      setFormMessage({
        type: "success",
        text: "Password updated successfully!",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update password.";
      setFormMessage({ type: "error", text: errorMessage });
    } finally {
      setLocalLoading(false); // Stop local loading
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formMessage.text && (
        <div
          className={`p-3 rounded-md ${
            formMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {formMessage.text}
        </div>
      )}

      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <input
          type="password"
          name="currentPassword"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.currentPassword ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.currentPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.currentPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.newPassword ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmNewPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm New Password
        </label>
        <input
          type="password"
          name="confirmNewPassword"
          id="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.confirmNewPassword ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.confirmNewPassword && (
          <p className="mt-1 text-xs text-red-500">
            {errors.confirmNewPassword}
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={localLoading || authStatus === "loading"}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {localLoading || authStatus === "loading" ? (
            <LoadingSpinner size="sm" />
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
