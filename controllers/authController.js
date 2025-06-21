const db = require('../models/db');
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });

  const existingUser = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (existingUser)
    return res.status(400).json({ error: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(
    username,
    hashedPassword
  );
  res.json({ message: "User registered successfully" });
};
