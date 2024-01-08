const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models");

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, password } });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { loginUser };
