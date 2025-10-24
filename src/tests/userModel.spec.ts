import { User } from "../models/User";
import pool from "../config/database";

const userModel = new User(pool);

describe("User Model", () => {
  let testUserId: number;

  beforeAll(async () => {
    // Clean up users table before tests
    await pool.query("DELETE FROM users WHERE \"firstName\" = 'ModelTest'");
  });

  afterAll(async () => {
    // Clean up after tests
    await pool.query("DELETE FROM users WHERE \"firstName\" = 'ModelTest'");
  });

  describe("create method", () => {
    it("should create a new user with hashed password", async () => {
      const user = await userModel.create({
        firstName: "ModelTest",
        lastName: "User",
        password: "testpassword123",
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.firstName).toBe("ModelTest");
      expect(user.lastName).toBe("User");
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe("testpassword123"); // Password should be hashed

      testUserId = user.id!;
    });
  });

  describe("getAll method", () => {
    it("should return array of users", async () => {
      const users = await userModel.getAll();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe("getById method", () => {
    it("should return a user by ID", async () => {
      const user = await userModel.getById(testUserId);

      expect(user).toBeDefined();
      expect(user?.id).toBe(testUserId);
      expect(user?.firstName).toBe("ModelTest");
    });

    it("should return null for non-existent user", async () => {
      const user = await userModel.getById(999999);

      expect(user).toBeNull();
    });
  });

  describe("update method", () => {
    it("should update a user", async () => {
      const updatedUser = await userModel.update(testUserId, {
        firstName: "ModelTest",
        lastName: "UpdatedUser",
        password: "newpassword123",
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.id).toBe(testUserId);
      expect(updatedUser?.lastName).toBe("UpdatedUser");
      expect(updatedUser?.password).not.toBe("newpassword123"); // Password should be hashed
    });

    it("should return null for non-existent user", async () => {
      const user = await userModel.update(999999, {
        firstName: "Test",
        lastName: "User",
        password: "password",
      });

      expect(user).toBeNull();
    });
  });

  describe("authenticate method", () => {
    it("should authenticate a user with correct credentials", async () => {
      const user = await userModel.authenticate("ModelTest", "newpassword123");

      expect(user).toBeDefined();
      expect(user?.firstName).toBe("ModelTest");
    });

    it("should return null for incorrect password", async () => {
      const user = await userModel.authenticate("ModelTest", "wrongpassword");

      expect(user).toBeNull();
    });

    it("should return null for non-existent user", async () => {
      const user = await userModel.authenticate("NonExistent", "password");

      expect(user).toBeNull();
    });
  });

  describe("delete method", () => {
    it("should delete a user", async () => {
      const result = await userModel.delete(testUserId);

      expect(result).toBe(true);

      // Verify user is deleted
      const user = await userModel.getById(testUserId);
      expect(user).toBeNull();
    });

    it("should return false for non-existent user", async () => {
      const result = await userModel.delete(999999);

      expect(result).toBe(false);
    });
  });
});
