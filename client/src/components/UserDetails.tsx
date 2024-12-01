import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner";
import {
  fetchUserDetails,
  fetchUserAlbums,
  fetchAlbumPhotos,
} from "../redux/slices/userSlice";
import { AppDispatch } from "../redux/store";

const UserDetails: React.FC = () => {
  const { userId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { userDetails, userAlbums, albumPhotos, loading, error, imageLoading } =
    useSelector((state: any) => state.users);

  // Fetch user details and albums when userId changes
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserDetails(userId));
      dispatch(fetchUserAlbums(userId));
    }
  }, [dispatch, userId]);

  // Fetch album photos once albums are available
  useEffect(() => {
    if (userId && userAlbums.length > 0) {
      dispatch(fetchAlbumPhotos(userId));
    }
  }, [dispatch, userId, userAlbums]);

  // Show loading spinner while any data is loading
  if (loading || imageLoading) {
    return <LoadingSpinner />;
  }

  // Show error if something went wrong during fetching
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

  return (
    <>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Details</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="mb-8">
            {userDetails ? (
              <h2 className="text-2xl font-semibold text-gray-700">
                Created By: <span className="text-blue-600">{userDetails.username}</span>
              </h2>
            ) : (
              <div className="text-gray-500">No user data found</div>
            )}
          </div>

          <hr className="my-6 border-t-2 border-gray-200" />

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Albums</h3>
            {userAlbums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAlbums.map((album: any) => (
                  <div
                    key={album.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300"
                  >
                    <h4 className="text-lg font-semibold mb-2">
                      <Link
                        to={`/albums/${album.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {album.title}
                      </Link>
                    </h4>
                    {imageLoading ? (
                      <LoadingSpinner />
                    ) : (
                      albumPhotos[album.id] && (
                        <img
                          src={albumPhotos[album.id]}
                          alt={album.title}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No albums found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
