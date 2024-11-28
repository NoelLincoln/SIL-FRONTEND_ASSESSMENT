// UserDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";

const UserDetails: React.FC = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userAlbums, setUserAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user details and albums
  useEffect(() => {
    const fetchUserDetailsAndAlbums = async () => {
      try {
        // Fetch user details
        const userResponse = await fetch(
          `http://localhost:5000/api/users/${userId}`,
          {
            method: "GET",
            credentials: "include",
          },
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
          },
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        {userDetails ? (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-2xl font-semibold">{userDetails.username}</h2>
            <p className="text-gray-700">Email: {userDetails.email}</p>
          </div>
        ) : (
          <div>No user data found</div>
        )}

        {/* Albums Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Albums</h3>
          {userAlbums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAlbums.map((album: any) => (
                <div
                  key={album.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h4 className="text-lg font-semibold">{album.title}</h4>
                </div>
              ))}
            </div>
          ) : (
            <p>No albums found for this user.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetails;
