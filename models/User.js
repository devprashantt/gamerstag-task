const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["SuperAdmin", "BranchManager", "Salesperson"]],
      },
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.User, {
      as: "SuperAdmin",
      foreignKey: "superAdminId",
    });
    User.hasMany(models.User, {
      as: "BranchManagers",
      foreignKey: "superAdminId",
    });
    User.belongsTo(models.User, {
      as: "BranchManager",
      foreignKey: "branchManagerId",
    });
    User.hasMany(models.User, {
      as: "Salespersons",
      foreignKey: "branchManagerId",
    });
  };

  return User;
};
