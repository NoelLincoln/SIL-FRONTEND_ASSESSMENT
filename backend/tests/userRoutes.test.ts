import request from "supertest";
import { server } from "../src/app"; // Import the server instance
import { PrismaClient } from "@prisma/client"; // Assuming you're using Prisma as your ORM
const prisma = new PrismaClient();

describe("User Routes", () => {
  let userId: string;

  // Increase the timeout for beforeAll hook
  beforeAll(async () => {
    // Create a test user with a static ID for testing
    const user = await prisma.user.create({
      data: {
        githubId: "271222547",
        username: "newrone",
        email: "nerpdoqwre1@gmail.com",
        name: "New User Two",
      },
    });

    // Store the dynamically generated userId
    userId = user.id;
    console.log("Created user with ID:", userId); // Log userId for debugging
  }, 10000); // Set the timeout to 10 seconds for the beforeAll hook

  // Close the server and clean up the test data after all tests
  afterAll(async () => {
    await prisma.user.deleteMany(); // Cascade should handle deleting related albums
    server.close(() => {});
  });

  // Test GET /api/users
  it("should fetch all users", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test POST /api/users
  it("should create a new user", async () => {
    const newUser = {
      githubId: "27122548", // Ensure unique githubId
      username: `newuser${Date.now()}`, // Ensure unique username
      email: `newuser${Date.now()}@example.com`, // Ensure unique email
      name: "New User Three",
    };

    const response = await request(server)
      .post("/api/users")
      .send(newUser)
      .set("Accept", "application/json");

    console.log("Response Status: ", response.status); // Log status
    console.log("Response Body: ", response.body); // Log body for debugging

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(newUser.username);
  });

  // Test GET /api/users/:id
  it("should fetch a user by ID", async () => {
    // Ensure the correct userId is being used here
    console.log("Test userId:", userId); // Log the userId used for fetching

    const response = await request(server).get(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId); // Ensure the ID matches the one created in beforeAll
  });

  // Test PUT /api/users/:id
  it("should update a user by ID", async () => {
    const updatedUser = {
      username: "johnupdated",
      email: "johnupdated@example.com",
      name: "John Updated",
    };

    const response = await request(server)
      .patch(`/api/users/${userId}`)
      .send(updatedUser)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(updatedUser.username);
  });

  // Test DELETE /api/users/:id
  it("should delete a user by ID", async () => {
    const response = await request(server)
      .delete(`/api/users/${userId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });
});
