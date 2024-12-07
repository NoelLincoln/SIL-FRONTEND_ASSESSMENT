import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import { fetchAlbums, addPhotosToAlbum } from "../redux/slices/albumSlice";
import { deletePhoto } from "../redux/slices/photoSlice";
import { AppDispatch } from "../redux/store";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";

const AlbumDetails: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { albums, loading, error } = useSelector((state: any) => state.albums);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "delete">("add"); // Track modal type
  const [photoIdToDelete, setPhotoIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (albumId) {
      dispatch(fetchAlbums());
    }
  }, [dispatch, albumId]);

  const album = albums.find((album: any) => album.id === albumId);

  const openAddPhotosModal = () => {
    setModalType("add");
    setIsModalOpen(true);
  };

  const openDeleteModal = (photoId: string) => {
    setPhotoIdToDelete(photoId);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleAddPhotos = async (photos: File[], albumId: string) => {
    try {
      await dispatch(addPhotosToAlbum({ albumId, photos }));
      toast.success("Photos added successfully!");
      dispatch(fetchAlbums());
    } catch (error) {
      toast.error("Failed to add photos. Please try again.");
    } finally {
      closeModal();
    }
  };

  const handleDeletePhoto = async () => {
    if (photoIdToDelete) {
      try {
        await dispatch(deletePhoto(photoIdToDelete));
        toast.success("Photo deleted successfully!");
        dispatch(fetchAlbums());
      } catch (error) {
        toast.error("Failed to delete photo. Please try again.");
      } finally {
        closeModal();
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-red-500">Oops!</h2>
          <p className="text-gray-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-gray-700">Album not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Album Details</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Album: <span className="text-blue-600">{album.title}</span>
          </h2>
          <button
            onClick={openAddPhotosModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Add Photos to Album
          </button>
        </div>

        <p className="text-lg text-gray-600 mb-4">
          Created by:{" "}
          <Link to={`/users/${album.userId}`} className="text-blue-600 hover:underline">
            {album.username}
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {album.photos.length > 0 ? (
            album.photos.map((photo: any) => (
              <div
                key={photo.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">{photo.title}</h4>
                  <div className="flex space-x-4">
                    <Link to={`/photos/edit/${photo.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
                      Edit Title
                    </Link>
                    <button
                      onClick={() => openDeleteModal(photo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No photos available for this album.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        album={album}
        onAddPhotos={handleAddPhotos}
        title={modalType === "add" ? "Add Photos" : "Delete Photo"}
        footer={
          modalType === "add" ? (
            <p className="text-gray-500">Please select photos to upload.</p>
          ) : (
            <p className="text-gray-500">Are you sure you want to delete this photo?</p>
          )
        }
        onDeleteConfirm={modalType === "delete" ? handleDeletePhoto : undefined} // Pass delete handler only for delete modal
        children={undefined}
      />
    </div>
  );
};

export default AlbumDetails;
