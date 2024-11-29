import request from 'supertest';
import { app } from '../src/app'; // Ensure this path is correct
import * as photoService from '../src/services/photoService'; // Ensure this path is correct

jest.mock('../src/services/photoService'); // Update path if necessary

let server: any;

beforeAll(() => {
  server = app.listen(5000, () => {
    console.info('Test server is running on port 5000');
  });
});

afterAll((done) => {
  if (server) {
    server.close(done);
  }
});

describe('Photo Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /photos/album/:albumId', () => {
    it('should return a list of photos for a given album ID', async () => {
      const albumId = '1';
      const mockPhotos = [{ id: '1', title: 'Test Photo', imageUrl: 'test.jpg' }];
      (photoService.getPhotosByAlbumId as jest.Mock).mockResolvedValue(mockPhotos);

      const response = await request(server).get(`/api/photos/album/${albumId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPhotos);
      expect(photoService.getPhotosByAlbumId).toHaveBeenCalledWith(albumId);
    });

    it('should return 500 if an error occurs while fetching photos', async () => {
      const albumId = '1';
      (photoService.getPhotosByAlbumId as jest.Mock).mockRejectedValue(new Error('Error'));

      const response = await request(server).get(`/api/photos/album/${albumId}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch photos');
    });
  });

  describe('GET /photos/:id', () => {
    it('should return a single photo by ID', async () => {
      const photoId = '1';
      const mockPhoto = { id: '1', title: 'Test Photo', imageUrl: 'test.jpg' };
      (photoService.getPhotoById as jest.Mock).mockResolvedValue(mockPhoto);

      const response = await request(server).get(`/api/photos/${photoId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPhoto);
    });

    it('should return 404 if the photo is not found', async () => {
      const photoId = '1';
      (photoService.getPhotoById as jest.Mock).mockResolvedValue(null);

      const response = await request(server).get(`/api/photos/${photoId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Photo not found');
    });

    it('should return 500 if an error occurs while fetching the photo', async () => {
      const photoId = '1';
      (photoService.getPhotoById as jest.Mock).mockRejectedValue(new Error('Error'));

      const response = await request(server).get(`/api/photos/${photoId}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch photo');
    });
  });

  describe('PUT /photos/:id', () => {
    it('should update a photo title', async () => {
      const photoId = '1';
      const updatedTitle = 'Updated Photo Title';
      const mockUpdatedPhoto = { id: '1', title: updatedTitle, imageUrl: 'test.jpg' };
      (photoService.updatePhotoTitle as jest.Mock).mockResolvedValue(mockUpdatedPhoto);

      const response = await request(server)
        .put(`/api/photos/${photoId}`)
        .send({ title: updatedTitle });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedTitle);
    });

    it('should return 404 if the photo is not found', async () => {
      const photoId = '1';
      const updatedTitle = 'Updated Photo Title';
      (photoService.updatePhotoTitle as jest.Mock).mockResolvedValue(null);

      const response = await request(server)
        .put(`/api/photos/${photoId}`)
        .send({ title: updatedTitle });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Photo not found');
    });

    it('should return 500 if an error occurs while updating the photo', async () => {
      const photoId = '1';
      const updatedTitle = 'Updated Photo Title';
      (photoService.updatePhotoTitle as jest.Mock).mockRejectedValue(new Error('Error'));

      const response = await request(server)
        .put(`/api/photos/${photoId}`)
        .send({ title: updatedTitle });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to update photo title');
    });
  });

  describe('DELETE /photos/:id', () => {
    it('should delete a photo by ID', async () => {
      const photoId = '1';
      (photoService.deletePhoto as jest.Mock).mockResolvedValue(true);

      const response = await request(server).delete(`/api/photos/${photoId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Photo deleted successfully');
    });

    it('should return 404 if the photo is not found', async () => {
      const photoId = '1';
      (photoService.deletePhoto as jest.Mock).mockResolvedValue(null);

      const response = await request(server).delete(`/api/photos/${photoId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Photo not found');
    });

    it('should return 500 if an error occurs while deleting the photo', async () => {
      const photoId = '1';
      (photoService.deletePhoto as jest.Mock).mockRejectedValue(new Error('Error'));

      const response = await request(server).delete(`/api/photos/${photoId}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to delete photo');
    });
  });
});
