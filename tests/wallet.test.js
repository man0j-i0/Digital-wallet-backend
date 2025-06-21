const request = require('supertest');
const app = require('../server');

describe("💰 Wallet Operations", () => {
  const credentials = Buffer.from("sender:1234").toString("base64");

  it("should fund wallet", async () => {
    const res = await request(app)
      .post("/api/fund")
      .set("Authorization", `Basic ${credentials}`)
      .send({ amount: 1000 });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("balance");
  });

  it("should send money", async () => {
    const res = await request(app)
      .post("/api/pay")
      .set("Authorization", `Basic ${credentials}`)
      .send({ to: "receiver", amount: 200 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Payment successful");
    expect(res.body).toHaveProperty("balance");
  });

  it("should show transaction in statement", async () => {
    const res = await request(app)
      .get("/api/stmt")
      .set("Authorization", `Basic ${credentials}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const payTx = res.body.find(tx => tx.type === "pay");
    expect(payTx).toBeDefined();
    expect(payTx).toHaveProperty("from", "sender");
    expect(payTx).toHaveProperty("to", "receiver");
  });
});
