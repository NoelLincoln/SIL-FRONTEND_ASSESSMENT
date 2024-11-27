import request from "supertest";
import express, { Application } from "express";
import * as photoController from "../src/controllers/photoController";
import * as cloudinaryService from "../src/services/cloudinaryService";

const app: Application = express();
app.use(express.json());
app.post("/upload", photoController.uploadPhoto);
app.get("/colors/:publicId", photoController.getImageColors);
app.post("/create-tag", photoController.createImageTag);

jest.mock("../src/services/cloudinaryService");

describe("Photo Controller", () => {
  describe("uploadPhoto", () => {
    it("should upload a photo and return the public ID", async () => {
      const mockPublicId = "samplePublicId";
      (cloudinaryService.uploadImage as jest.Mock).mockResolvedValue(
        mockPublicId,
      );

      const response = await request(app)
        .post("/upload")
        .send({
          albumId: "sampleAlbumId",
          title: "Sample Title",
          imagePath: "mock-image.jpg",
        });

      console.log("Request Body:", {
        albumId: "sampleAlbumId",
        title: "Sample Title",
        imagePath: "mock-image.jpg",
      });
      console.log("Response:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Photo uploaded and saved successfully",
        publicId: mockPublicId,
      });
    });

    it("should return an error if imagePath, albumId, or title is not provided", async () => {
      const response = await request(app).post("/upload").send({});

      console.log("Request Body:", {});
      console.log("Response:", response.body);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Image path, album ID, and title are required",
      });
    });
  });

  describe("getImageColors", () => {
    it("should return colors for the given public ID", async () => {
      const mockColors = ["#FFFFFF", "#000000"];
      (cloudinaryService.getAssetInfo as jest.Mock).mockResolvedValue(
        mockColors,
      );

      const response = await request(app).get("/colors/samplePublicId");

      console.log("Request Params:", { publicId: "samplePublicId" });
      console.log("Response:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ colors: mockColors });
    });

    it("should return an error if publicId is not provided", async () => {
      const response = await request(app).get("/colors/");

      console.log("Request Params:", {});
      console.log("Response:", response.body);

      expect(response.status).toBe(404); // 404 because the route requires a parameter
    });
  });

  describe("createImageTag", () => {
    it("should create an image tag with transformations", async () => {
      const mockImageTag = '<img src="sampleUrl" />';
      (cloudinaryService.createImageTag as jest.Mock).mockReturnValue(
        mockImageTag,
      );

      const response = await request(app)
        .post("/create-tag")
        .send({
          publicId: "samplePublicId",
          effectColor: "red",
          backgroundColor: "blue",
        });

      console.log("Request Body:", {
        publicId: "samplePublicId",
        effectColor: "red",
        backgroundColor: "blue",
      });
      console.log("Response:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ imageTag: mockImageTag });
    });

    it("should return an error if required fields are not provided", async () => {
      const response = await request(app).post("/create-tag").send({});

      console.log("Request Body:", {});
      console.log("Response:", response.body);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Public ID, effect color, and background color are required",
      });
    });
  });
});
