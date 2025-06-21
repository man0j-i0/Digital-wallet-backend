const basicAuth = require('basic-auth');
const db = require('../models/db');
const bcrypt = require('bcrypt');

function authMiddleware(req, res, next) {
  const user = basicAuth(req);
  console.log("🔐 Incoming credentials:", user);

  if (!user || !user.name || !user.pass) {
    console.log("🚫 Missing credentials");
    return res.status(401).json({ error: 'Authentication required' });
  }

  const dbUser = db.prepare('SELECT * FROM users WHERE username = ?').get(user.name);
  console.log("👤 DB user fetched:", dbUser);

  if (!dbUser) {
    console.log("🚫 User not found in DB");
    return res.status(401).json({ error: 'Invalid credentials (no user)' });
  }

  // Check password
  bcrypt.compare(user.pass, dbUser.password, (err, result) => {
    if (err) {
      console.log("❌ bcrypt error:", err);
      return res.status(500).json({ error: 'Internal error' });
    }

    console.log("🔍 bcrypt result:", result);
    if (!result) {
      console.log("🚫 Password mismatch");
      return res.status(401).json({ error: 'Invalid credentials (wrong password)' });
    }

    console.log("✅ Auth success");
    req.user = dbUser;
    next();
  });
}

module.exports = authMiddleware;
