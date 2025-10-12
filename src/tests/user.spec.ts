import supertest from "supertest";
import app from "../server";
import pool from "../conifg/database";

const request = supertest(app);

describe("User Api Endpoints", () => {
  let userId: number;

  beforeAll(async () => {
    await pool.query("DELETE FROM users;");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("should create a new user", async () => {
    const res = await request.post("/api/users").send({
      firstName: "Alice",
      lastName: "Smith",
      password_hash: "hashed_password_123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.firstName).toBe("Alice");
    userId = res.body.id;
  });

  it("should get a user by ID", async () => {
    const res = await request.get(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it("should update a user", async () => {
    const res = await request.put(`/api/users/${userId}`).send({
      firstName: "Updated",
      lastName: "Name",
      password_hash: "new_password",
    });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe("Updated");
  });

  it("should delete a user", async () => {
    const res = await request.delete(`/api/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted");
  });

  it("should  return 404 for non-existing user", async () => {
    const res = await request.get("/api/users/099999");
    expect(res.status).toBe(404);
    expect(res.body.messagee).toBe("User not found");
  });
});
