import request from "supertest";
import { server } from "../src/app"; // Import the server instance
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Album Routes", () => {
  let albumId: string;
  let userId: string;

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
  }, 20000);

  afterAll(async () => {
    await prisma.album.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    server.close();
  });

  it("should fetch all albums", async () => {
    const response = await request(server).get("/api/albums");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should fetch an album by ID", async () => {
    const response = await request(server).get(`/api/albums/${albumId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", albumId);
    expect(response.body).toHaveProperty("title", "Test Album");
  });

  it("should create a new album", async () => {
    const newAlbum = { title: "New Test Album", userId };
    const response = await request(server).post("/api/albums").send(newAlbum);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "New Test Album");
    expect(response.body).toHaveProperty("userId", userId);
  });

  it("should update an album by ID", async () => {
    const updatedData = { title: "Updated Test Album" };
    const response = await request(server)
      .put(`/api/albums/${albumId}`)
      .send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", albumId);
    expect(response.body).toHaveProperty("title", "Updated Test Album");
  });

  it("should delete an album by ID", async () => {
    const response = await request(server).delete(`/api/albums/${albumId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Album deleted successfully");
  });
});
