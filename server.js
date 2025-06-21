const express = require("express");
const bcrypt = require("bcrypt");
const basicAuth = require("basic-auth");
const db = require('./models/db');
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", walletRoutes);
app.use("/api", productRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
