import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
  selectUserRole,
} from "../features/auth/authSlice";
import { useForm } from "react-hook-form";

import { validateEmail, validatePassword } from "../utils/formValidators";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ToastMessage from "../components/common/ToastMessage";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === "admin") navigate("/admin/dashboard");
      else if (userRole === "user") navigate("/dashboard");
      else if (userRole === "owner") navigate("/store-owner/dashboard");
      else navigate("/");
    }
  }, [isAuthenticated, userRole, navigate]);

  const onSubmit = (data) => {
    if (authStatus !== "loading") {
      dispatch(loginUser(data));
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Login
        </h2>
        {authError && <ToastMessage message={authError} />}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                validate: (value) =>
                  validateEmail(value) || "Invalid email format",
              })}
              className="shadow appearance-none border rounded
               w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  validatePassword(value) ||
                  "Password must be 8-16 characters, include an uppercase letter and a special character",
              })}
              className="shadow appearance-none border rounded
               w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex  items-center justify-between">
            <button
              type="submit"
              disabled={authStatus === "loading"}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
            focus:outline-none focus:shadow-outline w-full h-10 flex items-center justify-center disabled:bg-blue-300"
            >
              {authStatus === "loading" ? (
                <LoadingSpinner size="sm" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
