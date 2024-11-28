import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import Header from "./Header";

interface Album {
  id: string;
  title: string;
  userId: string;
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
    axios
      .get("http://localhost:5000/api/albums")
      .then((response) => {
        setAlbums(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching albums:", error);
        setIsLoading(false);
      });

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
        {/* Header Section */}
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

        {/* Album List */}
        {albums.length === 0 ? (
          <div className="text-center">
            <p className="mt-2">Be the first one to add one!</p>
          </div>
        ) : (
          <div>
            {albums.map((album) => (
              <div key={album.id} className="p-4 border-b border-gray-300">
                <h2 className="font-bold">{album.title}</h2>
                <p>User ID: {album.userId}</p>
                <a
                  href={`/albums/${album.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Album
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Adding an Album */}
        {isModalOpen && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-50 z-10"
              onClick={toggleModal}
            />
            <div className="fixed inset-0 flex justify-center items-center z-20">
              <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <div className="flex justify-end">
                  <button onClick={toggleModal}>
                    <FaTimes size={20} className="text-gray-500" />
                  </button>
                </div>
                <h2 className="text-2xl mb-4">Add a New Album</h2>
                <form>
                  <div className="mb-4">
                    <label htmlFor="albumTitle" className="block text-lg mb-2">
                      Album Title
                    </label>
                    <input
                      type="text"
                      id="albumTitle"
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                      placeholder="Enter album title"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="albumPhotos" className="block text-lg mb-2">
                      Upload Photos (Max 3)
                    </label>
                    <input
                      type="file"
                      id="albumPhotos"
                      multiple
                      onChange={handlePhotoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                    <div className="mt-4 flex space-x-4">
                      {photoPreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAlbum}
                    className="w-full bg-blue-600 text-white py-2 rounded-full"
                  >
                    Add Album
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Albums;
