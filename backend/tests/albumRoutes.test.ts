import request from "supertest";
import { server } from "../src/app"; // Import the server instance
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Album Routes", () => {
  let albumId: string;
  let userId: string;

  // Increase the timeout for beforeAll hook if needed
  beforeAll(async () => {
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
  }, 10000); // Set the timeout to 10 seconds for the beforeAll hook

  // Close the server after all tests to avoid "address in use" error
  afterAll(async () => {
    await prisma.album.deleteMany(); // Clean up the albums
    await prisma.user.deleteMany(); // Clean up the users

    server.close();
  });

  // Test GET /api/albums
  it("should fetch all albums", async () => {
    const response = await request(server).get("/api/albums");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test GET /api/albums/:id
  it("should fetch an album by ID", async () => {
    const response = await request(server).get(`/api/albums/${albumId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(albumId);
    expect(response.body.title).toBe("Test Album");
  });

  // Test POST /api/albums (Create a new album)
  it("should create a new album", async () => {
    const newAlbum = {
      title: "New Test Album",
      userId: userId,
    };

    const response = await request(server)
      .post("/api/albums")
      .send(newAlbum)
      .set("Accept", "application/json");

    console.log("Response Status: ", response.status); // Log status for debugging
    console.log("Response Body: ", response.body); // Log body for debugging

    expect(response.status).toBe(201);
    expect(response.body.title).toBe(newAlbum.title);
    expect(response.body.userId).toBe(userId);
  });

  // Test PATCH /api/albums/:id (Update an album)
  it("should update an album by ID", async () => {
    const updatedAlbum = {
      title: "Updated Test Album",
    };

    const response = await request(server)
      .patch(`/api/albums/${albumId}`)
      .send(updatedAlbum)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedAlbum.title);
  });

  // Test DELETE /api/albums/:id (Delete an album)
  it("should delete an album by ID", async () => {
    const response = await request(server)
      .delete(`/api/albums/${albumId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Album deleted successfully");
  });
});
