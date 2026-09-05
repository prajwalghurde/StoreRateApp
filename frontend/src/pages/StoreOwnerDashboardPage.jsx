import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStoreOwnerData,
  selectStoreOwnerStores,
  selectStoreOwnerStatus,
  selectStoreOwnerError,
} from "../features/storeOwnerDashboard/storeOwnerDashboardSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ToastMessage from "../components/common/ToastMessage";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const StoreOwnerDashboardPage = () => {
  const dispatch = useDispatch();
  const stores = useSelector(selectStoreOwnerStores);
  const status = useSelector(selectStoreOwnerStatus);
  const error = useSelector(selectStoreOwnerError);

  const [sortConfigs, setSortConfigs] = useState({});

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStoreOwnerData());
    }
  }, [dispatch, status]);

  const handleSort = (storeId, key) => {
    const current = sortConfigs[storeId] || { key: "name", direction: "ASC" };
    let direction = "ASC";
    if (current.key === key && current.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfigs((prev) => ({
      ...prev,
      [storeId]: { key, direction },
    }));
  };

  const getSortedUsers = (storeId, users) => {
    if (!users || users.length === 0) return [];
    const config = sortConfigs[storeId] || { key: "name", direction: "ASC" };
    return [...users].sort((a, b) => {
      let aVal = a[config.key] ?? "";
      let bVal = b[config.key] ?? "";
      if (typeof aVal === "string") {
        const cmp = aVal.localeCompare(bVal);
        return config.direction === "ASC" ? cmp : -cmp;
      }
      return config.direction === "ASC" ? aVal - bVal : bVal - aVal;
    });
  };

  const getSortIcon = (storeId, key) => {
    const config = sortConfigs[storeId];
    if (!config || config.key !== key) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    if (config.direction === "ASC") {
      return <FaSortUp className="inline ml-1 text-blue-500" />;
    }
    return <FaSortDown className="inline ml-1 text-blue-500" />;
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return (
      <ToastMessage
        message={error || "Could not load dashboard data."}
        type="error"
      />
    );
  }

  if (status !== "succeeded" || !stores || stores.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No stores available yet.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-700 mb-8">
        My Stores Dashboard
      </h1>

      {stores.map((store) => (
        <div key={store.storeId} className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              {store.storeName}
            </h2>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Average Store Rating
              </h3>
              <p className="text-5xl font-bold text-yellow-500">
                {store.averageRating} / 5
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Users Who Rated This Store
              </h3>
              {store.ratedByUsers && store.ratedByUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          onClick={() => handleSort(store.storeId, "name")}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          User Name {getSortIcon(store.storeId, "name")}
                        </th>
                        <th
                          scope="col"
                          onClick={() => handleSort(store.storeId, "email")}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          User Email {getSortIcon(store.storeId, "email")}
                        </th>
                        <th
                          scope="col"
                          onClick={() => handleSort(store.storeId, "rating")}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          Rating Given {getSortIcon(store.storeId, "rating")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getSortedUsers(store.storeId, store.ratedByUsers).map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                            {user.rating} / 5
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No users have rated this store yet.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreOwnerDashboardPage;
