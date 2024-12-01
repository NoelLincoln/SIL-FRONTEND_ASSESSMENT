import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPhotoById, updatePhotoTitle } from "../redux/reducers/photoSlice"; // Adjust the import path
import { AppDispatch } from "../redux/store";

const EditPhoto = () => {
  const { photoId } = useParams(); // Get the photoId from the URL
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedPhoto, loading, error } = useSelector((state: any) => state.photo);

  const [title, setTitle] = useState<string>(selectedPhoto?.title || "");
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!photoId) return;

    dispatch(fetchPhotoById(photoId));
  }, [dispatch, photoId]);

  useEffect(() => {
    if (selectedPhoto) {
      setTitle(selectedPhoto.title);
    }
  }, [selectedPhoto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPhoto) return;

    try {
      setFormLoading(true);
      await dispatch(updatePhotoTitle({ id: photoId, title }));
      navigate(`/photos/${photoId}`); // Redirect after successful update
    } catch (err) {
      console.error("Error updating photo title", err);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || formLoading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!selectedPhoto) return <p className="text-center text-red-500">Photo not found</p>;

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
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
              New Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new title"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Update Title
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPhoto;
