const { where } = require("sequelize");
const { User } = require("../models");

const getSelf = (req, res) => {
  res.status(200).json({ msg: "Data fetched successfully", user: req.user });
};

const createUser = async (req, res) => {
  try {
    const { role, id } = req.user;
    const { role: newRole } = req.body;

    // Check if the role is valid
    if (!["SuperAdmin", "BranchManager", "Salesperson"].includes(newRole)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Salespersons can't create any user
    if (role === "Salesperson") {
      return res.status(403).json({
        error: "Forbidden: Salespersons can't create any user",
      });
    }

    // BranchManagers can only create Salespersons
    if (role === "BranchManager" && newRole !== "Salesperson") {
      return res.status(403).json({
        error: "Forbidden: BranchManagers can only create Salespersons",
      });
    }

    // Check if the logged-in user has the right to create the specified user
    if (
      (role === "SuperAdmin" && newRole === "SuperAdmin") ||
      (role === "BranchManager" && newRole === "BranchManager")
    ) {
      return res.status(403).json({
        error:
          "Forbidden: Insufficient permissions to create the specified user",
      });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    // Get the super admin id of user
    const { superAdminId } = await User.findByPk(id);

    // Create the user with additional information based on the role
    const newUser = await User.create({
      ...req.body,
      superAdminId: role === "SuperAdmin" ? id : superAdminId,
      branchManagerId: role === "BranchManager" ? id : null,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserList = async (req, res) => {
  try {
    const { role, id } = req.user;

    // Check if the logged-in user has the right to get the user list
    if (role === "SuperAdmin" || role === "BranchManager") {
      let userList;

      if (role === "SuperAdmin") {
        userList = await User.findAll({
          where: {
            role: ["BranchManager", "Salesperson"],
            superAdminId: id,
          },
        });
      } else {
        userList = await User.findAll({
          where: {
            role: "Salesperson",
            branchManagerId: id,
          },
        });
      }

      return res
        .status(200)
        .json({ message: "User list fetched successfully", userList });
    }

    return res.status(403).json({
      error: "Forbidden: Insufficient permissions to get the user list",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { role, id, superAdminId } = req.user;
    const userIdToDelete = req.params.userId;

    // Check if the logged-in user has the right to delete the specified user
    if (
      (role === "SuperAdmin" && userIdToDelete === id) ||
      (role === "BranchManager" &&
        (userIdToDelete === id || userIdToDelete === superAdminId)) ||
      (role === "Salesperson" && userIdToDelete === id)
    ) {
      return res.status(403).json({
        error:
          "Forbidden: Insufficient permissions to delete the specified user",
      });
    }

    // Check if the user exists
    const user = await User.findByPk(userIdToDelete);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user is admin, can delete anyone except admins
    if (role === "SuperAdmin" && user.role === "SuperAdmin") {
      return res.status(403).json({
        error: "Forbidden: Insufficient permissions to delete the user",
      });
    }

    // If user is branch manager, can delete only salesperson created by them
    if (
      role === "BranchManager" &&
      user.role === "Salesperson" &&
      user.branchManagerId !== id
    ) {
      return res.status(403).json({
        error: "Forbidden: Insufficient permissions to delete the user",
      });
    }

    // If user is salesperson, can delete only themselves
    if (role === "Salesperson" && user.id !== id) {
      return res.status(403).json({
        error: "Forbidden: Insufficient permissions to delete the user",
      });
    }

    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createUser, deleteUser, getSelf, getUserList };
