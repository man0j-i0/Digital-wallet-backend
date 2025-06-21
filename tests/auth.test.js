const request = require('supertest');
const app = require('../server');

describe("🔐 Auth API", () => {
  const user = {
    username: `testuser_${Date.now()}`,
    password: "1234",
  };

  it("should register a new user", async () => {
    const res = await request(app).post("/api/register").send(user);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should fail for duplicate registration", async () => {
    const res = await request(app).post("/api/register").send(user);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Username already exists");
  });

  it("should fail if username/password is missing", async () => {
    const res = await request(app).post("/api/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
