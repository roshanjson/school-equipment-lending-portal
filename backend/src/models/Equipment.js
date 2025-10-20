const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Equipment = sequelize.define("Equipment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  condition: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  availability: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Equipment;