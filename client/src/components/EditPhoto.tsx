import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPhotoById, updatePhotoTitle } from "../redux/slices/photoSlice
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import LoadingSpinner from "./LoadingSpinner"

const EditPhoto = () => {
  const { photoId } = useParams<{ photoId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedPhoto, loading, error } = useSelector((state: any) => state.photo);

  const [title, setTitle] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>("");

  useEffect(() => {
    if (photoId) {
      dispatch(fetchPhotoById(photoId)); // Fetch the photo data on load
    }
  }, [dispatch, photoId]);

  useEffect(() => {
    if (selectedPhoto) {
      setTitle(selectedPhoto.title || "");
      setUpdatedTitle(selectedPhoto.title || ""); // Initialize updatedTitle with the current photo title
    }
  }, [selectedPhoto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoId || !title.trim()) return;

    try {
      setIsUpdating(true);
      await dispatch(updatePhotoTitle({ id: photoId, title }));
      setUpdatedTitle(title); // Update the displayed title immediately
      toast.success("Photo title updated successfully!");
    } catch (err) {
      console.error("Error updating photo title", err);
      toast.error("Failed to update the photo title. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <LoadingSpinner/>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!selectedPhoto) {
    return <p className="text-center text-red-500">Photo not found</p>;
  }

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        {/* Photo name */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Photo name: {updatedTitle}
        </h2>

        {/* Photo preview */}
        <div className="mb-6">
          <img
            src={selectedPhoto.imageUrl}
            alt="Selected"
            className="w-full h-auto max-w-md rounded-lg"
          />
        </div>

        {/* Form to update photo title */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              New Photo Name
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=""
              required
            />
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full p-3 rounded-lg transition duration-200 ${
              isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isUpdating ? "Updating title..." : "Update Title"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPhoto;
