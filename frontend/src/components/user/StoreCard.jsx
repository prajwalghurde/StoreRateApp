import { useState } from "react";
import Modal from "../common/Modal";
import { CiShop, CiMail } from "react-icons/ci";
import { FaRegMap } from "react-icons/fa";

const StoreCard = ({ store, onRateOrUpdate }) => {
  const [showRatingModal, setShowRatingModal] = useState(false);

  const [currentRating, setCurrentRating] = useState(
    store.userRatingDetails?.rating || 0
  );

  const handleOpenRatingModal = () => {
    setCurrentRating(store.userRatingDetails?.rating || 1);
    setShowRatingModal(true);
  };

  const handleRatingSubmitOrUpdate = (ratingValue) => {
    onRateOrUpdate(store.id, ratingValue, store.ratingId); // Pass ratingId if it exists
    setShowRatingModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
        {" "}
        <CiShop />
        {store.name}
      </h3>
      <p className="text-gray-600 mb-1 flex items-center gap-2">
        {" "}
        <FaRegMap /> {store.address}
      </p>
      <p className="text-gray-600 mb-1 flex items-center gap-2">
        <CiMail /> {store.email || "N/A"}
      </p>
      <p className="text-yellow-500 font-bold mb-3">
        Overall Rating:{" "}
        {store.averageRating ? store.averageRating : "Not Rated Yet"} / 5
      </p>
      {store?.userRating && ( // Check if user has rated
        <p className="text-green-600 mb-3">
          Your Rating: {store.userRating} / 5
        </p>
      )}
      <button
        onClick={handleOpenRatingModal}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
      >
        {store?.userRating ? "Modify Your Rating" : "Submit Rating"}
      </button>

      {showRatingModal && (
        <Modal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          title={`Rate ${store.name}`}
        >
          <div className="p-4">
            <p className="mb-4">Select your rating (1-5):</p>
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setCurrentRating(star)}
                  className={`w-10 h-10 rounded-full text-lg ${
                    currentRating >= star
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleRatingSubmitOrUpdate(currentRating)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full"
            >
              {store?.userRating ? "Update Rating" : "Submit Rating"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StoreCard;
