const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/auth.middleware");
const {
  createUser,
  deleteUser,
  getSelf,
  getUserList,
} = require("../controllers/user.controller");

// Get self information
router.get(
  "/self",
  authenticateToken,
  authorizeRoles(["SuperAdmin", "BranchManager", "Salesperson"]),
  getSelf
);

// Get user list
router.get(
  "/list",
  authenticateToken,
  authorizeRoles(["SuperAdmin", "BranchManager"]),
  getUserList
);

// Example: SuperAdmin can create users with roles Branch Manager or Salesperson
router.post(
  "/create",
  authenticateToken,
  authorizeRoles(["SuperAdmin", "BranchManager"]),
  createUser
);

// Example: SuperAdmin can delete any user, Branch Manager can delete only their related Salespersons
router.delete(
  "/delete/:userId",
  authenticateToken,
  authorizeRoles(["SuperAdmin", "BranchManager"]),
  deleteUser
);

module.exports = router;
