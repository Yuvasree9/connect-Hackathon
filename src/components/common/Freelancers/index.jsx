import React, { useEffect, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { getConnections } from "../../../api/FirestoreAPI";

export default function FreelanceUsers({ user, getCurrentUser, currentUser }) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (currentUser?.id && user?.id) {
      getConnections(currentUser.id, user.id, setIsConnected);
    }
  }, [currentUser?.id, user?.id]);

  if (!currentUser || !user) {
    return null; // or any loading indicator
  }

  return !isConnected ? (
    <div className="grid-child">
      <img src={user.imageLink} alt={`${user.name}'s profile`} />
      <p className="name">{user.name}</p>
      <p className="headline">{user.headline}</p>
      <h3 className="skills">Skills</h3>
      {Array.isArray(user.skills) ? (
        <ul>
          {user.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      ) : (
        <p>{user.skills}</p>
      )}

      <button onClick={() => getCurrentUser(user.id)}>
        <AiOutlineUsergroupAdd size={20} />
        Connect
      </button>
    </div>
  ) : null;
}
