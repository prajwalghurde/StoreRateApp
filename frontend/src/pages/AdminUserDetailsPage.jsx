import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchUserById,
  selectSingleUser,
  selectUserStatus,
  selectUserError,
} from "../features/users/userSlice";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ToastMessage from "../components/common/ToastMessage";

const AdminUserDetailsPage = () => {
  const { userId } = useParams();

  const dispatch = useDispatch();
  const user = useSelector(selectSingleUser);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  if (status === "pending") {
    return <LoadingSpinner />;
  }
  if (error) {
    return <ToastMessage message={error} />;
  }
  if (!user && status === "succeeded") {
    return (
      <div className="text-center text-gray-500 mt-10">User not found.</div>
    );
  }
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
        <Link to="/admin/users" className="text-blue-500 hover:text-blue-700">
          ← Back to Users List
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Email</h3>
          <p className="mt-1 text-lg text-gray-900">{user.email}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Role</h3>
          <p className="mt-1 text-lg text-gray-900">{user.role}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Address</h3>
          <p className="mt-1 text-lg text-gray-900">{user.address}</p>
        </div>

        {user.role === "owner" && (
          <>
            {user.stores.map((store) => (
              <>
                <div key={store.id}>
                  <h3 className="text-sm font-medium text-gray-500">
                    Store ID
                  </h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {store.id || "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Store's Rating
                  </h3>

                  <p className="mt-1 text-lg text-yellow-500 font-semibold">
                    {store.averageRating
                      ? `${store.averageRating} / 5`
                      : "Rating N/A"}
                  </p>
                </div>
              </>
            ))}
          </>
        )}
      </div>
      {/* Add Edit button or other actions if needed */}
    </div>
  );
};

export default AdminUserDetailsPage;
