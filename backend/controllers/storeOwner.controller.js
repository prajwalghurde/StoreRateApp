const {
  asyncHandler,
  createError,
  sendResponse,
} = require("../middlewares/errorHandler.middleware");
const { Store, Rating, User } = require("../models");

exports.getDashboard = asyncHandler(async (req, res) => {
  const ownerId = req.user?.id;

  if (!ownerId) throw createError("User not authenticated", 401);

  if (req.user.role !== "owner") throw createError("Access denied", 403);

  const stores = await Store.findAll({ where: { ownerId } });

  const dashboard = await Promise.all(
    stores.map(async (store) => {
      const ratings = await Rating.findAll({
        where: { storeId: store.id },
        include: [
          { model: User, attributes: ["id", "name", "email", "address"] },
        ],
      });

      const averageRating = ratings.length
        ? (
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          ).toFixed(2)
        : "N/A";

      const ratedByUsers = ratings.map((r) => ({
        id: r.User.id,
        name: r.User.name,
        email: r.User.email,
        address: r.User.address,
        rating: r.rating,
      }));

      return {
        storeId: store.id,
        storeName: store.name,
        averageRating,
        ratedByUsers,
      };
    })
  );

  return sendResponse(res, "Dashboard data retrieved successfully", 200, {
    dashboard,
  });
});
