const { Op } = require("sequelize");
const {
  asyncHandler,
  createError,
  sendResponse,
} = require("../middlewares/errorHandler.middleware");
const {
  validate,
  passwordSchema,
  storeSchema,
  ratingSchema,
} = require("../utils/validation");
const User = require("../models/user.model");
const { comparePasswords, hashPassword } = require("../utils/auth");
const { Store, Rating } = require("../models");

//Update password
exports.updatePassword = [
  validate(passwordSchema),
  asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const userId = req.user.id;

    // Check user exists or not
    const user = await User.findByPk(userId);

    if (!user) throw createError("User not authenticated", 404);

    // Match user old and saved password before changing
    const match = await comparePasswords(oldPassword, user.password);

    if (!match) throw createError("Old password is incorrect");

    // Hash new password
    const hashed = await hashPassword(newPassword);

    user.password = hashed;

    // Uodate new password
    await user.save();

    sendResponse(res, "Password updated");
  }),
];

// View/Search Stores
exports.getAllStoresWithRatings = asyncHandler(async (req, res) => {
  const { name, address } = req.query;
  const userId = req.user?.id;

  if (!userId) throw createError("User not authenticated", 401);

  const filters = {};
  if (name) filters.name = { [Op.iLike]: `%${name}%` };
  if (address) filters.address = { [Op.iLike]: `%${address}%` };

  const stores = await Store.findAll({ where: filters });
  const ratings = await Rating.findAll({ where: { userId } });

  const storeList = await Promise.all(
    stores.map(async (store) => {
      const allRatings = await Rating.findAll({ where: { storeId: store.id } });

      const avgRating =
        allRatings.length > 0
          ? Number(
              (
                allRatings.reduce((sum, r) => sum + r.rating, 0) /
                allRatings.length
              ).toFixed(2)
            )
          : 0;

      const userRatingEntry = ratings.find((r) => r.storeId === store.id);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        email: store.email,
        averageRating: avgRating,
        userRating: userRatingEntry?.rating || null,
        ratingId: userRatingEntry?.id || null,
      };
    })
  );

  sendResponse(res, "Stores retrieved successfully", 200, storeList);
});

// Submit Rating
exports.submitRating = [
  validate(ratingSchema),
  asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { storeId, rating } = req.body;

    if (!userId) throw createError("User not authenticated", 401);

    if (rating < 1 || rating > 5)
      throw createError("Rating must be between 1 and 5", 400);

    const exists = await Rating.findOne({ where: { userId, storeId } });

    if (exists)
      throw createError("Rating already exists, use update instead", 400);

    const newRating = await Rating.create({ userId, storeId, rating });

    // Calculate new average rating
    const allRatings = await Rating.findAll({ where: { storeId } });
    const newAverageRating = Number(
      (
        allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length
      ).toFixed(2)
    );

    sendResponse(res, "Rating submitted successfully", 201, {
      rating: newRating,
      newAverageRating,
    });
  }),
];

// Update Rating
exports.updateRating = asyncHandler(async (req, res) => {
  const ratingId = req.params.id;
  const { rating } = req.body;
  const userId = req.user?.id;

  if (!userId) throw createError("User not authenticated", 401);

  if (rating < 1 || rating > 5)
    throw createError("Rating must be between 1 and 5", 400);

  const userRating = await Rating.findByPk(ratingId);

  if (!userRating) throw createError("Rating not found, 404");

  if (userRating.userId !== userId)
    throw createError("You are not authorized to update this rating", 403);

  userRating.rating = rating;
  await userRating.save();

  sendResponse(res, "Rating updated successfully", 200, userRating);
});
