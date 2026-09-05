import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStores,
  selectAllStores,
  selectStoresStatus,
  selectStoresError,
  submitStoreRating,
  modifyStoreRating,
} from "../features/stores/storesSlice";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ToastMessage from "../components/common/ToastMessage";
import StoreCard from "../components/user/StoreCard";

const UserDashboardPage = () => {
  const dispatch = useDispatch();
  const stores = useSelector(selectAllStores);
  const status = useSelector(selectStoresStatus);
  const error = useSelector(selectStoresError);
  const [ratingError, setRatingError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  useEffect(() => {
    const filters = {};
    if (searchTerm) filters.name = searchTerm;
    if (searchAddress) filters.address = searchAddress;

    dispatch(fetchUserStores(filters)); // Ensure fetchStores uses token
  }, [dispatch, searchTerm, searchAddress]);

  const handleRateOrUpdateStore = async (
    storeId,
    ratingValue,
    existingRatingId
  ) => {
    try {
      setRatingError(null);
      if (existingRatingId) {
        await dispatch(
          modifyStoreRating({
            ratingId: existingRatingId,
            newRatingValue: ratingValue,
            storeId,
          })
        ).unwrap();
      } else {
        await dispatch(
          submitStoreRating({
            storeId,
            rating: ratingValue,
          })
        ).unwrap();
      }
      // Refresh store list to get updated ratings
      dispatch(fetchUserStores({}));
    } catch (error) {
      setRatingError(error.message || "Failed to submit rating");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-700">
        Registered Stores
      </h1>
      {ratingError && <ToastMessage message={ratingError} type="error" />}
      <form
        onSubmit={handleSearch}
        className="mb-6 bg-white p-4 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="searchTerm"
              className="block text-sm font-medium text-gray-700"
            >
              Search by Name
            </label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Store Name..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="searchAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Search by Address
            </label>
            <input
              type="text"
              id="searchAddress"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Store Address..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="md:self-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </div>
      </form>
      {status === "pending" && <LoadingSpinner />}
      {error && <ToastMessage message={error} />}
      {status === "succeeded" && stores.length === 0 && (
        <p className="text-center text-gray-500">
          No stores found matching your criteria.
        </p>
      )}
      {status === "succeeded" && stores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onRateOrUpdate={handleRateOrUpdateStore}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
