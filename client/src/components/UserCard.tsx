// UserCard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

type UserCardProps = {
  user: { id: string; username: string; email: string };
  albumCount: number;
};

const UserCard: React.FC<UserCardProps> = ({ user, albumCount }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the user details page with the userId in the URL
    navigate(`/users/${user.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white p-6 rounded-lg shadow-lg flex flex-col items-center transition-transform transform hover:scale-105"
    >
      <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
      <p className="text-gray-700">Email: {user.email}</p>
      <p className="text-gray-700">Albums: {albumCount}</p>
    </div>
  );
};

export default UserCard;
