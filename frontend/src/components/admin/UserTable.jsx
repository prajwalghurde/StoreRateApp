import React from "react";
import { Link } from "react-router-dom";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const UserTable = ({ users, onSort, sortConfig }) => {
  const getSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    if (sortConfig.direction === "ASC") {
      return <FaSortUp className="inline ml-1 text-blue-500" />;
    }
    return <FaSortDown className="inline ml-1 text-blue-500" />;
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              onClick={() => onSort("name")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Name {getSortIcon("name")}
            </th>
            <th
              scope="col"
              onClick={() => onSort("email")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Email {getSortIcon("email")}
            </th>
            <th
              scope="col"
              onClick={() => onSort("role")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Role {getSortIcon("role")}
            </th>
            <th
              scope="col"
              onClick={() => onSort("address")}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              Address {getSortIcon("address")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name || "NA"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email || "NA"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.role || "NA"}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate"
                title={user.address}
              >
                {user.address || "NA"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link
                  to={`/admin/users/${user.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
