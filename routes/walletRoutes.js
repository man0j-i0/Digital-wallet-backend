const express = require('express');
const auth = require('../utils/authMiddleware');
const { fundWallet, sendMoney, getStatement } = require('../controllers/walletController');
const router = express.Router();
const axios = require('axios');

router.post('/fund', auth, fundWallet);
router.post('/pay', auth, sendMoney);
router.get('/stmt', auth, getStatement);
router.get('/balance', auth, async (req, res) => {
  const user = req.user;
  const { currency } = req.query;

  if (!currency) {
    return res.json({ balance: user.balance, currency: "INR" });
  }

  try {
    const apiKey = process.env.CURRENCY_API_KEY;
    const response = await axios.get(`https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=${currency.toUpperCase()}&base_currency=INR`);

    const rate = response.data.data[currency.toUpperCase()]?.value;

    if (!rate) {
      return res.status(400).json({ error: "Invalid currency" });
    }

    const converted = user.balance * rate;
    res.json({ balance: Number(converted.toFixed(2)), currency: currency.toUpperCase() });

  } catch (err) {
    console.error("Currency API error:", err.message);
    res.status(500).json({ error: "Currency conversion failed" });
  }
});

module.exports = router;
