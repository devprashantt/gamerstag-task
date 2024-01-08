module.exports = (sequelize, DataTypes) => {
  const Salesperson = sequelize.define("Salesperson", {
    // Define properties of Salesperson model
  });

  Salesperson.associate = (models) => {
    Salesperson.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Salesperson;
};
