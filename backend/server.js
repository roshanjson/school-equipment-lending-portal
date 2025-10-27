const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const equipmentRoutes = require("./src/routes/equipmentRoutes");
app.use("/api/equipment", equipmentRoutes);

const borrowRequestRoutes = require("./src/routes/borrowRequestRoutes");
app.use("/api/borrow-request", borrowRequestRoutes);

const sequelize = require("./src/models/index");
require("./src/models/Token");
require("./src/models/User");
require("./src/models/Equipment");
require("./src/models/BorrowRequest");

sequelize.sync({ alter: true }).then(() => {
  console.log("All models synchronized with MySQL database");
});
