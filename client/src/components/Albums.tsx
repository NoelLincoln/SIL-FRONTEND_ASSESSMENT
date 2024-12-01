import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createAlbum } from "../redux/slices/albumSlice";
import { AppDispatch } from "../redux/store
import { useDispatch } from "react-redux";

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

interface AlbumsProps {
  albums: Album[];
  loading: boolean;
  error: string | null;
}

const Albums: React.FC<AlbumsProps> = ({ albums, loading, error }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumPhotos, setAlbumPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const handleAddAlbum = async () => {
    if (!albumTitle) {
      alert("Please provide an album title.");
      return;
    }

    setIsSubmitting(true);

    const albumData = { title: albumTitle, userId: "user-id-placeholder", files: albumPhotos };

    try {
      await dispatch(createAlbum(albumData)).unwrap();
      setToastMessage("Album has been successfully added!");
      setTimeout(() => setToastMessage(null), 3000);

      // Close the modal and reset fields after successful album creation
      toggleModal();
      setAlbumTitle("");
      setAlbumPhotos([]);
      setPhotoPreviews([]);
    } catch (error: any) {
      console.error("Error creating album:", error);
      alert("Failed to create album. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm">
          <img
            src="/images/server-error-image.png"
            alt="Error"
            className="mx-auto mb-4 w-24"
          />
          <h2 className="text-2xl font-semibold text-red-500">Oops!</h2>
          <p className="text-gray-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={toggleModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Add Album
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="w-8 h-8 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center mt-6">
            <p className="mt-2">Be the first one to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {albums.slice().reverse().map((album: Album) => (
  <div
    key={album.id}
    className="p-4 border border-gray-300 rounded-lg shadow-sm transition hover:shadow-lg"
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
      {album.photos.length > 0 ? (
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

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
          {toastMessage}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Album</h2>
              <button
                onClick={toggleModal}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
            <input
              type="text"
              placeholder="Album Title"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="file"
              multiple
              onChange={handlePhotoChange}
              className="w-full mb-4"
            />
            {photoPreviews.length > 0 && (
              <div className="flex gap-4 mb-4">
                {photoPreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <button
              onClick={handleAddAlbum}
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Create Album"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Albums;
