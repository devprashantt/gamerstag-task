module.exports = (sequelize, DataTypes) => {
  const SuperAdmin = sequelize.define("SuperAdmin", {
    // Define properties of Salesperson model
  });

  SuperAdmin.associate = (models) => {
    SuperAdmin.belongsTo(models.User, { foreignKey: "userId" });
  };

  return SuperAdmin;
};
