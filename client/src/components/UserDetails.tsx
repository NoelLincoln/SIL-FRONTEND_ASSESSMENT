import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import LoadingSpinner from "./LoadingSpinner";

const UserDetails: React.FC = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userAlbums, setUserAlbums] = useState<any[]>([]);
  const [albumPhotos, setAlbumPhotos] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  // Fetch user details and albums
  useEffect(() => {
    const fetchUserDetailsAndAlbums = async () => {
      setLoading(true);
      try {
        // Fetch user details
        const userResponse = await fetch(
          `http://localhost:5000/api/users/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user details");
        }
        const userData = await userResponse.json();
        setUserDetails(userData);

        // Fetch user's albums
        const albumsResponse = await fetch(
          `http://localhost:5000/api/albums?userId=${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!albumsResponse.ok) {
          throw new Error("Failed to fetch albums");
        }
        const albumsData = await albumsResponse.json();
        setUserAlbums(albumsData);
      } catch (err: any) {
        setError("Error fetching user data or albums");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetailsAndAlbums();
    }
  }, [userId]);

  // Fetch photos for each album
  useEffect(() => {
    const fetchPhotosForAlbums = async () => {
      setImageLoading(true);
      const photos: Record<string, string> = {};

      for (const album of userAlbums) {
        try {
          const photosResponse = await fetch(
            `http://localhost:5000/api/photos/albums/${album.id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          if (!photosResponse.ok) {
            throw new Error(`Failed to fetch photos for album ${album.id}`);
          }
          const photosData = await photosResponse.json();

          if (photosData.length > 0) {
            // Select the first photo or a random one
            const randomPhoto =
              photosData[Math.floor(Math.random() * photosData.length)];
            photos[album.id] = randomPhoto.imageUrl;
          } else {
            photos[album.id] = ""; // Default to no image
          }
        } catch (err: any) {
          console.error(
            `Error fetching photos for album ${album.id}: ${err.message}`
          );
        }
      }

      setAlbumPhotos(photos);
      setImageLoading(false);
    };

    if (userAlbums.length > 0) {
      fetchPhotosForAlbums();
    }
  }, [userAlbums]);

  if (loading) {
    return <LoadingSpinner />;
  }

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
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">User Details</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          {/* User Details Section */}
          <div className="mb-8">
            {userDetails ? (
              <>
                <h2 className="text-2xl font-semibold">
                  {userDetails.username}
                </h2>
                <p className="text-gray-700">Email: {userDetails.email}</p>
              </>
            ) : (
              <div>No user data found</div>
            )}
          </div>

          {/* Horizontal Line to Separate Sections */}
          <hr className="my-6 border-t-2 border-gray-200" />

          {/* Albums Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Albums</h3>
            {userAlbums.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userAlbums.map((album: any) => (
                  <div
                    key={album.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Album Title */}
                    <h4 className="text-lg font-semibold mb-2">
                      <Link
                        to={`/albums/${album.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {album.title}
                      </Link>
                    </h4>
                    {/* Album Image */}
                    {albumPhotos[album.id] ? (
                      <img
                        src={albumPhotos[album.id]}
                        alt={`${album.title} cover`}
                        className="w-full h-40 object-cover rounded-md mb-2"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2">
                        {imageLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <span className="text-gray-500">
                            No Image Available
                          </span>
                        )}
                      </div>
                    )}
                    {/* View Details Button */}
                    <Link
                      to={`/albums/${album.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Album Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>No albums found for this user.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
