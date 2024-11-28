import React, { useState, useEffect } from "react";
import Header from "./Header";

const Home: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and albums
  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          credentials: "include", // Include credentials for session
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();
        setUsers(usersData);
      } catch (err: any) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    // Fetch albums for each user
    const fetchAlbums = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/albums", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch albums");
        }
        const albumsData = await response.json();
        setAlbums(albumsData);
      } catch (err: any) {
        setError("Error fetching albums");
      }
    };

    fetchUsers();
    fetchAlbums();
  }, []);

  const getUserAlbumCount = (userId: string) => {
    return albums.filter((album: any) => album.userId === userId).length;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Users List</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center"
              >
                <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
                <p className="text-gray-700">Email: {user.email}</p>
                <p className="text-gray-700">
                  Albums: {getUserAlbumCount(user.id)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
