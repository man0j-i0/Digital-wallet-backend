const db = require('../models/db');

exports.addProduct = (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || price <= 0) {
    return res.status(400).json({ error: "Product name and valid price are required" });
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO products (name, price, description) VALUES (?, ?, ?)"
    );
    const result = stmt.run(name, price, description || '');

    return res.status(201).json({
      id: result.lastInsertRowid,
      message: "Product added"
    });

  } catch (err) {
    console.error("Product insert error:", err.message);
    return res.status(500).json({ error: "Could not add product" });
  }
};

exports.getProducts = (req,res) =>{
    try{
        const products = db.prepare('SELECT * FROM products').all();
        res.json(products);
    }catch(err){
        console.error("Failed to fetch products:", err.message);
        res.status(500).json({ error: "Failed to load products" });
    }
};
exports.buyProduct = (req, res) => {
  const user = req.user;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(product_id);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  if (user.balance < product.price) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  try {
    const updateBalance = db.prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
    const insertTx = db.prepare(`
      INSERT INTO transactions (sender_id, receiver_id, amount, type)
      VALUES (?, NULL, ?, 'buy')
    `);

    const txn = db.transaction(() => {
      updateBalance.run(product.price, user.id);
      insertTx.run(user.id, product.price);
    });

    txn();

    const updated = db.prepare("SELECT balance FROM users WHERE id = ?").get(user.id);

    res.json({
      message: "Product purchased",
      balance: updated.balance
    });
  } catch (err) {
    console.error("Buy failed:", err.message);
    res.status(500).json({ error: "Could not complete purchase" });
  }
};
