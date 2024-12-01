import React, { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../redux/reducers/userSlice";
import { fetchAlbums } from "../redux/reducers/albumSlice";
import { RootState, AppDispatch } from "../redux/store";
import Header from "./Header";
import UserCard from "./UserCard";
import LoadingSpinner from "./LoadingSpinner";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAlbums());
  }, [dispatch]);

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
