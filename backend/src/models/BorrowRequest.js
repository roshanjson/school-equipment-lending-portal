const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const User = require("./User");
const Equipment = require("./Equipment");

const BorrowRequest = sequelize.define("BorrowRequest", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  quantity: { type: DataTypes.INTEGER },
  status: {
    type: DataTypes.ENUM("requested", "pending", "approved", "rejected", "returned"),
    defaultValue: "requested",
  },
  borrowDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  returnDate: { type: DataTypes.DATE, allowNull: true }
});

// Relationships
User.hasMany(BorrowRequest, { foreignKey: "userId" });
BorrowRequest.belongsTo(User, { foreignKey: "userId" });

Equipment.hasMany(BorrowRequest, { foreignKey: "equipmentId" });
BorrowRequest.belongsTo(Equipment, { foreignKey: "equipmentId" });

module.exports = BorrowRequest;
