import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchStores,
  selectAllStores,
  selectStoresStatus,
  selectStoresError,
} from "../features/stores/storesSlice";
import StoreTable from "../components/admin/StoreTable";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ToastMessage from "../components/common/ToastMessage";

const AdminStoreListPage = () => {
  const dispatch = useDispatch();
  const stores = useSelector(selectAllStores);
  const status = useSelector(selectStoresStatus);

  const error = useSelector(selectStoresError);

  const [filters, setFilters] = useState({
    name: "",
    address: "",
    email: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ASC",
  });

  useEffect(() => {
    const queryParams = {
      ...filters,
      sortBy: sortConfig.key,
      order: sortConfig.direction,
    };
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] === "" || queryParams[key] === null) {
        delete queryParams[key];
      }
    });

    dispatch(fetchStores(queryParams));
  }, [dispatch, filters, sortConfig]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">Manage Stores</h1>
        <Link
          to="/admin/stores/add"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Store
        </Link>
      </div>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-gray-600">
          Filter Stores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Filter by Store Name"
            value={filters.name}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by Email"
            value={filters.email}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by Address"
            value={filters.address}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {status === "pending" && <LoadingSpinner />}
      {error && <ToastMessage message={error} />}
      {status === "succeeded" &&
        stores.length === 0 &&
        !Object.values(filters).some((f) => f !== "") && (
          <p className="text-center text-gray-500">
            No stores found. Add some!
          </p>
        )}
      {status === "succeeded" &&
        stores.length === 0 &&
        Object.values(filters).some((f) => f !== "") && (
          <p className="text-center text-gray-500">
            No stores match the current filters.
          </p>
        )}
      {status === "succeeded" && stores.length > 0 && (
        <StoreTable
          stores={stores}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      )}
    </div>
  );
};

export default AdminStoreListPage;
