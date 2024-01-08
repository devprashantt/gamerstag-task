const { where } = require("sequelize");
const { User } = require("../models");

const getSelf = (req, res) => {
  res.status(200).json({ msg: "Data fetched successfully", user: req.user });
};

const createUser = async (req, res) => {
  try {
    const { role } = req.user; // Get the role of the logged-in user

    // Check if the logged-in user has the right to create users with the specified role
    if (
      (role === "SuperAdmin" &&
        (req.body.role === "Branch Manager" ||
          req.body.role === "Salesperson")) ||
      (role === "Branch Manager" && req.body.role === "Salesperson")
    ) {
      const newUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
      });

      return res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    }

    return res.status(403).json({
      error:
        "Forbidden: Insufficient permissions to create user with the specified role",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserList = async (req, res) => {
  try {
    const { role } = req.user; // Get the role of the logged-in user

    // Check if the logged-in user has the right to get the user list
    if (role === "SuperAdmin" || role === "Branch Manager") {
      const userList =
        role === "SuperAdmin"
          ? await User.findAll({
              where: { role: ["Branch Manager", "Salesperson"] },
            })
          : await User.findAll({ where: { role: "Salesperson" } });

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
    const { role } = req.user; // Get the role of the logged-in user

    // Check if the logged-in user has the right to delete the specified user
    if (
      role === "SuperAdmin" ||
      (role === "Branch Manager" && req.params.userId === req.user.id)
    ) {
      await User.destroy({ where: { id: req.params.userId } });

      return res.status(200).json({ message: "User deleted successfully" });
    }

    return res.status(403).json({
      error: "Forbidden: Insufficient permissions to delete the specified user",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createUser, deleteUser, getSelf, getUserList };
