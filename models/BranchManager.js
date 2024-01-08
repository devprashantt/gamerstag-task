module.exports = (sequelize, DataTypes) => {
  const BranchManager = sequelize.define("BranchManager", {
    // Define properties of BranchManager model
  });

  BranchManager.associate = (models) => {
    BranchManager.belongsTo(models.User, { foreignKey: "userId" });
    BranchManager.hasMany(models.Salesperson, {
      foreignKey: "branchManagerId",
    });
  };

  return BranchManager;
};
