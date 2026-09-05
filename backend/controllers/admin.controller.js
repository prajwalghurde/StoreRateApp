const { Op } = require("sequelize");
const { User, Store, Rating, sequelize } = require("../models");
const { hashPassword } = require("../utils/auth");
const {
  asyncHandler,
  createError,
  sendResponse,
} = require("../middlewares/errorHandler.middleware");
const { validate, userSchema, storeSchema } = require("../utils/validation");

// 1. Dashboard Stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);

  sendResponse(res, "Successfully fetched stats", 200, {
    totalUsers,
    totalStores,
    totalRatings,
  });
});

// 2. Add User
exports.createUser = [
  validate(userSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, address, role } = req.body;

    //check if email already exists
    const exists = await User.findOne({ where: { email } });
    if (exists) throw createError("Email already in use", 400);

    const hashed = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      password: hashed,
      address,
      role,
    });

    // Don't return password in response
    const { password: _, ...userData } = user.toJSON();

    sendResponse(res, "User created successfully", 201, userData);
  }),
];

// 3. Add store
exports.createStore = [
  validate(storeSchema),
  asyncHandler(async (req, res) => {
    const { name, email, address, ownerId } = req.body;

    // Verify owner exists and has owner role
    const owner = await User.findByPk(ownerId);
    if (!owner) throw createError("Owner not found", 404);

    if (owner.role !== "owner")
      throw createError("'User must have owner role to own a store", 404);

    const store = await Store.create({ name, email, address, ownerId });

    sendResponse(res, "Store created successfully", 201, store);
  }),
];

// 4. Get All Users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    name,
    email,
    address,
    role,
    sortBy = "name",
    order = "ASC",
  } = req.query;

  // Validate sort field to prevent SQL injection
  const validateSortFields = ["id", "name", "email", "address", "createdAt", "role"];
  const sort = validateSortFields.includes(sortBy) ? sortBy : "name";
  const direction = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  // Build filter conditions
  const filters = {};
  if (name) filters.name = { [Op.iLike]: `%${name}%` };
  if (email) filters.email = { [Op.iLike]: `%${email}%` };
  if (address) filters.address = { [Op.iLike]: `%${address}%` };
  if (role) filters.role = role;

  // calculate pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const pageSize = parseInt(limit);

  const { count, rows: users } = await User.findAndCountAll({
    where: filters,
    order: [[sort, direction]],
    limit: pageSize,
    offset,
    attributes: { exclude: ["password"] },
  });

  sendResponse(res, "Successfully fetched users", 200, {
    users,
    pagination: {
      total: count,
      page: parseInt(page),
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    },
  });
});

// 5. Get All Stores
exports.getAllStores = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    name,
    email,
    address,
    sortBy = "name",
    order = "ASC",
  } = req.query;

  // Validate sort field to prevent SQL injection
  const validSortFields = ["id", "name", "email", "address", "createdAt", "averageRating"];
  const sort = validSortFields.includes(sortBy) ? sortBy : "name";
  const direction = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const orderClause =
    sort === "averageRating"
      ? [[sequelize.literal('ROUND(COALESCE(AVG("Ratings"."rating"), 0),1)'), direction]]
      : [[sort, direction]];

  // Build filter conditions
  const filters = {};
  if (name) filters.name = { [Op.iLike]: `%${name}%` };
  if (email) filters.email = { [Op.iLike]: `%${email}%` };
  if (address) filters.address = { [Op.iLike]: `%${address}%` };

  // Calculate pagination
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const pageSize = parseInt(limit);

  const { count, rows: stores } = await Store.findAndCountAll({
    where: filters,
    order: orderClause,
    limit: pageSize,
    offset,
    include: [
      {
        model: User,
        as: "owner",
        attributes: ["id", "name", "email"],
      },
      {
        model: Rating,
        attributes: [],
        required: false,
      },
    ],
    attributes: {
      include: [
        [
          sequelize.literal('ROUND(COALESCE(AVG("Ratings"."rating"), 0),1)'),
          "averageRating",
        ],
        [sequelize.literal('COUNT("Ratings"."id")'), "ratingsCount"],
      ],
    },
    group: ["Store.id", "owner.id"],
    subQuery: false,
  });

  sendResponse(res, "Successfully fetched stores", 200, {
    stores,
    pagination: {
      total: count.length,
      page: parseInt(page),
      pageSize,
      totalPages: Math.ceil(count.length / pageSize),
    },
  });
});

// 6. Get User Detail
exports.getUserDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findByPk(id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) throw createError("User not found", 404);

  let response = user.toJSON();

  if (user.role === "owner") {
    // For owners, get their stores and calculate average rating
    const stores = await Store.findAll({
      where: { ownerId: id },
      include: [
        {
          model: Rating,
          attributes: ["rating"],
        },
      ],
    });

    // Calculate average rating across all their stores
    const allRatings = stores.flatMap((store) =>
      store.Ratings.map((rating) => rating.rating)
    );

    response.stores = stores.map((store) => ({
      ...store.toJSON(),
      Ratings: undefined, // Remove the ratings array
      averageRating: calculateAverage(store.Ratings.map((r) => r.rating)),
      ratingsCount: store.Ratings.length,
    }));

    response.stores_count = stores.length;
    response.averageRating = calculateAverage(allRatings);
    response.totalRatings = allRatings.length;
  }

  sendResponse(res, "Successfully fetched user details", 200, response);
});

// Helper function to calculate average rating
function calculateAverage(ratings) {
  if (!ratings || ratings.length === 0) return "N/A";
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  return (sum / ratings.length).toFixed(2);
}
