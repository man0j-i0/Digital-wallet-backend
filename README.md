# 💸 Digital Wallet Backend

A secure and modular **digital wallet backend** built with **Node.js**, **Express**, and **SQLite**. It supports user registration, wallet operations (fund/pay), transaction history, real-time currency conversion, and product catalog functionality.

---

## 🚀 Features

- ✅ User registration with bcrypt password hashing
- ✅ Basic Authentication (username:password)
- 💰 Fund wallet and peer-to-peer transfers
- 📄 View transaction history (statement)
- 🌍 Currency conversion using [CurrencyAPI](https://currencyapi.com)
- 🛍️ Product catalog: Add, view, buy
- 🧪 Test coverage with Jest & Supertest

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** SQLite (better-sqlite3)
- **Auth:** HTTP Basic Auth via `basic-auth`
- **Security:** Password hashing using `bcrypt`
- **Currency API:** `axios` integration
- **Environment Config:** `dotenv`
- **Testing:** `jest`, `supertest`

---

## 🛠️ Installation

```bash
# Clone the repo
git clone https://github.com/man0j-i0/Digital-wallet-backend.git
cd Digital-wallet-backend

# Install dependencies
npm install

# Run the server
node server.js
```

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
CURRENCY_API_KEY=your_currency_api_key_here
PORT=3000
```

✅ Do **not** push `.env` to GitHub. Add it to `.gitignore`.

---

## 📡 API Endpoints & Sample cURL Commands

### 🔐 Register User

```http
POST /api/register
```

```json
{
  "username": "manoj",
  "password": "1234"
}
```

```bash
curl -X POST http://localhost:3000/api/register   -H "Content-Type: application/json"   -d '{"username":"manoj","password":"1234"}'
```

---

### 💰 Fund Wallet

```http
POST /api/fund
```

```bash
curl -X POST http://localhost:3000/api/fund   -u manoj:1234   -H "Content-Type: application/json"   -d '{"amount": 1000}'
```

---

### 💸 Pay Another User

```http
POST /api/pay
```

```bash
curl -X POST http://localhost:3000/api/pay   -u manoj:1234   -H "Content-Type: application/json"   -d '{"to": "hitesh", "amount": 500}'
```

---

### 💱 Get Balance (With Optional Currency)

```http
GET /api/balance?currency=USD
```

```bash
curl -X GET "http://localhost:3000/api/balance?currency=USD" -u manoj:1234
```

---

### 📄 Get Statement

```http
GET /api/stmt
```

```bash
curl -X GET http://localhost:3000/api/stmt -u manoj:1234
```

---

### 🛍️ Add Product

```http
POST /api/product
```

```bash
curl -X POST http://localhost:3000/api/product   -u manoj:1234   -H "Content-Type: application/json"   -d '{"name":"Mouse", "price":499, "description":"Wireless Mouse"}'
```

---

### 📦 List All Products

```http
GET /api/product
```

```bash
curl http://localhost:3000/api/product
```

---

### 🛒 Buy Product

```http
POST /api/buy
```

```bash
curl -X POST http://localhost:3000/api/buy   -u manoj:1234   -H "Content-Type: application/json"   -d '{"product_id": 1}'
```

---

## 🧪 Run Tests

```bash
npm test
```

Use `--detectOpenHandles` if Jest hangs:

```bash
npm test -- --detectOpenHandles
```

---

## 📁 Project Structure

```
📦 Digital-wallet-backend
 ┣ 📂controllers
 ┣ 📂routes
 ┣ 📂models
 ┣ 📂utils
 ┣ 📂tests
 ┣ .env.example
 ┣ .gitignore
 ┣ server.js
 ┗ README.md
```

---

## 🤝 Contribution

Feel free to fork the project and create a pull request. Suggestions and improvements are welcome!

---

## 👤 Author

**Manoj Das**  
📧 dasmj4321@gmail.com  
🔗 [GitHub](https://github.com/man0j-i0)

---

> ⚠️ This project is for educational/demo purposes. Please don’t use in production without proper security audit and enhancements.