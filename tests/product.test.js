const request = require('supertest');
const app = require('../server');

describe("🛒 Product API", () => {
  const credentials = Buffer.from("buyer:buy123").toString("base64");

  it("should add a product", async () => {
    const res = await request(app)
      .post("/api/product")
      .set("Authorization", `Basic ${credentials}`)
      .send({
        name: "Wireless Mouse",
        price: 599,
        description: "2.4 GHz wireless mouse with USB receiver",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.message).toBe("Product added");
  });

  it("should list products", async () => {
    const res = await request(app).get("/api/product");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
