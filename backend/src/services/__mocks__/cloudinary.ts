export const v2 = {
  config: jest.fn(),
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: "https://mocked-cloudinary-url.com/mock.jpg",
    }),
  },
};
