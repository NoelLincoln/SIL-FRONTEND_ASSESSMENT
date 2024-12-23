import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import UserCard from "./UserCard";
import LoadingSpinner from "./LoadingSpinner";

const Home: React.FC = () => {
  // Fetch users and albums from the Redux state
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state: RootState) => state.users);
  const {
    albums,
    loading: albumsLoading,
    error: albumsError,
  } = useSelector((state: RootState) => state.albums);

  console.log("Users", users);

  // Calculate the number of albums for each user
  const getUserAlbumCount = useCallback(
    (userId: string) =>
      albums.filter((album) => album.userId === userId).length,
    [albums],
  );

  // Show a single spinner while data or authentication state is loading
  if (usersLoading || albumsLoading) {
    return <LoadingSpinner />;
  }

  if (usersError || albumsError) {
    return <div>Error: {usersError || albumsError}</div>;
  }

  // Filter out duplicate users based on the unique username
  const uniqueUsers = Array.from(
    new Map(users.map((user) => [user.username, user])).values()
  );

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Users List</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueUsers.map((user) => (
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
