import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import UserCard from "./UserCard";

const Home: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and albums
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const usersData = await response.json();
        setUsers(usersData);
        setLoading(false); // Set loading to false after data is fetched
      } catch (err: any) {
        setError("Error fetching users");
        setLoading(false);
      }
    };

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

  // Use useCallback to avoid unnecessary re-renders
  const getUserAlbumCount = useCallback(
    (userId: string) => {
      return albums.filter((album: any) => album.userId === userId).length;
    },
    [albums], // Only re-run the function if albums change
  );

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
              <UserCard
                key={user.id}
                user={user}
                albumCount={getUserAlbumCount(user.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
