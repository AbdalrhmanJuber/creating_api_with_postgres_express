import { client, connectDB } from "./database";

describe("PostgreSQL Database Connection", () => {
  it("should connect successfully", async () => {

    await expectAsync(connectDB()).toBeResolved();
    await client.end(); // Close connection after test
  });
});
