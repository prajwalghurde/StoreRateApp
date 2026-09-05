const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/storeOwner", require("./routes/storeOwner.routes"));

// Database connection verification
db.authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
    // Sync database after successful connection
    return db.sync();
  })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = app;
