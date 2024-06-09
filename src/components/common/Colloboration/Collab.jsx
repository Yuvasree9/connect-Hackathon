import React, { useState, useEffect } from "react";
import { getAllUsers, getCollaboratingUsers } from "../../../api/FirestoreAPI";

export default function Collab({ postId }) {
  const [collaboratingUsers, setCollaboratingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    // Fetch all users to map user IDs to user details
    getAllUsers(setAllUsers);
  }, []);

  useEffect(() => {
    // Fetch collaborating users for the specified project
    getCollaboratingUsers(postId)
      .then((users) => {
        setCollaboratingUsers(users);
      })
      .catch((error) => {
        console.error("Error fetching collaborating users: ", error);
      });
  }, [postId]);

  const getUserDetails = (userId) => {
    return allUsers.find((user) => user.id === userId);
  };

  return (
    <div>
      <h1>Collaborating Users</h1>
      <ul>
        {collaboratingUsers.map((userId) => {
          const user = getUserDetails(userId);
          return user ? (
            <li key={userId}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              {/* Add other user details as needed */}
            </li>
          ) : (
            <li key={userId}>Loading user details...</li>
          );
        })}
      </ul>
    </div>
  );
}
