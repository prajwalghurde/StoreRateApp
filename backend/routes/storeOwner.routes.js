const express = require("express");
const auth = require("../middlewares/auth.middleware");
const storeOwnerController = require("../controllers/storeOwner.controller");
const router = express.Router();

router.use(auth);

router.get("/dashboard", storeOwnerController.getDashboard);

module.exports = router;
