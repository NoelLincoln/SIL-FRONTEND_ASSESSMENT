import request from "supertest";
import { server } from "../src/app"; // Import the server instance
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Album Routes", () => {
  let albumId: string;
  let userId: string;

  // Increase the timeout for beforeAll hook if needed
  beforeAll(async () => {
    // Ensure a clean database state
    await prisma.album.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        username: "testuser",
        email: "testuser@example.com",
        githubId: "testgithubid",
      },
    });

    userId = user.id;

    // Create a test album for that user
    const album = await prisma.album.create({
      data: {
        title: "Test Album",
        userId: user.id,
      },
    });

    albumId = album.id;
  }, 20000); // Set the timeout to 20 seconds for the beforeAll hook

  // Close the server and clean up data after all tests
  afterAll(async () => {
    await prisma.album.deleteMany(); // Clean up albums
    await prisma.user.deleteMany(); // Clean up users
    await prisma.$disconnect(); // Disconnect Prisma client
    server.close(); // Close server to avoid "address in use" errors
  });

  // Test GET /api/albums
  it("should fetch all albums", async () => {
    const response = await request(server).get("/api/albums");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test GET /api/albums/:id
  it("should fetch an album by ID", async () => {
    const response = await request(server).get(`/api/albums/${albumId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", albumId);
    expect(response.body).toHaveProperty("title", "Test Album");
  });

  // Test POST /api/albums
  it("should create a new album", async () => {
    const newAlbum = { title: "New Test Album", userId };

    const response = await request(server)
      .post("/api/albums")
      .send(newAlbum);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "New Test Album");
    expect(response.body).toHaveProperty("userId", userId);
  });

  // Test PUT /api/albums/:id
  it("should update an album by ID", async () => {
    const updatedData = { title: "Updated Test Album" };

    const response = await request(server)
      .put(`/api/albums/${albumId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", albumId);
    expect(response.body).toHaveProperty("title", "Updated Test Album");
  });

  // Test DELETE /api/albums/:id
  it("should delete an album by ID", async () => {
    const response = await request(server).delete(`/api/albums/${albumId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Album deleted successfully");
  });
});
