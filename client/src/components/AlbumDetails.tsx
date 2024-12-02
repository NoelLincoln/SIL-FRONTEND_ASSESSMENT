import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link from react-router-dom
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import { fetchAlbums } from "../redux/slices/albumSlice";
import { AppDispatch } from "../redux/store";

const AlbumDetails: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { albums, loading, error } = useSelector((state: any) => state.albums);

  useEffect(() => {
    if (albumId) {
      dispatch(fetchAlbums());
    }
  }, [dispatch, albumId]);

  // Find the album based on the albumId
  const album = albums.find((album: any) => album.id === albumId);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
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
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Album: <span className="text-blue-600">{album.title}</span>
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Created by:{" "}
          <Link
            to={`/users/${album.userId}`}
            className="text-blue-600 hover:underline"
          >
            {album.username}
          </Link>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {album.photos.length > 0 ? (
            album.photos.map((photo: any) => (
              <div
                key={photo.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h4 className="text-lg font-semibold text-gray-700">{photo.title}</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600">
                    <Link to={`/photos/edit/${photo.id}`} className="hover:underline">
                      Edit Photo Title
                    </Link>
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No photos available for this album.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetails;
