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
  username: string;
}

const Albums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [albumPhotos, setAlbumPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
          {} as Record<string, string>,
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
    setIsSubmitting(true);
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
        const newAlbum = response.data;

        // Fetch the username dynamically using the userId (assumed that the user is already authenticated)
        const username =
          albums.find((album) => album.userId === userId)?.username ||
          "Unknown";

        // Immediately fetch the photos for the new album
        axios
          .get(`http://localhost:5000/api/photos/albums/${newAlbum.id}`)
          .then((photosResponse) => {
            const photos: Photo[] = photosResponse.data.map(
              (photo: { imageUrl: string; id: string; title: string }) => ({
                imageUrl: photo.imageUrl,
                id: photo.id,
                title: photo.title,
              }),
            );

            // Update the new album with the fetched photos and dynamic username
            const updatedAlbum = {
              ...newAlbum,
              photos,
              username, // Use the dynamic username fetched above
            };

            setAlbums((prevAlbums) => [updatedAlbum, ...prevAlbums]);

            // Show success toast
            setToastMessage("Album has been successfully added!");
            setTimeout(() => setToastMessage(null), 3000); // Clear toast after 3 seconds

            // Close the modal
            toggleModal();
            setAlbumTitle("");
            setAlbumPhotos([]);
            setPhotoPreviews([]);
          })
          .catch((error) => {
            console.error("Error fetching album photos:", error);
          });
      })
      .catch((error) => {
        console.error("Error creating album:", error);
      })
      .finally(() => {
        setIsSubmitting(false);
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
                  Created by:
                  <a
                    href={`/users/${album.userId}`}
                    className="text-blue-500 hover:underline"
                  >
                    {album.username}
                  </a>
                </p>
                <div className="flex flex-wrap gap-4">
                  {album.photos && album.photos.length > 0 ? (
                    album.photos.map((photo) => (
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
          {toastMessage}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Album</h2>
              <button onClick={toggleModal} className="text-red-500">
                <FaTimes />
              </button>
            </div>
            <input
              type="text"
              placeholder="Album Title"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              multiple
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {photoPreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleAddAlbum}
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-600 text-white rounded-full ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="spinner-border animate-spin w-5 h-5 border-4 border-t-4 border-blue-300 rounded-full"></div>
                ) : (
                  "Add Album"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Albums;
