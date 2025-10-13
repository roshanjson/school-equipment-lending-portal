const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

sequelize.authenticate()
  .then(() => console.log("MySQL DB connected"))
  .catch((err) => console.error("MySQL DB connection failed:", err));

module.exports = sequelize;