const {
  asyncHandler,
  createError,
  sendResponse,
} = require("../middlewares/errorHandler.middleware");
const { User } = require("../models");
const {
  hashPassword,
  comparePasswords,
  generateToken,
} = require("../utils/auth");
const { validate, userSchema, loginSchema } = require("../utils/validation");

exports.register = [
  validate(userSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, address, role } = req.body;
    // Check if email already exists
    const exists = await User.findOne({ where: { email } });
    if (exists) throw createError("Email is already in use", 400);

    // Hash password and create user
    const hashed = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashed,
      address,
      role,
    });

    sendResponse(res, "User registered successfully", 201, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }),
];

exports.login = [
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) throw createError("Invalid credentials", 401);

    // verify password
    const match = await comparePasswords(password, user.password);

    if (!match) throw createError("Invalid credentials", 401);

    // Generate token
    const token = generateToken(user);

    // Return success response

    sendResponse(res, "Login successful", 200, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }),
];
