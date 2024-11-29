import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import Header from "./Header";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
}

interface Album {
  id: string;
  title: string;
  userId: string;
  photos: Photo[];
  username?: string; // Optional username field
}

const Albums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [albumPhotos, setAlbumPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchAlbumsAndUsers = async () => {
      try {
        const [albumResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/albums"),
          axios.get("http://localhost:5000/api/users"),
        ]);

        const albumData: Album[] = albumResponse.data;
        const userData = userResponse.data; // Assuming it returns an array of users

        // Create a mapping of userId to username
        const userMap = userData.reduce(
          (
            acc: Record<string, string>,
            user: { id: string; username: string },
          ) => {
            acc[user.id] = user.username;
            return acc;
          },
          {},
        );

        // Fetch photos and add username to each album
        const updatedAlbums = await Promise.all(
          albumData.map(async (album) => {
            const photosResponse = await axios.get(
              `http://localhost:5000/api/photos/albums/${album.id}`,
            );
            const photos: Photo[] = photosResponse.data.map(
              (photo: { imageUrl: string; id: string; title: string }) => ({
                imageUrl: photo.imageUrl,
                id: photo.id,
                title: photo.title,
              }),
            );

            return {
              ...album,
              photos,
              username: userMap[album.userId] || "Unknown",
            };
          }),
        );

        setAlbums(updatedAlbums);
      } catch (error) {
        console.error("Error fetching albums or users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumsAndUsers();

    // Fetch current user details
    axios
      .get("http://localhost:5000/api/auth/me", { withCredentials: true })
      .then((response) => {
        setUserId(response.data.id);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + albumPhotos.length > 3) {
      alert("You can only upload a maximum of 3 photos.");
      return;
    }
    setAlbumPhotos((prevPhotos) => [...prevPhotos, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const handleAddAlbum = () => {
    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("userId", userId);
    albumPhotos.forEach((photo) => {
      formData.append("photos", photo);
    });

    axios
      .post("http://localhost:5000/api/albums", formData, {
        withCredentials: true,
      })
      .then((response) => {
        setAlbums([...albums, response.data]);
        toggleModal();
        setAlbumTitle("");
        setAlbumPhotos([]);
        setPhotoPreviews([]);
      })
      .catch((error) => {
        console.error("Error creating album:", error);
      });
  };

  if (isLoading) {
    return <div>Loading albums...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            {albums.length === 0 ? "No Albums yet 😞" : "All Albums"}
          </h1>
          <button
            onClick={toggleModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-full"
          >
            Add Album
          </button>
        </div>

        {albums.length === 0 ? (
          <div className="text-center">
            <p className="mt-2">Be the first one to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album.id}
                className="p-4 border border-gray-300 rounded-lg shadow-sm"
              >
                <h2 className="font-bold text-lg mb-2">{album.title}</h2>
                <p className="mb-2 text-sm">
                  Created by:{" "}
                  <a
                    href={`/users/${album.userId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {album.username}
                  </a>
                </p>
                <div className="flex flex-wrap gap-4">
                  {album.photos && album.photos.length > 0 ? (
                    album.photos.map((photo, index) => (
                      <img
                        key={photo.id}
                        src={photo.imageUrl}
                        alt={`Album ${album.title} - ${photo.title}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No photos available</p>
                  )}
                </div>
                <a
                  href={`/albums/${album.id}`}
                  className="text-blue-500 hover:underline mt-4 block"
                >
                  View Album
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Albums;
