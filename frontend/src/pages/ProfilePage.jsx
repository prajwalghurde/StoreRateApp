import React from "react";
import UpdatePasswordForm from "../components/common/UpdatePasswordForm";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Profile
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Manage your account settings.
        </p>

        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Account Information
          </h2>
          <div className="grid grid-cols-1 gap-y-2 text-sm">
            <p>
              <span className="font-medium text-gray-600">Name:</span>{" "}
              {user?.name}
            </p>
            <p>
              <span className="font-medium text-gray-600">Email:</span>{" "}
              {user?.email}
            </p>
            <p>
              <span className="font-medium text-gray-600">Role:</span>{" "}
              {user?.role}
            </p>
            {user?.address && (
              <p>
                <span className="font-medium text-gray-600">Address:</span>{" "}
                {user?.address}
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Change Password
          </h2>
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
