const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  // Remove Bearer from string
  const tokenString = token.split(" ");
  const tokenValue = tokenString[1];

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Forbidden: Invalid token", token: token });
    }
    req.user = user;
    next();
  });
};

const authorizeRoles = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);

      if (!roles.includes(user.role)) {
        return res
          .status(403)
          .json({ error: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = { authenticateToken, authorizeRoles };
