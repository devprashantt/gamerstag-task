// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
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
    },
  });

  User.associate = (models) => {
    // SuperAdmin has many Branch Managers
    User.hasMany(models.User, {
      as: "BranchManagers",
      foreignKey: "superAdminId",
    });

    // Each Branch Manager belongs to a SuperAdmin
    User.belongsTo(models.User, {
      as: "SuperAdmin",
      foreignKey: "superAdminId",
    });

    // Each Branch Manager has many Salespersons
    User.hasMany(models.User, {
      as: "Salespersons",
      foreignKey: "branchManagerId",
    });

    // Each Salesperson belongs to a Branch Manager and a SuperAdmin
    User.belongsTo(models.User, {
      as: "BranchManager",
      foreignKey: "branchManagerId",
    });
    User.belongsTo(models.User, {
      as: "SalespersonSuperAdmin",
      foreignKey: "superAdminId",
    });
  };

  return User;
};
