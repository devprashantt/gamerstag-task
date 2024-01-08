const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const { loginUser } = require("../controllers/auth.controller");

router.use("/login", loginUser);

module.exports = router;
