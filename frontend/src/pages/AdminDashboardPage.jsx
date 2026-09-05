import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminStats,
  selectAdminDashboardStats,
  selectAdminDashboardStatus,
} from "../features/adminDashboard/adminDashboardSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { totalUsers, totalStores, totalRatings } = useSelector(
    selectAdminDashboardStats
  );
  const status = useSelector(selectAdminDashboardStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAdminStats());
    }
  }, [status, dispatch]);

  if (status === "loading") return <LoadingSpinner />;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        System Administrator Dashboard
      </h1>
      {status === "loading" && <LoadingSpinner />}
      {status === "succeeded" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Total Users
            </h2>
            <p className="text-4xl font-bold text-blue-500">{totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Total Stores
            </h2>
            <p className="text-4xl font-bold text-green-500">{totalStores}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Total Submitted Ratings
            </h2>
            <p className="text-4xl font-bold text-purple-500">{totalRatings}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
