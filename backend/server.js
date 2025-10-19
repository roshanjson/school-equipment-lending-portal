const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const sequelize = require("./src/models/index");
require("./src/models/User");
require("./src/models/Equipment");
require("./src/models/BorrowRequest");

sequelize.sync({ alter: true }).then(() => {
  console.log("All models synchronized with MySQL database");
});
