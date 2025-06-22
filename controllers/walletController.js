const db = require('../models/db');

exports.fundWallet = (req, res) => {
  const user = req.user;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const updateBalance = db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?');
  const insertTx = db.prepare(`
    INSERT INTO transactions (sender_id, receiver_id, amount, type)
    VALUES (?, ?, ?, 'fund')
  `);

  const transaction = db.transaction(() => {
    updateBalance.run(amount, user.id);
    insertTx.run(null, user.id, amount); 
  });

  transaction();

  const updated = db.prepare('SELECT balance FROM users WHERE id = ?').get(user.id);

  res.json({ message: 'Wallet funded successfully', balance: updated.balance });
};

exports.sendMoney = (req, res) => {
  const sender = req.user;
  const { to, amount } = req.body;

  if (!to || !amount || amount <= 0)
    return res.status(400).json({ error: 'Recipient and valid amount required' });

  if (to === sender.username)
    return res.status(400).json({ error: 'Cannot pay yourself' });

  const db = require('../models/db');

  // Fetching Details Of Recipient
  const receiver = db.prepare('SELECT * FROM users WHERE username = ?').get(to);
  if (!receiver)
    return res.status(404).json({ error: 'Recipient not found' });

  // Checking Balance
  if (sender.balance < amount)
    return res.status(400).json({ error: 'Insufficient balance' });

  // Begin transaction
  const updateSender = db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?');
  const updateReceiver = db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?');
  const insertTx = db.prepare(`
    INSERT INTO transactions (sender_id, receiver_id, amount, type)
    VALUES (?, ?, ?, 'pay')
  `);

  const transaction = db.transaction(() => {
    updateSender.run(amount, sender.id);
    updateReceiver.run(amount, receiver.id);
    insertTx.run(sender.id, receiver.id, amount);
  });

  transaction();

  const updatedSender = db.prepare('SELECT balance FROM users WHERE id = ?').get(sender.id);

  res.json({ message: 'Payment successful', balance: updatedSender.balance });
};

exports.getStatement = (req, res) => {
  const db = require('../models/db');
  const user = req.user;

  const stmt = db.prepare(`
    SELECT 
      t.type,
      t.amount,
      s.username AS sender,
      r.username AS receiver,
      t.timestamp
    FROM transactions t
    LEFT JOIN users s ON t.sender_id = s.id
    LEFT JOIN users r ON t.receiver_id = r.id
    WHERE t.sender_id = ? OR t.receiver_id = ?
    ORDER BY t.timestamp DESC
  `);

  const transactions = stmt.all(user.id, user.id).map(tx => ({
    type: tx.type,
    amount: tx.amount,
    from: tx.sender || "system",
    to: tx.receiver,
    timestamp: tx.timestamp
  }));

  res.json(transactions);
};
