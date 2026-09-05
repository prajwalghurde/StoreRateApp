const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth);

router.put("/update-password", userController.updatePassword);
router.get("/stores", userController.getAllStoresWithRatings);
router.post("/ratings", userController.submitRating);
router.put("/ratings/:id", userController.updateRating);

module.exports = router;
