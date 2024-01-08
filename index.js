// index.js
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Auth Service");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// Database synchronization
sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
    // Start the server after the database is synced
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
