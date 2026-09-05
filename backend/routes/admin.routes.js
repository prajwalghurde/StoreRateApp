const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");
const router = express.Router();

router.use(auth);
router.use(isAdmin);

router.get("/dashboard", adminController.getDashboardStats);
router.post("/users", adminController.createUser);
router.post("/stores", adminController.createStore);

router.get("/users", adminController.getAllUsers);
router.get("/stores", adminController.getAllStores);
router.get("/users/:id", adminController.getUserDetails);

module.exports = router;
