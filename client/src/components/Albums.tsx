import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { fetchAlbums, createAlbum } from "../redux/reducers/albumSlice";

// Define types for album and photo
interface Photo {
  id: string;
  title: string;
  imageUrl: string;
}

interface Album {
  id: string;
  title: string;
  userId: string;
  username: string;
  photos: Photo[]; // Ensure photos is an array of type Photo[]
}

const Albums: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { albums, loading, error } = useSelector((state: RootState) => state.albums);
  const { email, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [albumPhotos, setAlbumPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAlbums());
  }, [dispatch]);

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

    if (!isAuthenticated || !email) {
      alert("User not found. Please login.");
      setIsSubmitting(false);
      return;
    }

    const albumData = {
      title: albumTitle,
      userId: email,
      files: albumPhotos,
    };

    dispatch(createAlbum(albumData))
      .unwrap()
      .then(() => {
        setToastMessage("Album has been successfully added!");
        setTimeout(() => setToastMessage(null), 3000);
        toggleModal();
        setAlbumTitle("");
        setAlbumPhotos([]);
        setPhotoPreviews([]);
      })
      .catch((err: Error) => {
        console.error("Error creating album:", err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return <div>Loading albums...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
          <p>No albums available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="border p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold mb-4">{album.title}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Check if album.photos is an array before slicing */}
                  {Array.isArray(album.photos) && album.photos.slice(0, 3).map((photo: Photo) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-40 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Create a New Album</h3>
                <button onClick={toggleModal}>
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="Enter album title"
                className="w-full mt-4 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-4"
              />
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={() => {
                          const updatedPreviews = photoPreviews.filter(
                            (_, i) => i !== index,
                          );
                          setPhotoPreviews(updatedPreviews);
                          const updatedPhotos = albumPhotos.filter(
                            (_, i) => i !== index,
                          );
                          setAlbumPhotos(updatedPhotos);
                        }}
                        className="absolute top-0 right-0 p-2 text-white bg-black bg-opacity-50 rounded-full"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handleAddAlbum}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={toggleModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-md">
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default Albums;
