import supertest from "supertest";
import app from "../server";
import pool from "../config/database";

const request = supertest(app);

describe("User Api Endpoints", () => {
  let userId: number;
  let authToken: string;

  beforeAll(async () => {
    await pool.query("DELETE FROM users;");
  });

  it("should create a new user", async () => {
    const res = await request.post("/api/users").send({
      firstName: "Alice",
      lastName: "Smith",
      password: "hashed_password_123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body.firstName).toBe("Alice");
    userId = res.body.id;

    authToken = res.body.token;
    expect(authToken).toBeDefined();
  });

  it("should get a user by ID", async () => {
    const res = await request
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it("should update a user", async () => {
    const res = await request
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        firstName: "Updated",
        lastName: "Name",
        password: "new_password",
      });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe("Updated");
  });

  it("should delete a user", async () => {
    const res = await request
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted");
  });

  it("should  return 404 for non-existing user", async () => {
    const res = await request
      .get("/api/users/099999")
      .set("Authorization", `Bearer ${authToken}`);
    
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return Missing required fields: firstName, lastName, password", async () => {
    const res = await request.post("/api/users/").send({
      firstName: "Updated",
      password: "new_password",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Missing required fields: firstName, lastName, password",
    );
  });

  it("should return password must be atlest of length 6", async () => {
    const res = await request.post("/api/users/").send({
      firstName: "Alice",
      lastName: "Smith",
      password: "1234",
    })

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Password must be at least 6 characters long");
  })
});
