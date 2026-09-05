import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchUsers,
  selectAllUsers,
  selectUserStatus,
  selectUserError,
} from "../features/users/userSlice";
import UserTable from "../components/admin/UserTable";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ToastMessage from "../components/common/ToastMessage";

const AdminUserListPage = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    address: "",
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
    // Remove empty filters
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] === "" || queryParams[key] === null) {
        delete queryParams[key];
      }
    });
    dispatch(fetchUsers(queryParams));
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
        <h1 className="text-3xl font-bold text-gray-700">Manage Users</h1>
        <Link
          to="/admin/users/add"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New User
        </Link>
      </div>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-gray-600">
          Filter Users
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Filter by Name"
            value={filters.name}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
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
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="owner">Owner</option>
          </select>
        </div>
      </div>

      {status === "loading" && <LoadingSpinner />}
      {error && <ToastMessage message={error} />}
      {status === "succeeded" &&
        users.length === 0 &&
        !Object.values(filters).some((f) => f !== "") && (
          <p className="text-center text-gray-500">No users found. Add some!</p>
        )}
      {status === "succeeded" &&
        users.length === 0 &&
        Object.values(filters).some((f) => f !== "") && (
          <p className="text-center text-gray-500">
            No users match the current filters.
          </p>
        )}
      {status === "succeeded" && users.length > 0 && (
        <UserTable users={users} onSort={handleSort} sortConfig={sortConfig} />
      )}
    </div>
  );
};

export default AdminUserListPage;
